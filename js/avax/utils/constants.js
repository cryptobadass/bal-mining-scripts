const POOL_TYPE = {
    WeightedPool: 'Weighted',
};

// FUJI: 'https://api.thegraph.com/subgraphs/name/leedewyze/balancer-fuji-v2',
// FUJI: 'http://167.114.211.113:8000/subgraphs/name/balancer-labs/balancer-fuji-v2',
const SUBGRAPH_URL = {
    FUJI:
        'http://167.114.211.113:8000/subgraphs/name/balancer-labs/balancer-fuji-v2',
    AVALANCHE:
        'http://167.114.211.113:8000/subgraphs/name/balancer-labs/balancer-avalanche-v2',
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const ENDPOINT = {
    // FUJI: 'wss://api.avax-test.network/ext/bc/C/ws',
    // AVALANCHE: 'wss://speedy-nodes-nyc.moralis.io/f7eaee720c05a3b9bb0ddefd/avalanche/mainnet/ws'
    FUJI: 'https://api.avax-test.network/ext/bc/C/rpc',
    AVALANCHE: 'https://api.avax.network/ext/bc/C/rpc',
};

const CHAIN_ID = {
    FUJI: 43113,
    AVALANCHE: 43114,
};

module.exports = {
    POOL_TYPE,
    SUBGRAPH_URL,
    ENDPOINT,
    ZERO_ADDRESS,
    CHAIN_ID,
};
