require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomiclabs/hardhat-ethers');

const zkSyncDeploy =
  process.env.NODE_ENV == 'test'
    ? {
        zkSyncNetwork: 'http://localhost:3050',
        ethNetwork: 'http://localhost:8545',
      }
    : {
        zkSyncNetwork: 'https://zksync2-testnet.zksync.dev',
        ethNetwork: 'goerli',
      };

module.exports = {
  zksolc: {
    version: '1.1.6',
    compilerSource: 'docker',
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: 'matterlabs/zksolc',
        tag: 'v1.1.6',
      },
    },
  },
  zkSyncDeploy,
  solidity: {
    version: '0.8.16',
  },
  networks: {
    // To compile with zksolc, this must be the default network.
    hardhat: {
      zksync: true,
    },
  },
};
