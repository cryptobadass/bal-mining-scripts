const fetch = require('isomorphic-fetch');
const { ENDPOINT, SUBGRAPH_URL } = require('../utils/constants');
const Web3 = require('web3');
const network = process.env.NETWORK;
let web3;

async function fetchAllPools() {
    let poolResults = [];
    let skip = 0;
    let paginatePools = true;
    let subgraphUrl;
    console.log('fetchAllPools network=%s', network);
    if (network === 'fuji') {
        web3 = new Web3(new Web3.providers.HttpProvider(ENDPOINT.FUJI));
        subgraphUrl = SUBGRAPH_URL.FUJI;
        console.log(
            'fetchAllPools fuji=%s, subgraphUrl=%s',
            ENDPOINT.FUJI,
            subgraphUrl
        );
    } else if (network === 'avalanche') {
        subgraphUrl = SUBGRAPH_URL.AVALANCHE;
        web3 = new Web3(new Web3.providers.HttpProvider(ENDPOINT.AVALANCHE));
        console.log(
            'fetchAllPools avalanche=%s, subgraphUrl=%s',
            ENDPOINT.AVALANCHE,
            subgraphUrl
        );
    }
    // to fetch all pools
    while (paginatePools) {
        let query = `
      {
          pools(first: 1000, skip: ${skip}) {
            id
            address
            poolType
            factory
            createTime
            shares (first: 1000) {
              balance
              userAddress {
                id
              }
            }
          }
        }
      `;

        let response = await fetch(subgraphUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
            }),
        });

        let { data } = await response.json();

        poolResults = poolResults.concat(data.pools);

        if (data.pools.length < 1000) {
            paginatePools = false;
        } else {
            skip += 1000;
            continue;
        }
    }
    // got all pool
    // console.log('got all pool, poolCount=%s', poolResults.length);

    let finalResults = [];

    for (let pool of poolResults) {
        pool.shareHolders = pool.shares.map((a) =>
            web3.utils.toChecksumAddress(a.userAddress.id)
        );
        if (pool.shareHolders.length == 1000) {
            let paginateShares = true;
            let shareSkip = 0;
            let shareResults = [];

            while (paginateShares) {
                let query = `
                    {
                        pools (where: { id: "${pool.id}"}) {
                            shares (first: 1000, skip: ${shareSkip}) {
                                userAddress {
                                    id
                                }
                            }
                        }
                    }
                `;

                let response = await fetch(subgraphUrl, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                    }),
                });

                let { data } = await response.json();

                let newShareHolders = data.pools[0].shares.map((a) =>
                    web3.utils.toChecksumAddress(a.userAddress.id)
                );

                shareResults = shareResults.concat(newShareHolders);

                if (newShareHolders.length < 1000) {
                    paginateShares = false;
                } else {
                    shareSkip += 1000;
                    continue;
                }
            }

            pool.shareHolders = shareResults;
            delete pool.shares;

            finalResults.push(pool);
        } else {
            delete pool.shares;
            finalResults.push(pool);
        }
    }

    return finalResults;
}

module.exports = {
    fetchAllPools,
};
