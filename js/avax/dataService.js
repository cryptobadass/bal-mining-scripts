const {
    createPoolInfo,
    getAllPoolAddresses,
    isPoolExist,
} = require('./poolInfoService');
const {
    createPoolUser,
    getUsersByPoolAddress,
    isUserInPool,
} = require('./poolUserService');
const {
    createBalanceSnapshot,
    findIdsByTime,
} = require('./balanceSnapshotService');
const moment = require('moment');
const fujiSubgraph = require('./subgraph/fujiSubgraph');
const date = require('./utils/date');
const { ZERO_ADDRESS } = require('./utils/constants');
const erc20Utils = require('./utils/erc20Utils');
const emailUtils = require('./email/emailUtils');
const { EMAIL_MSG } = require('./email/email.msg');

/**
 * init data of pool_info, pool_user and balancer_snapshot
 */
async function initBasicData() {
    try {
        // 1. get all pools
        let allPools = await fujiSubgraph.fetchAllPools();
        for (let pool of allPools) {
            const poolId = pool.id;
            const poolAddress = pool.address;
            const poolType = pool.poolType;
            const factory = pool.factory;
            const timestamp = date.stampToTime(pool.createTime, 2);

            poolId = '999';
            // 2. create pool info
            await isPoolExist(poolId, (error, data) => {
                // console.log('isPoolExist error=%s, data=%s', error, JSON.stringify(data));
                if (error) {
                    // pool not exist
                    console.log(`poolId=${poolId} not exist`);
                    createPoolInfo(
                        poolId,
                        poolAddress,
                        poolType,
                        factory,
                        timestamp
                    );
                }
            });

            // 3. create pool user
            let shareHolders = pool.shareHolders;
            if (shareHolders.length > 0) {
                for (let address of shareHolders) {
                    if (address === ZERO_ADDRESS) {
                        continue;
                    }
                    await isUserInPool(poolAddress, address, (error, data) => {
                        if (error) {
                            // user not exist
                            console.log(
                                `user=${address} not exist in poolId=${poolAddress}`
                            );
                            createPoolUser(
                                poolAddress,
                                address,
                                moment().format('YYYY-MM-DD HH:mm:ss')
                            );
                        }
                    });

                    // 4. fetch balance snapshot of user in each pool
                    let user = [
                        {
                            address: address,
                        },
                    ];
                    await getUserBalanceAndTotalSupply(poolAddress, user);
                }
            }
        }
    } catch (error) {
        emailUtils.sendEmail(
            EMAIL_MSG.INIT_BASIC_DATA_ERROR.SUBJECT,
            EMAIL_MSG.INIT_BASIC_DATA_ERROR.CONTENT +
                '<p>error: ' +
                error.message +
                '</p>'
        );
        console.log('run initBasicData error:', error);
    }
}

/**
 * Get balance snapshot everyday of every pool.
 */
async function runBalanceSnapshot() {
    let allPoolAddresses = [];
    await getAllPoolAddresses((error, data) => {
        if (error) {
            console.log(
                'runBalanceSnapshot, get all pool addresses fail',
                error
            );
            return;
        }
        allPoolAddresses = data;
        getUsersEachPool(allPoolAddresses);
    });
}

async function getUsersEachPool(allPoolAddresses) {
    for (let pool of allPoolAddresses) {
        // console.log('getUsersEachPool poolAddress=%s', poolAddress);
        await getUsersByPoolAddress(pool.pool_address, (error, users) => {
            if (error) {
                console.log(
                    'get users of %s fail, error: %s',
                    pool.pool_address,
                    error
                );
                return;
            }
            getUserBalanceAndTotalSupply(pool.pool_address, users);
        });
    }
}

async function getUserBalanceAndTotalSupply(poolAddress, users) {
    for (let user of users) {
        let userAddress = user.address;
        let userBalance = await erc20Utils.getBalance(poolAddress, userAddress);
        let decimals = await erc20Utils.getDecimals(poolAddress);
        let totalSupply = await erc20Utils.getTotalSupply(poolAddress);

        // console.log(`poolAddress=${poolAddress}, userAddress=${userAddress}, userBalance=${userBalance}, decimals=${decimals}, totalSupply=${totalSupply}`);
        // create balance snapshot
        await createBalanceSnapshot(
            poolAddress,
            userAddress,
            userBalance,
            totalSupply,
            decimals
        );
    }
}

async function findBalanceSnapshotByTime(startTime, endTime, callback) {
    await findIdsByTime(startTime, endTime, (error, data) => {
        callback(error, data);
    });
}

module.exports = {
    initBasicData,
    runBalanceSnapshot,
    findBalanceSnapshotByTime,
};
