const { ethers } = require("ethers");
const { Wallet, Provider, Contract } = require("zksync-web3");
const { expect } = require("chai");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
const RICH_WALLET_PK2 = "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3";
const RICH_WALLET_PK3 = "0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e";

const provider = Provider.getDefaultProvider();

const wallet = new Wallet(RICH_WALLET_PK, provider);
const wallet2 = new Wallet(RICH_WALLET_PK2, provider);
const exchange = new Wallet(RICH_WALLET_PK3, provider);

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}


describe('Token', () => {
    let token;

    beforeEach(async () => {
        const deployer = new Deployer(hre, wallet);

        const Token = await deployer.loadArtifact('Token');
        token =  await deployer.deploy(Token, ['My Token', 'MTK', 1000000]);

        await token.deployed();

        //console.log(`${Token.contractName} was deployed to ${token.address}`);
    });

    describe('Deployment', () => {
        const name = 'My Token';
        const symbol = 'MTK';
        const decimals = '18';
        const totalSupply = '1000000';

        it('Token has name', async () => {
            expect(await token.name()).to.equal(name);
        });
    
        it('Token has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol);
        });
    
        it('Token has correct decimals', async () => {
            expect(await token.decimals()).to.equal(decimals);
        });
    
        it('Token has a correct total supply', async () => {
            // const value = ethers.utils.parseUnits('1000000', 'ether');
            expect(await token.totalSupply()).to.equal(tokens(totalSupply));
        });

        it('Assign total supply to deployer', async () => {
            expect(await token.balanceOf(wallet.address)).to.equal(tokens(totalSupply));
        });

    });

    describe('Sending Token', () => {
        let amount, transaction, result;

        describe('success', () => {

            beforeEach(async () => {
                amount = tokens(100);
                transaction = await token.connect(wallet).transfer(wallet2.address, amount);
                result = await transaction.wait();
            });
    
    
            //Successfully passed
            it('Transfers token balance', async () => {
                expect(await token.balanceOf(wallet.address)).to.equal(tokens(999900));
                expect(await token.balanceOf(wallet2.address)).to.equal(amount);   
            });
    
            it('Emits a Transfer event', async () => {
                const logEvent = result.events[1];
                expect(logEvent.event).to.equal('Transfer');
                
                const args = logEvent.args;
                expect(args.from).to.equal(wallet.address);
                //console.log("CHeckpoint2: ", wallet2.address); // 0xa61464658AfeAf65CccaaFD3a512b69A83B77618
                //console.log("Checkpoint2.1", args.to); // 0xa61464658AfeAf65CccaaFD3a512b69A83B77618
                expect(args.to).to.equal(wallet2.address); 
                expect(args.value).to.equal(amount);
            });
        });
        
        describe('Failure', () => {
            it('Rejects insufficient balance', async () => {
                const invalidAmount = tokens(500000000);
                await expect(token.connect(wallet).transfer(wallet2.address, invalidAmount)).to.be.reverted;
            });

            it('Rejects invalid recipient', async () => {
                const amount = tokens(250);
                await expect(token.connect(wallet).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
            });
        });
    });

    describe('Approving Tokens', () => {
        let amount2, transaction2, result2;

        describe('Success', () => {

            beforeEach(async () => {
                amount2 = tokens(100);
                transaction2= await token.connect(wallet).approve(exchange.address, amount2);
                result2 = await transaction2.wait();
            });

            it('Allocates an allowance for delegated token spending', async () => {
                expect(await token.allowance(wallet.address, exchange.address)).to.equal(amount2);
            });

            it('Emits an approval event', async () =>{
                const logEvent = result2.events[1];
                expect(logEvent.event).to.equal('Approval');

                const args = logEvent.args;
                expect(args.owner).to.equal(wallet.address);
                expect(args.spender).to.equal(exchange.address);
                expect(args.value).to.equal(amount2);
            });
        });

        describe('Failure', () => {
            it('Rejects invalid spenders', async () => {
                const amount = tokens(300);
                await expect(token.connect(wallet).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
            });
        });

    });

    describe('Delegated Token Transfers', () => {
        let amount, transaction, result;

        beforeEach(async () => {
            amount = tokens(100);
            transaction = await token.connect(wallet).approve(exchange.address, amount);
            result = await transaction.wait();
        });

        describe('Success', () => {
            beforeEach(async () => {
                transaction = await token.connect(exchange).transferFrom(wallet.address ,wallet2.address, amount);
                result = await transaction.wait();
            });

            it('Transfers token balance', async() => {
                expect(await token.balanceOf(wallet.address)).to.equal(tokens(999900));
                expect(await token.balanceOf(wallet2.address)).to.equal(amount);   
            });

            it('Resets the allowance', async () => {
                expect (await token.allowance(wallet.address, exchange.address)).to.be.equal(0);
            });

            it('Emits a Transfer event', async () => {
                const logEvent = result.events[1];
                expect(logEvent.event).to.equal('Transfer');
                
                const args = logEvent.args;
                expect(args.from).to.equal(wallet.address);
                expect(args.to).to.equal(wallet2.address); 
                expect(args.value).to.equal(amount);
            });
        });

        describe('Failure', () => {
            it('Rejects invalid amount transfer', async () => {
                const invalidAmount = tokens(100000000);
                await expect(token.connect(exchange).transferFrom(wallet.address, wallet2.address, invalidAmount)).to.be.reverted;
            });

        });
    });

});
