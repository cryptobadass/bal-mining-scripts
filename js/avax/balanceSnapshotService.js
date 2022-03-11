const BalanceSnapshot = require('./models/balance_snapshot.model');
const moment = require('moment');

async function createBalanceSnapshot(
    poolAddress,
    userAddress,
    userBalance,
    totalSupply
) {
    BalanceSnapshot.create(
        new BalanceSnapshot({
            pool_address: poolAddress,
            user_address: userAddress,
            user_balance: userBalance,
            total_supply: totalSupply,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        }),
        (error, data) => {
            if (error) {
                console.log(
                    'create BalanceSnapshot fail user_address:%s',
                    userAddress
                );
                return;
            }
            console.log(
                'create BalanceSnapshot success, pool_address=%s, user_address:%s',
                poolAddress,
                userAddress
            );
            // console.log('create BalanceSnapshot success data:%s', JSON.stringify(data));
        }
    );
}

async function findIdsByTime(startTime, endTime, callback) {
    BalanceSnapshot.findIdsByTime(startTime, endTime, (error, data) => {
        callback(error, data);
    });
}

module.exports = {
    createBalanceSnapshot,
    findIdsByTime,
};
