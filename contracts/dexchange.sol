//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title Contract for Dexchange app
/// @author Amit Sharma
/// @notice The contract may be updated over period of time
contract DeXchange is Ownable {
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

    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );

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
        address walletAddress;
        uint256 quantity;
        bytes walletSignature;
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
        (uint256 buyQuantity, uint256 sellQuantity) = verifyAndInvalidateHash(
            _buy,
            _sell,
            _order
        );
        require(buyQuantity != 0 && sellQuantity != 0);

        uint256 _feeAmountBuyer = (buyQuantity * feePercent) / 100;
        uint256 _feeAmountSeller = (sellQuantity * feePercent) / 100;

        require(
            tokensBalance[_order.quoteAsset][_buy.walletAddress] >= sellQuantity
        );
        require(
            tokensBalance[_order.baseAsset][_sell.walletAddress] >= buyQuantity
        );

        tokensBalance[_order.baseAsset][feeAccount] += _feeAmountBuyer;
        tokensBalance[_order.quoteAsset][feeAccount] += _feeAmountSeller;

        tokensBalance[_order.quoteAsset][_buy.walletAddress] -= sellQuantity;
        tokensBalance[_order.baseAsset][_sell.walletAddress] -= buyQuantity;
        tokensBalance[_order.quoteAsset][_sell.walletAddress] += (_sell
            .quantity - _feeAmountSeller);
        tokensBalance[_order.baseAsset][_buy.walletAddress] += (buyQuantity -
            _feeAmountBuyer);
    }

    function verifyAndInvalidateHash(
        Order memory _buyOrder,
        Order memory _sellOrder,
        OrderBookTrade memory orderBookTrade
    ) internal returns (uint256 buyQuantity, uint256 sellQuantity) {
        bytes32 messageHashBuyer = getHash(
            _buyOrder.nonce,
            _buyOrder.walletAddress,
            orderBookTrade.market,
            orderBookTrade.orderType,
            orderBookTrade.orderSide,
            _buyOrder.quantity
        );
        bytes32 signedMessageHashBuyer = messageHashBuyer
            .toEthSignedMessageHash();

        require(
            !_completedOrderHashes[signedMessageHashBuyer],
            "Order already executed!"
        );
        address buyer = signedMessageHashBuyer.recover(
            _buyOrder.walletSignature
        );
        require(buyer == _buyOrder.walletAddress, "Invalid signature");

        bytes32 messageHashSeller = getHash(
            _sellOrder.nonce,
            _sellOrder.walletAddress,
            orderBookTrade.market,
            orderBookTrade.orderType,
            orderBookTrade.orderSide,
            _sellOrder.quantity
        );
        bytes32 signedMessageHashSeller = messageHashSeller
            .toEthSignedMessageHash();

        require(
            !_completedOrderHashes[signedMessageHashSeller],
            "Order already executed!"
        );
        address seller = signedMessageHashSeller.recover(
            _sellOrder.walletSignature
        );
        require(seller == _sellOrder.walletAddress, "Invalid signature");

        buyQuantity = _buyOrder.quantity = _partiallyFilledOrderQuantity[
            signedMessageHashBuyer
        ];
        sellQuantity = _sellOrder.quantity = _partiallyFilledOrderQuantity[
            signedMessageHashSeller
        ];

        if (buyQuantity == sellQuantity) {
            _completedOrderHashes[signedMessageHashBuyer] = true;
            _completedOrderHashes[signedMessageHashSeller] = true;
        } else if (buyQuantity < sellQuantity) {
            _completedOrderHashes[signedMessageHashBuyer] = true;
            _partiallyFilledOrderQuantity[
                signedMessageHashSeller
            ] += sellQuantity;
        } else {
            _completedOrderHashes[signedMessageHashSeller] = true;
            _partiallyFilledOrderQuantity[
                signedMessageHashBuyer
            ] += buyQuantity;
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

    /// @notice The abstraction for trade function, param are fetched from order.
    /// @param _orderId order id to be filled.
    /// @param _user user address who created the order
    /// @param _tokenGet token user wants to get in exchange.
    /// @param _amountGet amount user wants to get.
    /// @param _tokenGive token user wants to give.
    /// @param _amountGive amount user wants to give.
    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // msg.sender is the user who filled the order, while _user is who created order
        tokensBalance[_tokenGet][msg.sender] -= (_amountGet + _feeAmount);
        tokensBalance[_tokenGet][_user] += _amountGet;

        // charge fee
        tokensBalance[_tokenGet][feeAccount] += _feeAmount;

        tokensBalance[_tokenGive][_user] -= _amountGive;
        tokensBalance[_tokenGive][msg.sender] += _amountGive;

        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}
