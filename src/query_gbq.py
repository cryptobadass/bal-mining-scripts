from unittest import result
from utils.logger import LOGGER
import pandas as pd
import pymysql
from config.const.constants import *


def query_mysql(_network, _week_number, _pool_list, _excluded_lps_list=[]):
    LOGGER.debug('query_mysql')

    _excluded_lps_list = list(set(_excluded_lps_list + BASE_LP_EXCLUSION_LIST))

    with open(SQL_FILE_PATH, 'r') as file:
        sql = file.read()

    sql = sql.format(
        week_number=_week_number,
        pool_addresses="','".join(_pool_list),
        blocks_table=TABLES_CONFIGS[_network]['blocks'],
        lm_transfers_table=TABLES_CONFIGS[_network]['lm_transfers'],
        lm_state_table=TABLES_CONFIGS[_network]['lm_state'],
        excluded_lps="','".join(_excluded_lps_list)
    )
    # print('query_mysql->sql:', sql)
    conn = pymysql.connect(host='localhost', user='root', password='123456',
                           database='balancer_db', charset='utf8')
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

    cursor.execute(sql)

    result = cursor.fetchall()

    print('query_mysql->result:', result)

    df = pd.DataFrame.from_dict(result)

    print('query_mysql->df:', df)

    df = df.groupby(['pool_address', 'lp_address', 'block_timestamp']).sum()

    return df
