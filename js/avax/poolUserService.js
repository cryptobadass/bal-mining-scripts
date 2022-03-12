const PoolUser = require('./models/poolUser.model');

async function createPoolUser(poolAddress, address, timestamp) {
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
            // console.log('create PoolUser success poolAddress:%s', poolAddress);
        }
    );
}

async function getUsersByPoolAddress(poolAddress, callback) {
    PoolUser.findUsersByPoolAddress(poolAddress, (error, users) => {
        callback(error, users);
    });
}

async function isUserInPool(poolAddress, address, callback) {
    PoolUser.findCertainUser(poolAddress, address, (error, user) => {
        callback(error, user);
    });
}

module.exports = {
    createPoolUser,
    getUsersByPoolAddress,
    isUserInPool,
};
