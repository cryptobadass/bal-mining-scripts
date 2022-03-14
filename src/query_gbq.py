from utils.logger import LOGGER
import pandas as pd
import pymysql
from utils.mysql import get_mysql_connect
from config.const.constants import *
import os

from utils.realtime_utils import *


def query_mysql(_network, _week_number, _pool_list, _excluded_lps_list=[]):
    LOGGER.debug('query_mysql')

    _excluded_lps_list = list(set(_excluded_lps_list + BASE_LP_EXCLUSION_LIST))

    with open(SQL_FILE_PATH, 'r') as file:
        sql = file.read()

    _begin_time = get_current_lm_week_start_timestamp()
    _end_time = get_current_lm_week_end_timestamp()
    if _week_number != get_current_lm_week_number():
        _begin_time = get_appiont_lm_week_start_timestamp(_week_number)
        _end_time = get_appiont_lm_week_end_timestamp(_week_number)

    sql = sql.format(
        week_number=_week_number,
        pool_addresses="','".join(_pool_list),
        excluded_lps="','".join(_excluded_lps_list),
        begin_time=_begin_time,
        end_time=_end_time
    )
    print('query_mysql->sql:', sql)

    conn = get_mysql_connect()

    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

    cursor.execute(sql)

    result = cursor.fetchall()

    # print('query_mysql->result:', result)

    df = pd.DataFrame.from_dict(result)

    print('query_mysql->df:', df)

    df = df.groupby(['pool_address', 'lp_address', 'block_timestamp']).sum()

    return df
