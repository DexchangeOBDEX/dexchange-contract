const { ethers } = require('ethers');
const { Wallet, Provider, Contract } = require('zksync-web3');
const { expect } = require('chai');
const { Deployer } = require('@matterlabs/hardhat-zksync-deploy');
const hre = require('hardhat');
const { InvalidatedProjectKind } = require('typescript');

// Private Keys used here are for testing purpose and the account will be deleted.
// These will be stored securely as encrypted environment variables.

const RICH_WALLET_PK =
  '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';
const RICH_WALLET_PK2 =
  '0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3';
const RICH_WALLET_PK3 =
  '0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e';
const RICH_WALLET_PK4 =
  '0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8';
const RICH_WALLET_PK5 =
  '0xf12e28c0eb1ef4ff90478f6805b68d63737b7f33abfa091601140805da450d93';

const provider = Provider.getDefaultProvider();

const wallet = new Wallet(RICH_WALLET_PK, provider);
const feeAccount = new Wallet(RICH_WALLET_PK2, provider);
const exchange = new Wallet(RICH_WALLET_PK3, provider);
const user1 = new Wallet(RICH_WALLET_PK4, provider);
const user2 = new Wallet(RICH_WALLET_PK5, provider);

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('DeXchange', () => {
  let deXchange, token1, token2;
  const feePercent = 10;

  beforeEach(async () => {
    const deployer = new Deployer(hre, wallet);

    const Token = await deployer.loadArtifact('Token');
    token1 = await deployer.deploy(Token, ['My Token', 'MTK', 1000000]);

    await token1.deployed();

    token2 = await deployer.deploy(Token, ['My Token 2', 'MTK2', 1000000]);

    await token2.deployed();

    const DeXchange = await deployer.loadArtifact('DeXchange');
    deXchange = await deployer.deploy(DeXchange, [
      feeAccount.address,
      feePercent,
    ]);

    await deXchange.deployed();

    let transaction = await token1
      .connect(wallet)
      .transfer(user1.address, tokens(100));
    await transaction.wait();

    //console.log(`${Token.contractName} was deployed to ${token.address}`);
  });

  describe('Deploymnet', () => {
    it('Tracks the fee account', async () => {
      expect(await deXchange.feeAccount()).to.equal(feeAccount.address);
    });

    it('Tracks the fee percent', async () => {
      expect(await deXchange.feePercent()).to.equal(feePercent);
    });
  });

  describe('Deposit tokens', () => {
    let transaction, result;
    let amount = tokens(10);

    describe('Success', () => {
      beforeEach(async () => {
        //Approve
        transaction = await token1
          .connect(user1)
          .approve(deXchange.address, amount);
        await transaction.wait();
        //Deposit
        transaction = await deXchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();
      });

      it('Tracks the token deposit', async () => {
        expect(await token1.balanceOf(deXchange.address)).to.equal(amount);
        expect(
          await deXchange.tokensBalance(token1.address, user1.address)
        ).to.equal(amount);
        expect(
          await deXchange.balanceOf(token1.address, user1.address)
        ).to.equal(amount);
      });

      it('Emits a Deposit event', async () => {
        const logEvent = result.events[2];
        expect(logEvent.event).to.equal('Deposit');

        const args = logEvent.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(amount);
      });
    });

    describe('Failure', () => {
      it('Fails when no tokekns are approved', async () => {
        await expect(
          deXchange.connect(user1).depositToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe('Withdraw tokens', () => {
    let transaction, result;
    let amount = tokens(10);

    describe('Success', () => {
      beforeEach(async () => {
        //Deposit tokens before withdrawing
        //Approve
        transaction = await token1
          .connect(user1)
          .approve(deXchange.address, amount);
        await transaction.wait();
        //Deposit
        transaction = await deXchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();

        //Now withdraw tokens
        transaction = await deXchange
          .connect(user1)
          .withdrawToken(token1.address, amount);
        result = await transaction.wait();
      });

      it('Tracks the token withdrawl', async () => {
        expect(await token1.balanceOf(deXchange.address)).to.equal(0);
        expect(
          await deXchange.tokensBalance(token1.address, user1.address)
        ).to.equal(0);
        expect(
          await deXchange.balanceOf(token1.address, user1.address)
        ).to.equal(0);
      });

      it('Emits a Withdraw event', async () => {
        const logEvent = result.events[2];
        expect(logEvent.event).to.equal('Withdraw');

        const args = logEvent.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(0);
      });
    });

    describe('Failure', () => {
      it('Fails for insufficient balance', async () => {
        //Attempt to withdraw tokens without depositing
        await expect(
          deXchange.connect(user1).withdrawToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe('Check balances', () => {
    let transaction, result;
    let amount = tokens(1);

    beforeEach(async () => {
      //Approve
      transaction = await token1
        .connect(user1)
        .approve(deXchange.address, amount);
      await transaction.wait();
      //Deposit
      transaction = await deXchange
        .connect(user1)
        .depositToken(token1.address, amount);
      result = await transaction.wait();
    });

    it('Returns user balance', async () => {
      expect(await deXchange.balanceOf(token1.address, user1.address)).to.equal(
        amount
      );
    });
  });

  describe('Making orders', () => {
    let transaction, result;
    let amount = tokens(1);

    describe('Success', () => {
      beforeEach(async () => {
        //Deposit tokens before making order
        //Approve
        transaction = await token1
          .connect(user1)
          .approve(deXchange.address, amount);
        await transaction.wait();

        //Deposit
        transaction = await deXchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();

        //Make order
        transaction = await deXchange
          .connect(user1)
          .makeOrder(token2.address, amount, token1.address, amount);
        result = await transaction.wait();
      });

      it('Tracks newly created order', async () => {
        expect(await deXchange.orderCount()).to.equal(1);
      });

      it('Emits an OrderLogged event', async () => {
        const logEvent = result.events[1];
        expect(logEvent.event).to.equal('OrderLogged');

        const args = logEvent.args;
        expect(args.id).to.equal(1);
        expect(args.user).to.equal(user1.address);
        expect(args.tokenGet).to.equal(token2.address);
        expect(args.amountGet).to.equal(tokens(1));
        expect(args.tokenGive).to.equal(token1.address);
        expect(args.amountGive).to.equal(tokens(1));
        expect(args.timestamp).to.at.least(1);
      });
    });

    describe('Failure', () => {
      it('Rejcets with no token balance', async () => {
        await expect(
          deXchange
            .connect(user1)
            .makeOrder(token2.address, tokens(1), token1.address, tokens(1))
        ).to.be.reverted;
      });
    });
  });

  describe('Order actions', async () => {
    let transaction, result;
    let amount = tokens(1);

    beforeEach(async () => {
      // user1 Deposits tokens

      //Approve
      transaction = await token1
        .connect(user1)
        .approve(deXchange.address, amount);
      await transaction.wait();

      //Deposit
      transaction = await deXchange
        .connect(user1)
        .depositToken(token1.address, amount);
      result = await transaction.wait();

      //Give tokens to user2
      transaction = await token2
        .connect(wallet)
        .transfer(user2.address, tokens(100));
      result = await transaction.wait();

      transaction = await token2
        .connect(user2)
        .approve(deXchange.address, tokens(2));
      result = await transaction.wait();

      transaction = await deXchange
        .connect(user2)
        .depositToken(token2.address, tokens(2));
      result = await transaction.wait();

      //Make order
      transaction = await deXchange
        .connect(user1)
        .makeOrder(token2.address, amount, token1.address, amount);
      result = await transaction.wait();
    });

    describe('Cancelling orders', async () => {
      describe('Success', () => {
        beforeEach(async () => {
          transaction = await deXchange.connect(user1).cancelOrder(1);
          result = await transaction.wait();
        });

        it('Updates cancelled order', async () => {
          expect(await deXchange.orderCancelled(1)).to.equal(true);
        });

        it('Emits a Cancel event', async () => {
          const logEvent = result.events[1];
          expect(logEvent.event).to.equal('Cancel');

          const args = logEvent.args;
          expect(args.id).to.equal(1);
          expect(args.user).to.equal(user1.address);
          expect(args.tokenGet).to.equal(token2.address);
          expect(args.amountGet).to.equal(tokens(1));
          expect(args.tokenGive).to.equal(token1.address);
          expect(args.amountGive).to.equal(tokens(1));
          expect(args.timestamp).to.at.least(1);
        });
      });

      describe('Failure', () => {
        beforeEach(async () => {
          // user1 Deposits tokens
          //Approve
          transaction = await token1
            .connect(user1)
            .approve(deXchange.address, amount);
          await transaction.wait();

          //Deposit
          transaction = await deXchange
            .connect(user1)
            .depositToken(token1.address, amount);
          result = await transaction.wait();

          //Make order
          transaction = await deXchange
            .connect(user1)
            .makeOrder(token2.address, amount, token1.address, amount);
          result = await transaction.wait();
        });

        it('Rejects invalid order ids', async () => {
          const invalidOrderId = 8898;
          await expect(deXchange.connect(user1).cancelOrder(invalidOrderId)).to
            .be.reverted;
        });

        it('Rejects if unauthorized user cancels', async () => {
          await expect(deXchange.connect(user2).cancelOrder(1)).to.be.reverted;
        });
      });
    });

    describe('Filling orders', () => {
      describe('Success', () => {
        beforeEach(async () => {
          //user2 fills order
          transaction = await deXchange.connect(user2).fillOrder('1');
          result = await transaction.wait();
        });

        it('Executes a trade and charge fee', async () => {
          // Token Give
          expect(
            await deXchange.balanceOf(token1.address, user1.address)
          ).to.equal(tokens(0));
          expect(
            await deXchange.balanceOf(token1.address, user2.address)
          ).to.equal(tokens(1));
          expect(
            await deXchange.balanceOf(token1.address, feeAccount.address)
          ).to.equal(tokens(0));
          // Token Get
          expect(
            await deXchange.balanceOf(token2.address, user1.address)
          ).to.equal(tokens(1));
          expect(
            await deXchange.balanceOf(token2.address, user2.address)
          ).to.equal(tokens(0.9));
          expect(
            await deXchange.balanceOf(token2.address, feeAccount.address)
          ).to.equal(tokens(0.1));
        });

        it('Updates filled order', async () => {
          expect(await deXchange.orderFilled(1)).to.equal(true);
        });

        it('Emits a Trade event', async () => {
          const logEvent = result.events[1];
          expect(logEvent.event).to.equal('Trade');

          const args = logEvent.args;
          expect(args.id).to.equal(1);
          expect(args.user).to.equal(user2.address);
          expect(args.tokenGet).to.equal(token2.address);
          expect(args.amountGet).to.equal(tokens(1));
          expect(args.tokenGive).to.equal(token1.address);
          expect(args.amountGive).to.equal(tokens(1));
          expect(args.creator).to.equal(user1.address);
          expect(args.timestamp).to.at.least(1);
        });
      });
    });

    describe('Failure', () => {
      it('rejects invalid order ids', async () => {
        const invalidOrderId = 88988;
        await expect(deXchange.connect(user2).fillOrder(invalidOrderId)).to.be
          .reverted;
      });

      it('rejects already filled orders', async () => {
        transaction = await deXchange.connect(user2).fillOrder(1);
        await transaction.wait();

        await expect(deXchange.connect(user2).fillOrder(1)).to.be.reverted;
      });

      it('Rejects canceled orders', async () => {
        transaction = await deXchange.connect(user1).cancelOrder(1);
        await transaction.wait();

        await expect(deXchange.connect(user2).fillOrder(1)).to.be.reverted;
      });
    });
  });
});
