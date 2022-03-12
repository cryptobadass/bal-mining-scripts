const Web3 = require('web3');
const { ENDPOINT } = require('./constants');
const web3 = new Web3(new Web3.providers.WebsocketProvider(ENDPOINT.FUJI));
// abi of ERC20
const erc20Abi = require('../../../abi/ERC20.json');

async function getBalance(poolAddress, userAddress) {
    let poolToken = new web3.eth.Contract(erc20Abi, poolAddress);
    let balance = await poolToken.methods.balanceOf(userAddress).call();
    return balance;
}

async function getDecimals(poolAddress) {
    let poolToken = new web3.eth.Contract(erc20Abi, poolAddress);
    const decimals = await poolToken.methods.decimals().call();
    return decimals;
}

async function getTotalSupply(poolAddress) {
    let poolToken = new web3.eth.Contract(erc20Abi, poolAddress);
    let totalSupply = await poolToken.methods.totalSupply().call();
    return totalSupply;
}

module.exports = {
    getBalance,
    getDecimals,
    getTotalSupply,
};
