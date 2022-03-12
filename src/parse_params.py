from utils.logger import LOGGER, logger_init
from utils.realtime_utils import get_current_lm_week_number
import argparse


def parse_params():

    log_level = 'INFO'
    realtime_estimator = False
    this_week = get_current_lm_week_number()  # this is what week we're actually in
    week_number = this_week - 1  # by default we want to run the previous week

    # Argument Parsing
    # week: int, number of the week to run
    # rt: 1 if running real time estimator (updates the API backend)
    # logs: WARNING, DEBUG, INFO
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--week',
        help='the week number to run the script for',
        type=int)
    parser.add_argument(
        '--rt',
        help='pass 1 to run realtime estimator; ignores week parameter',
        type=int)
    parser.add_argument(
        '--logs',
        help='{WARNING, DEBUG, INFO}',
        type=str)
    args = parser.parse_args()

    # initialize the logger
    if args.logs:  # if realtime = True
        log_level = args.logs.upper()
    logger_init(log_level)

    if args.rt:  # if realtime = True
        LOGGER.info('Running realtime estimator')
        week_number = this_week
        realtime_estimator = True
        if args.week:
            LOGGER.warning(
                'Running realtime estimator, ignoring week parameter')
    elif args.week:
        week_number = args.week
        if week_number > this_week:
            exit(
                f'Error: week {week_number} is in the future, this is week {this_week}')
        if week_number == this_week:
            LOGGER.warning(
                f'Warning: week {week_number} is not over yet. Did you mean to run the realtime estimator?')
    return [week_number, realtime_estimator]
