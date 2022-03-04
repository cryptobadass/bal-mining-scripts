const BalanceSnapshot = require('./models/balance_snapshot.model');

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

module.exports = {
    createBalanceSnapshot,
};
