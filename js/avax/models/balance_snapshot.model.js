const sql = require('./db.js');

// constructor
const BalanceSnapshot = function (balanceSnapshot) {
    this.pool_address = balanceSnapshot.pool_address;
    this.user_address = balanceSnapshot.user_address;
    this.user_balance = balanceSnapshot.user_balance;
    this.total_supply = balanceSnapshot.total_supply;
    this.timestamp = balanceSnapshot.timestamp;
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

BalanceSnapshot.findIdsByTime = (startTime, endTime, callback) => {
    sql.query(
        `SELECT id FROM balance_snapshot WHERE timestamp >= '${startTime}' and timestamp <= '${endTime}'`,
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                callback(err, null);
                return;
            }

            if (res.length) {
                // console.log('found BalanceSnapshot findByTime: ', res);
                callback(null, res.length);
                return;
            }

            // not found BalanceSnapshot with the id
            // console.log('not found, findIdsByTime res.lenght=%s', res.length);
            callback({ kind: 'not_found' }, null);
        }
    );
};

module.exports = BalanceSnapshot;
