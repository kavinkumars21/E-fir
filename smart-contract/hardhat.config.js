require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337 // Change this if necessary
    }
  },
  solidity: "0.8.24",
};
