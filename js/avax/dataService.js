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
const { createBalanceSnapshot } = require('./balanceSnapshotService');
const moment = require('moment');
const fujiSubgraph = require('./subgraph/fujiSubgraph');
const date = require('./utils/date');
const { ZERO_ADDRESS } = require('./utils/constants');
const erc20Utils = require('./utils/erc20Utils');
const BigNumber = require('bignumber.js');

/**
 * init data of pool_info, pool_user and balancer_snapshot
 */
async function initBasicData(withBalanceSnapshot) {
    // 1. get all pools
    let allPools = await fujiSubgraph.fetchAllPools();
    for (let pool of allPools) {
        const poolId = pool.id;
        const poolAddress = pool.address;
        const poolType = pool.poolType;
        const factory = pool.factory;
        const timestamp = date.stampToTime(pool.createTime);
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
                if (withBalanceSnapshot) {
                    let users = [
                        {
                            address: address,
                        },
                    ];
                    await getUserBalanceAndTotalSupply(poolAddress, users);
                }
            }
        }
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
            console.log(
                'get users of %s success, users: %s',
                pool.pool_address,
                JSON.stringify(users)
            );

            getUserBalanceAndTotalSupply(pool.pool_address, users);
        });
    }
}

// async function getBalanceAndTotalSupplyOfUser(poolAddress, userAddress) {
//     let userBalance = await erc20Utils.getBalance(poolAddress, userAddress);
//     let decimals = await erc20Utils.getDecimals(poolAddress);
//     let totalSupply = await erc20Utils.getTotalSupply(poolAddress);

//     // todo BigNumber examples
//     let userBalanceEther = new BigNumber(String(userBalance));
//     userBalanceEther = userBalanceEther.shiftedBy(-Number(decimals));
//     // console.log(
//     //     '********** userBalance=%s, userBalanceEther=%s',
//     //     userBalance,
//     //     userBalanceEther
//     // );
//     let totalSupplyEther = new BigNumber(String(totalSupply));
//     totalSupplyEther = totalSupplyEther.shiftedBy(-Number(decimals));
//     // console.log(
//     //     '********** totalSupply=%s, totalSupplyEther=%s',
//     //     totalSupply,
//     //     totalSupplyEther
//     // );
//     let rate = userBalanceEther / totalSupplyEther;
//     // console.log(
//     //     '********** poolAddress=%s, userBalanceEther=%s, totalSupplyEther=%s, rate=%s',
//     //     poolAddress,
//     //     userBalanceEther,
//     //     totalSupplyEther,
//     //     rate
//     // );

//     // console.log(`poolAddress=${poolAddress}, userAddress=${userAddress}, userBalance=${userBalance}, decimals=${decimals}, totalSupply=${totalSupply}`);
//     // create balance snapshot
//     await createBalanceSnapshot(
//         poolAddress,
//         userAddress,
//         userBalance,
//         totalSupply,
//         decimals
//     );
// }

async function getUserBalanceAndTotalSupply(poolAddress, users) {
    for (let user of users) {
        let userAddress = user.address;
        let userBalance = await erc20Utils.getBalance(poolAddress, userAddress);
        let decimals = await erc20Utils.getDecimals(poolAddress);
        let totalSupply = await erc20Utils.getTotalSupply(poolAddress);

        // todo BigNumber examples
        let userBalanceEther = new BigNumber(String(userBalance));
        userBalanceEther = userBalanceEther.shiftedBy(-Number(decimals));
        console.log(
            '********** userBalance=%s, userBalanceEther=%s',
            userBalance,
            userBalanceEther
        );
        let totalSupplyEther = new BigNumber(String(totalSupply));
        totalSupplyEther = totalSupplyEther.shiftedBy(-Number(decimals));
        console.log(
            '********** totalSupply=%s, totalSupplyEther=%s',
            totalSupply,
            totalSupplyEther
        );
        let rate = userBalanceEther / totalSupplyEther;
        console.log(
            '********** poolAddress=%s, userBalanceEther=%s, totalSupplyEther=%s, rate=%s',
            poolAddress,
            userBalanceEther,
            totalSupplyEther,
            rate
        );

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

// initBasicData();
// balanceSnapshotSchedule();

module.exports = {
    initBasicData,
    runBalanceSnapshot,
};
