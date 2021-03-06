const PoolInfo = require('./models/poolInfo.model');
const { CHAIN_ID } = require('./utils/constants');

async function createPoolInfo(
    poolId,
    poolAddress,
    poolType,
    factory,
    timestamp
) {
    let chainId =
        process.env.NETWORK === 'fuji' ? CHAIN_ID.FUJI : CHAIN_ID.AVALANCHE;
    PoolInfo.create(
        new PoolInfo({
            chain_id: chainId,
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
        }
    );
}

async function getAllPoolAddresses(callback) {
    PoolInfo.getAllPoolAddresses((error, data) => {
        callback(error, data);
    });
}

async function isPoolExist(poolId, callback) {
    PoolInfo.findByPoolId(poolId, (error, data) => {
        callback(error, data);
    });
}

module.exports = {
    createPoolInfo,
    getAllPoolAddresses,
    isPoolExist,
};
