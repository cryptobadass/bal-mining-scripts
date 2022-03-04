const PoolInfo = require('./models/poolInfo.model');

async function createPoolInfo(
    poolId,
    poolAddress,
    poolType,
    factory,
    timestamp
) {
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
        }
    );
}

async function getAllPoolAddresses(callback) {
    PoolInfo.getAllPoolAddresses((error, data) => {
        callback(error, data);
    });
}

module.exports = {
    createPoolInfo,
    getAllPoolAddresses,
};
