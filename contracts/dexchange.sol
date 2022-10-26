//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title Contract for Dexchange app
/// @author Amit Sharma
/// @notice The contract may be updated over period of time
contract Dexchange is Ownable {
    using ECDSA for bytes32;

    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokensBalance;
    mapping(bytes32 => bool) private _completedOrderHashes;
    mapping(bytes32 => uint256) private _partiallyFilledOrderQuantity;

    /// @notice Events emitted by the contract.
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
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
    /// @param _token The address of the token to be deposited.
    /// @param _amount Takes number as input for the amount of token to be deposited.
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        require(
            IERC20(_token).transferFrom(msg.sender, address(this), _amount),
            "depositToken: Error in depositing tokens"
        );
        // update user balance
        tokensBalance[_token][msg.sender] += _amount;
        // Emit event
        emit Deposit(
            _token,
            msg.sender,
            _amount,
            tokensBalance[_token][msg.sender]
        );
    }

    /// @notice The function to withdraw tokens from the contract to the user wallet.
    /// @param _token The address of the token to be withdrawn.
    /// @param _amount Takes number as input for the amount of token to be withdrawn.
    function withdrawToken(address _token, uint256 _amount) public {
        // Ensure user has enough tokens to withdraw
        require(tokensBalance[_token][msg.sender] >= _amount);

        // Update the balance
        tokensBalance[_token][msg.sender] -= _amount;

        // Transfer tokens to the user
        IERC20(_token).transfer(msg.sender, _amount);

        // Emit an event
        emit Withdraw(
            _token,
            msg.sender,
            _amount,
            tokensBalance[_token][msg.sender]
        );
    }

    /// @notice check balance of tokens held by user in the contract
    function balanceOf(address _token, address _user)
        public
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
            _buyOrder.amount
        );
        bytes32 signedMessageHashBuyer = messageHashBuyer
            .toEthSignedMessageHash();

        require(
            !_completedOrderHashes[signedMessageHashBuyer],
            "Order already executed!"
        );

        address buyer = signedMessageHashBuyer.recover(_buyOrder.signature);
        require(buyer == _buyOrder.user, "Invalid signature");

        bytes32 messageHashSeller = getHash(
            _sellOrder.nonce,
            _sellOrder.user,
            orderBookTrade.market,
            orderBookTrade.orderType,
            orderBookTrade.orderSide,
            _sellOrder.amount
        );
        bytes32 signedMessageHashSeller = messageHashSeller
            .toEthSignedMessageHash();

        require(
            !_completedOrderHashes[signedMessageHashSeller],
            "Order already executed!"
        );

        address seller = signedMessageHashSeller.recover(_sellOrder.signature);
        require(seller == _sellOrder.user, "Invalid signature");

        uint256 buyAmount = _buyOrder.amount = _partiallyFilledOrderQuantity[
            signedMessageHashBuyer
        ];
        uint256 sellAmount = _sellOrder.amount = _partiallyFilledOrderQuantity[
            signedMessageHashSeller
        ];

        if (buyAmount == sellAmount) {
            _completedOrderHashes[signedMessageHashBuyer] = true;
            _completedOrderHashes[signedMessageHashSeller] = true;
            return buyAmount;
        } else if (buyAmount < sellAmount) {
            _completedOrderHashes[signedMessageHashBuyer] = true;
            _partiallyFilledOrderQuantity[signedMessageHashSeller] += buyAmount;
            return buyAmount;
        } else {
            _completedOrderHashes[signedMessageHashSeller] = true;
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
        uint256 _quantity
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _nonce,
                    _wallet,
                    _market,
                    _type,
                    _side,
                    _quantity
                )
            );
    }
}
