var cron = require('node-cron');
const dataService = require('./dataService');

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
const EVERY_3_MINUTES = '*/20 * * * * *';
// specified time
// every day 23:59:59 => 59 59 23 * * *
const SPECIFIED_TIME = '20 47 0 * * *';
cron.schedule(
    SPECIFIED_TIME,
    () => {
        console.log('running schedule to init basic data ', new Date());
        try {
            dataService.initBasicData(true);
        } catch (error) {
            // send alarm email
            console.log('run init data schedule error:', error);
        }
    },
    {
        scheduled: true,
        timezone: 'Asia/Shanghai',
    }
);

// 2. check data?
cron.schedule(
    '0 0 8 * * *',
    () => {
        console.log('running schedule to check data ', new Date());
    },
    {
        scheduled: true,
        timezone: 'Asia/Shanghai',
    }
);
