const Web3 = require('web3');
const { ENDPOINT } = require('./constants');
const web3 = new Web3(new Web3.providers.WebsocketProvider(ENDPOINT.FUJI));
// abi of ERC20
const erc20Abi = require('../../../abi/ERC20.json');

async function getBalance(poolAddress, userAddress) {
    let poolToken = new web3.eth.Contract(erc20Abi, poolAddress);
    let balance = await poolToken.methods.balanceOf(userAddress).call();
    // console.log(`balance=${balance}`);
    return balance;
}

async function getDecimals(poolAddress) {
    let poolToken = new web3.eth.Contract(erc20Abi, poolAddress);
    let decimals = await poolToken.methods.decimals().call();
    // console.log(`decimals=${decimals}`);
    return decimals;
}

async function getTotalSupply(poolAddress) {
    let poolToken = new web3.eth.Contract(erc20Abi, poolAddress);
    let totalSupply = await poolToken.methods.totalSupply().call();
    // console.log(`totalSupply=${totalSupply}`);
    return totalSupply;
}

// getBalance('0x0eb68e04ebeea06fd60d31d418a9ce7eb2bae70b', '0xfF85a5Ff1e5f2D6Cc736B2F1c2fAcd54386E284A');
// getDecimals('0x0eb68e04ebeea06fd60d31d418a9ce7eb2bae70b');
// getTotalSupply('0x0eb68e04ebeea06fd60d31d418a9ce7eb2bae70b');

module.exports = {
    getBalance,
    getDecimals,
    getTotalSupply,
};
