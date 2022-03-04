const sql = require('./db.js');

// constructor
const PoolUser = function (poolUser) {
    this.pool_address = poolUser.pool_address;
    this.address = poolUser.address;
    this.timestamp = poolUser.timestamp;
};

PoolUser.create = (newPoolUser, callback) => {
    sql.query('INSERT INTO pool_user SET ?', newPoolUser, (err, res) => {
        if (err) {
            console.log('db error: ', err.message);
            // create fail
            callback(err, { ...newPoolUser });
            return;
        }

        // console.log('created pool_user: ', {
        //     id: res.insertId,
        //     ...newPoolUser,
        // });
        // create success
        callback(null, { id: res.insertId, ...newPoolUser });
    });
};

PoolUser.findByPoolAddress = (pool_address, callback) => {
    sql.query(
        `SELECT * FROM pool_user WHERE pool_address = '${pool_address}'`,
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                callback(err, null);
                return;
            }

            if (res.length) {
                // console.log('found PoolUser: ', res);
                callback(null, res);
                return;
            }

            // not found PoolUser with the id
            console.log('not found, res.lenght=%s', res.length);
            callback({ kind: 'not_found' }, null);
        }
    );
};

module.exports = PoolUser;
