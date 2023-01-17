// const fs = require('fs');

// require('@nomiclabs/hardhat-waffle');

// const privateKey = fs.readFileSync('.secret').toString().trim();

// module.exports = {
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//   },
//   solidity: '0.8.4',
// };

// require('@nomicfoundation/hardhat-toolbox');

// const ALCHEMY_API_KEY = 'Hkl3gRjaeweUgWKKphq8zqWHkCUuBxNP';

// const GOERLI_PRIVATE_KEY = '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

// module.exports = {
//   solidity: '0.8.4',
//   networks: {
//     goerli: {
//       url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
//       accounts: [GOERLI_PRIVATE_KEY],
//     },
//   },
// };

require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.4',
  networks: {
    goerli: {
      url: `${process.env.POKT_Goerli_URL}`,
      accounts: [`${process.env.Goerli_PRIVATE_KEY}`],
    },
  },
};
