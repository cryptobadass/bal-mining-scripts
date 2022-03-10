const sql = require('./db.js');

// constructor
const PoolInfo = function (poolInfo) {
    this.chain_id = poolInfo.chain_id;
    this.pool_id = poolInfo.pool_id;
    this.pool_address = poolInfo.pool_address;
    this.pool_type = poolInfo.pool_type;
    this.factory = poolInfo.factory;
    this.timestamp = poolInfo.timestamp;
};

PoolInfo.create = (newPoolInfo, callback) => {
    sql.query('INSERT INTO pool_info SET ?', newPoolInfo, (err, res) => {
        if (err) {
            console.log('db error: ', err.message);
            // create fail
            callback(err, { ...newPoolInfo });
            return;
        }

        // console.log('created pool_info: ', {
        //     id: res.insertId,
        //     ...newPoolInfo,
        // });
        // create success
        callback(null, { id: res.insertId, ...newPoolInfo });
    });
};

PoolInfo.findByPoolId = (pool_id, callback) => {
    sql.query(
        `SELECT * FROM pool_info WHERE pool_id = '${pool_id}'`,
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                callback(err, null);
                return;
            }

            if (res.length) {
                // console.log('found PoolInfo: ', res[0]);
                callback(null, res[0]);
                return;
            }

            // not found PoolInfo with the id
            console.log('not found, res.lenght=%s', res.length);
            callback({ kind: 'not_found' }, null);
        }
    );
};

PoolInfo.getAllPoolAddresses = (callback) => {
    sql.query(`SELECT DISTINCT pool_address FROM pool_info`, (err, res) => {
        if (err) {
            console.log('error: ', err);
            callback(err, null);
            return;
        }

        if (res.length) {
            // console.log('found PoolAddresses: ', res);
            callback(null, res);
            return;
        }

        // not found PoolAddresses
        console.log('not found, res.lenght=%s', res.length);
        callback({ kind: 'not_found' }, null);
    });
};

module.exports = PoolInfo;
