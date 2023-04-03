import { Wallet } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the DeXchange contract`);

  const RICH_WALLET_PK = 'c32a630a9259a46500937491756b97aa2815190f8b5a92c16007d35d84251ba3';

  // Initialize the wallet.
  const wallet = new Wallet(RICH_WALLET_PK);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const Dexchange = await deployer.loadArtifact('Dexchange');

  const dexchange = await deployer.deploy(Dexchange, [
    '0x3094B3c9D98f0C8C715b410259568495A4a32526',
    '0x3094B3c9D98f0C8C715b410259568495A4a32526',
    1,
  ]);

  // Show the contract info.
  const contractAddress = dexchange.address;
  console.log(`${Dexchange.contractName} was deployed to ${contractAddress}`);
}
