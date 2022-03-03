const PoolInfo = require('./models/poolInfo.model');
const PoolUser = require('./models/poolUser.model');
const moment = require('moment');
const fujiSubgraph = require('./subgraph/fujiSubgraph');
const date = require('./utils/date');

async function insertPoolInfo(
    poolId,
    poolAddress,
    poolType,
    factory,
    timestamp
) {
    // const timestamp = moment().format('YYYY-MM-DD H:mm:ss')
    PoolInfo.create(
        new PoolInfo({
            chain_id: 4,
            pool_id: poolId,
            pool_address: poolAddress,
            pool_type: poolType,
            factory: factory,
            timestamp: timestamp,
        }),
        (error, data) => {
            if (error) {
                console.log('create PoolInfo fail poolId:%s', poolId);
                return;
            }
            console.log('create PoolInfo success poolId:%s', poolId);
            // console.log('create PoolInfo success data:%s', JSON.stringify(data));
        }
    );
}

async function insertPoolUser(poolAddress, address, timestamp) {
    PoolUser.create(
        new PoolUser({
            pool_address: poolAddress,
            address: address,
            timestamp: timestamp,
        }),
        (error, data) => {
            if (error) {
                console.log('create PoolUser fail poolAddress:%s', poolAddress);
                return;
            }
            console.log('create PoolUser success poolAddress:%s', poolAddress);
            // console.log('create PoolUser success data:%s', JSON.stringify(data));
        }
    );
}

async function fillPoolInfoAndPoolUser() {
    let allPools = await fujiSubgraph.fetchAllPools();
    for (let pool of allPools) {
        const poolId = pool.id;
        const poolAddress = pool.address;
        const poolType = 'Weighted';
        const factory = pool.factory;
        const timestamp = date.stampToTime(pool.createTime);
        await insertPoolInfo(poolId, poolAddress, poolType, factory, timestamp);
        // console.log('poolId=%s, poolAddress=%s, poolType=%s, shareHolders=%s', pool.id, pool.address, pool.poolType, pool.shareHolders);
        let shareHolders = pool.shareHolders;
        if (shareHolders.length > 0) {
            for (let address of shareHolders) {
                if (address === '0x0000000000000000000000000000000000000000') {
                    continue;
                }
                await insertPoolUser(
                    poolAddress,
                    address,
                    moment().format('YYYY-MM-DD HH:mm:ss')
                );
            }
        }
    }
}

fillPoolInfoAndPoolUser();
