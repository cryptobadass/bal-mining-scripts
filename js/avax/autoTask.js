var cron = require('node-cron');
const dataService = require('./dataService');
const date = require('./utils/date');

// https://github.com/node-cron/node-cron
/**
# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
 */

// 1. pool_info, pool_user, balance_snapshot schedule

// every 3 minutes
// 0 */3 * * * *
const EVERY_3_MINUTES = '*/3 * * * * *';
// specified time
// every day 23:59:59 => 59 59 23 * * *
const BASIC_DATA_TIME = '0 40 22 * * *';
cron.schedule(BASIC_DATA_TIME, () => {
    console.log(
        'running schedule to init basic data ',
        new Date(new Date().toUTCString())
    );
    try {
        dataService.initBasicData();
    } catch (error) {
        // send alarm email
        console.log('run init data schedule error:', error);
    }
});

// 2. check data
// */3 * * * * *
// every day 08:00:00 => 0 0 8 * * *
const CHECK_DATA_TIME = '0 0 8 * * *';
cron.schedule(CHECK_DATA_TIME, () => {
    console.log(
        'running schedule to check data ',
        new Date(new Date().toUTCString())
    );
    const startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const endTime = new Date(
        new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
    ).getTime();
    const startTimeStr = date.stampToTime(startTime, 2);
    const endTimeStr = date.stampToTime(endTime, 2);

    dataService.findBalanceSnapshotByTime(
        startTimeStr,
        endTimeStr,
        (error, data) => {
            if (error) {
                // not found, send alarm email
                console.log('findBalanceSnapshotByTime not found');
                return;
            }
            console.log('findBalanceSnapshotByTime data length=%s', data);
        }
    );
});
