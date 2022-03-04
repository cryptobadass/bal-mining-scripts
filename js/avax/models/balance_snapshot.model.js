const sql = require('./db.js');

// constructor
const BalanceSnapshot = function (balanceSnapshot) {
    this.pool_address = balanceSnapshot.pool_address;
    this.user_address = balanceSnapshot.user_address;
    this.user_balance = balanceSnapshot.user_balance;
    this.total_supply = balanceSnapshot.total_supply;
};

BalanceSnapshot.create = (newBalanceSnapshot, callback) => {
    sql.query(
        'INSERT INTO balance_snapshot SET ?',
        newBalanceSnapshot,
        (err, res) => {
            if (err) {
                console.log('db error: ', err.message);
                // create fail
                callback(err, { ...newBalanceSnapshot });
                return;
            }

            // console.log('created balancer_snapshot: ', {
            //     id: res.insertId,
            //     ...newBalanceSnapshot,
            // });
            // create success
            callback(null, { id: res.insertId, ...newBalanceSnapshot });
        }
    );
};

module.exports = BalanceSnapshot;
