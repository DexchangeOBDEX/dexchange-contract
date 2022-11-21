//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

/// @title Contract for Dexchange app
/// @author Amit Sharma
/// @notice The contract may be updated over period of time
contract Dexchange is EIP712, Ownable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    address public forwarder;
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokensBalance;
    mapping(bytes32 => bool) private _nonces;
    mapping(bytes32 => uint256) private _partiallyFilledOrderQuantity;

    bytes32 private constant _DEPOSIT_TYPEHASH =
        keccak256(
            "DepositToken(uint256 chainId,string nonce,address userAddress,address token,uint256 amount)"
        );
    bytes32 private constant _WITHDRAW_TYPEHASH =
        keccak256(
            "WithdrawToken(uint256 chainId,string nonce,address userAddress,address token,uint256 amount)"
        );
    bytes32 private constant _ORDER_TYPEHASH =
        keccak256(
            "Order(uint256 chainId,string nonce,address userAddress,uint256 amount,string market,string orderType,string orderSide,uint256 rate)"
        );

    /// @notice Events emitted by the contract.
    event Deposit(address token, address user, uint256 amount);
    event Withdraw(address token, address user, uint256 amount);

    constructor(
        address _forwarder,
        address _feeAccount,
        uint256 _feePercent
    ) EIP712("Dexchange", "1") {
        forwarder = _forwarder;
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    modifier onlyForwarder() {
        require(msg.sender == forwarder);
        _;
    }

    function setForwarder(address _forwarder) external onlyOwner {
        forwarder = _forwarder;
    }

    /// @notice The function to set the trade fee.
    /// @dev This will be modified to ownable function to enable updates in future.
    /// @param _feeAccount Takes the address as an input
    /// @param _feePercent Takes number as input for fee percentage
    function setFee(address _feeAccount, uint256 _feePercent)
        external
        onlyOwner
    {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    /************************************** DEPOSIT & WITHDRAW TOKENS *************************************************************/

    /// @notice The function to deposit tokens from user wallet to the contract.
    //TODO: Only allow forwarder
    function depositToken(
        address _token,
        address _owner,
        uint256 _value,
        string calldata _nonce,
        bytes calldata _signature
    ) external {
        bytes32 digest = _calculateDigest(
            keccak256(
                abi.encode(
                    _DEPOSIT_TYPEHASH,
                    block.chainid,
                    keccak256(bytes(_nonce)),
                    _owner,
                    _token,
                    _value
                )
            )
        );
        _validateRecoveredAddress(digest, _owner, _signature);
        _nonces[digest] = true;
        IERC20(_token).safeTransferFrom(_owner, address(this), _value);
        tokensBalance[_token][_owner] += _value;
        emit Deposit(_token, _owner, _value);
    }

    /// @notice The function to withdraw tokens from the contract to the user wallet.
    //TODO: Only allow forwarder
    function withdrawToken(
        address _token,
        address _owner,
        uint256 _value,
        string calldata _nonce,
        bytes calldata _signature
    ) external {
        bytes32 digest = _calculateDigest(
            keccak256(
                abi.encode(
                    _WITHDRAW_TYPEHASH,
                    block.chainid,
                    keccak256(bytes(_nonce)),
                    _owner,
                    _token,
                    _value
                )
            )
        );
        _validateRecoveredAddress(digest, _owner, _signature);
        _nonces[digest] = true;
        require(tokensBalance[_token][_owner] >= _value);
        tokensBalance[_token][_owner] -= _value;
        IERC20(_token).safeTransfer(_owner, _value);
        emit Withdraw(_token, _owner, _value);
    }

    /// @notice check balance of tokens held by user in the contract
    function balanceOf(address _token, address _user)
        external
        view
        returns (uint256)
    {
        return tokensBalance[_token][_user];
    }

    /************************************** Executing orders *************************************************************/

    struct Order {
        string nonce;
        address user;
        uint256 amount;
        string orderType;
        string orderSide;
        uint256 rate;
        bytes signature;
    }

    struct OrderBookTrade {
        string market;
        address baseAsset;
        address quoteAsset;
    }

    function trade(
        Order calldata _buy,
        Order calldata _sell,
        OrderBookTrade calldata _order
    ) external {
        uint256 orderAmount = _verify(_buy, _sell, _order);
        require(orderAmount != 0, "Invalid order");

        uint256 buyAmount = (
            orderAmount * _buy.rate == 0 ? _sell.rate : _buy.rate
        ) / 10**IERC20Metadata(_order.baseAsset).decimals();
        uint256 _feeAmountBuyer = (orderAmount * feePercent) / 1000;
        uint256 _feeAmountSeller = (buyAmount * feePercent) / 1000;

        require(
            tokensBalance[_order.quoteAsset][_buy.user] >= buyAmount,
            "Buyer: Insuffient balance"
        );
        require(
            tokensBalance[_order.baseAsset][_sell.user] >= orderAmount,
            "Seller: Insufficient balance"
        );

        tokensBalance[_order.baseAsset][feeAccount] += _feeAmountBuyer;
        tokensBalance[_order.quoteAsset][feeAccount] += _feeAmountSeller;

        tokensBalance[_order.quoteAsset][_buy.user] -= buyAmount;
        tokensBalance[_order.baseAsset][_sell.user] -= orderAmount;
        tokensBalance[_order.quoteAsset][_sell.user] += (buyAmount -
            _feeAmountSeller);
        tokensBalance[_order.baseAsset][_buy.user] += (orderAmount -
            _feeAmountBuyer);
    }

    function _verify(
        Order calldata _buyOrder,
        Order calldata _sellOrder,
        OrderBookTrade calldata orderBookTrade
    ) internal returns (uint256) {
        bytes32 buyOrderDigest = _calculateDigest(
            keccak256(
                abi.encode(
                    _ORDER_TYPEHASH,
                    block.chainid,
                    keccak256(bytes(_buyOrder.nonce)),
                    _buyOrder.user,
                    _buyOrder.amount,
                    keccak256(bytes(orderBookTrade.market)),
                    keccak256(bytes(_buyOrder.orderType)),
                    keccak256(bytes(_buyOrder.orderSide)),
                    _buyOrder.rate
                )
            )
        );
        _validateRecoveredAddress(
            buyOrderDigest,
            _buyOrder.user,
            _buyOrder.signature
        );

        bytes32 sellOrderDigest = _calculateDigest(
            keccak256(
                abi.encode(
                    _ORDER_TYPEHASH,
                    block.chainid,
                    keccak256(bytes(_sellOrder.nonce)),
                    _sellOrder.user,
                    _sellOrder.amount,
                    keccak256(bytes(orderBookTrade.market)),
                    keccak256(bytes(_sellOrder.orderType)),
                    keccak256(bytes(_sellOrder.orderSide)),
                    _sellOrder.rate
                )
            )
        );
        _validateRecoveredAddress(
            sellOrderDigest,
            _sellOrder.user,
            _sellOrder.signature
        );

        uint256 buyAmount = _buyOrder.amount -
            _partiallyFilledOrderQuantity[buyOrderDigest];
        uint256 sellAmount = _sellOrder.amount -
            _partiallyFilledOrderQuantity[sellOrderDigest];

        if (buyAmount == sellAmount) {
            _nonces[buyOrderDigest] = true;
            _nonces[sellOrderDigest] = true;
            return buyAmount;
        } else if (buyAmount < sellAmount) {
            _nonces[buyOrderDigest] = true;
            _partiallyFilledOrderQuantity[sellOrderDigest] += buyAmount;
            return buyAmount;
        } else {
            _nonces[sellOrderDigest] = true;
            _partiallyFilledOrderQuantity[buyOrderDigest] += sellAmount;
            return sellAmount;
        }
    }

    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function _validateRecoveredAddress(
        bytes32 digest,
        address expectedAddress,
        bytes calldata sig
    ) internal view {
        require(!_nonces[digest], "Invalid nonce");
        address recoveredAddress = digest.recover(sig);
        require(recoveredAddress == expectedAddress, "Invalid signer");
    }

    function _calculateDigest(bytes32 hashedMessage)
        internal
        view
        returns (bytes32)
    {
        return _hashTypedDataV4(hashedMessage);
    }
}
