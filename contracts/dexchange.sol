//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title Contract for Dexchange app
/// @author Amit Sharma
/// @notice The contract may be updated over period of time
contract Dexchange is Ownable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    address public forwarder;
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokensBalance;
    mapping(bytes32 => bool) private _nonces;
    mapping(bytes32 => uint256) private _partiallyFilledOrderQuantity;

    /// @notice Events emitted by the contract.
    event Deposit(address token, address user, uint256 amount);
    event Withdraw(address token, address user, uint256 amount);

    constructor(
        address _forwarder,
        address _feeAccount,
        uint256 _feePercent
    ) {
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
        string memory _nonce,
        bytes memory _signature
    ) external {
        _verifySig(_token, _owner, _value, _nonce, _signature);
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
        string memory _nonce,
        bytes memory _signature
    ) external {
        _verifySig(_token, _owner, _value, _nonce, _signature);
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
        bytes signature;
    }

    struct OrderBookTrade {
        string market;
        string orderType;
        string orderSide;
        address baseAsset;
        address quoteAsset;
        uint256 rate;
    }

    function trade(
        Order memory _buy,
        Order memory _sell,
        OrderBookTrade memory _order
    ) external {
        uint256 orderAmount = verify(_buy, _sell, _order);
        require(orderAmount != 0);

        uint256 buyAmount = (orderAmount * 1e8) / _order.rate;
        uint256 _feeAmountBuyer = (orderAmount * feePercent) / 100;
        uint256 _feeAmountSeller = (buyAmount * feePercent) / 100;

        require(tokensBalance[_order.quoteAsset][_buy.user] >= buyAmount);
        require(tokensBalance[_order.baseAsset][_sell.user] >= orderAmount);

        tokensBalance[_order.baseAsset][feeAccount] += _feeAmountBuyer;
        tokensBalance[_order.quoteAsset][feeAccount] += _feeAmountSeller;

        tokensBalance[_order.quoteAsset][_buy.user] -= buyAmount;
        tokensBalance[_order.baseAsset][_sell.user] -= orderAmount;
        tokensBalance[_order.quoteAsset][_sell.user] += (buyAmount -
            _feeAmountSeller);
        tokensBalance[_order.baseAsset][_buy.user] += (orderAmount -
            _feeAmountBuyer);
    }

    function verify(
        Order memory _buyOrder,
        Order memory _sellOrder,
        OrderBookTrade memory orderBookTrade
    ) internal returns (uint256 orderAmount) {
        bytes32 messageHashBuyer = getHash(
            _buyOrder.nonce,
            _buyOrder.user,
            orderBookTrade.market,
            orderBookTrade.orderType,
            orderBookTrade.orderSide,
            _buyOrder.amount,
            orderBookTrade.rate
        );
        bytes32 signedMessageHashBuyer = messageHashBuyer
            .toEthSignedMessageHash();

        require(!_nonces[signedMessageHashBuyer], "Order already executed!");

        address buyer = signedMessageHashBuyer.recover(_buyOrder.signature);
        require(buyer == _buyOrder.user, "Invalid signature");

        bytes32 messageHashSeller = getHash(
            _sellOrder.nonce,
            _sellOrder.user,
            orderBookTrade.market,
            orderBookTrade.orderType,
            orderBookTrade.orderSide,
            _sellOrder.amount,
            orderBookTrade.rate
        );
        bytes32 signedMessageHashSeller = messageHashSeller
            .toEthSignedMessageHash();

        require(!_nonces[signedMessageHashSeller], "Order already executed!");

        address seller = signedMessageHashSeller.recover(_sellOrder.signature);
        require(seller == _sellOrder.user, "Invalid signature");

        uint256 buyAmount = _buyOrder.amount = _partiallyFilledOrderQuantity[
            signedMessageHashBuyer
        ];
        uint256 sellAmount = _sellOrder.amount = _partiallyFilledOrderQuantity[
            signedMessageHashSeller
        ];

        if (buyAmount == sellAmount) {
            _nonces[signedMessageHashBuyer] = true;
            _nonces[signedMessageHashSeller] = true;
            return buyAmount;
        } else if (buyAmount < sellAmount) {
            _nonces[signedMessageHashBuyer] = true;
            _partiallyFilledOrderQuantity[signedMessageHashSeller] += buyAmount;
            return buyAmount;
        } else {
            _nonces[signedMessageHashSeller] = true;
            _partiallyFilledOrderQuantity[signedMessageHashBuyer] += sellAmount;
            return sellAmount;
        }
    }

    function getHash(
        string memory _nonce,
        address _wallet,
        string memory _market,
        string memory _type,
        string memory _side,
        uint256 _quantity,
        uint256 _rate
    ) public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    block.chainid,
                    _nonce,
                    _wallet,
                    _market,
                    _type,
                    _side,
                    _quantity,
                    _rate
                )
            );
    }

    function _verifySig(
        address _token,
        address _owner,
        uint256 _value,
        string memory _nonce,
        bytes memory _signature
    ) internal {
        bytes32 hash = keccak256(
            abi.encodePacked(
                block.chainid,
                _nonce,
                _token,
                _owner,
                address(this),
                _value
            )
        );
        bytes32 signedHash = hash.toEthSignedMessageHash();
        require(!_nonces[signedHash], "Invalid nonce");
        address signer = signedHash.recover(_signature);
        require(_owner == signer, "Invalid signature");
        _nonces[signedHash] = true;
    }
}
