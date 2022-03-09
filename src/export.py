from lib2to3.pgen2 import token
import os
import json
from src.logger import LOGGER
from src.constants import *
from web3 import Web3
from urllib.request import urlopen

import pymysql


def save_report(_week_number, _chain_id, _token, _data):
    LOGGER.debug(f'saving {_token} report...')
    network = NETWORKS[_chain_id]
    reports_dir = f'reports/{_week_number}'
    if not os.path.exists(reports_dir):
        os.mkdir(reports_dir)
    filename = f'{reports_dir}/__{network}_{_token}.json'
    export_data = _data[_data > get_claim_threshold(_token)]
    export = export_data.apply(lambda x: format(
        x, f'.{get_claim_precision(_token)}f'))
    export_json = export.to_json()
    parsed_export = json.loads(export_json)
    with open(filename, "w") as write_file:
        json.dump(parsed_export, write_file, indent=4)
    LOGGER.debug(f'saved to {filename}')
    if _chain_id == 1 and _token == '0xba100000625a3754423978a60c9317c58a424e3d':
        filename = f'{reports_dir}/_totals.json'
        with open(filename, "w") as write_file:
            json.dump(parsed_export, write_file, indent=4)
        LOGGER.debug(f'saved to {filename}')


def save_fuji_report(_week_number, _chain_id, _token, _data):
    LOGGER.debug(f'saving {_token} report...')
    network = NETWORKS[_chain_id]
    reports_dir = f'reports/{_week_number}'
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
    filename = f'{reports_dir}/__{network}_{_token}.json'

    print('[save_fuji_report] _week_number:', _week_number,
          '_chain_id:', _chain_id, '_token:', _token, '_data:', _data)

    export_data = _data[_data > get_claim_threshold(_token)]
    export = export_data.apply(lambda x: format(
        x, f'.{get_claim_precision(_token)}f'))
    export_json = export.to_json()
    parsed_export = json.loads(export_json)
    print('save_fuji_report -> parsed_export: ', parsed_export)
    # insert user reward data
    items = parsed_export.items()
    for address, amount in items:
        print(str(address) + '=' + str(amount))
        poolAddress = getPoolAddressByTokenAddress(
            _token, _chain_id, _week_number)
        insertUserRewardData(_chain_id, poolAddress, _token,
                             address, str(amount), '0', _week_number)
    with open(filename, "w") as write_file:
        json.dump(parsed_export, write_file, indent=4)
    LOGGER.debug(f'saved to {filename}')
    if _chain_id == 43113 and _token == '0xE00Bf4d40670FCC1DcB3A757ebccBe579f372fbc':
        print('save_fuji_report -> filename: ', filename)
        filename = f'{reports_dir}/fuji_totals.json'
        with open(filename, "w") as write_file:
            json.dump(parsed_export, write_file, indent=4)
        LOGGER.debug(f'saved to {filename}')


def insertUserRewardData(chain_id, pool_address, token_address, user_address, current_estimate, velocity, week):
    print('[insertUserRewardData] chain_id:', chain_id, 'pool_address:', pool_address, 'token_address:',
          token_address, 'user_address:', user_address, 'current_estimate:', current_estimate, 'week:', week)
    # insert reward user data
    conn = pymysql.connect(host='localhost', user='root', password='123456',
                           database='balancer_db', charset='utf8')
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    sql = "INSERT INTO every_week_need_reward_user_snapshot(chain_id,pool_address,token_address,user_address,current_estimate,velocity,week) VALUES(%s,%s,%s,%s,%s,%s,%s)"
    cursor.execute(sql, (chain_id, pool_address, token_address,
                         user_address, current_estimate, velocity, week))
    conn.commit()
    cursor.close()
    conn.close()


V2_LM_ALLOCATION_URL = 'http://localhost:8080/config/MultiTokenLiquidityMining.json'


def getPoolAddressByTokenAddress(tokenAddress, _chain_id,  _week_number):
    jsonurl = urlopen(V2_LM_ALLOCATION_URL)
    try:
        week_allocation = json.loads(jsonurl.read())[f'week_{_week_number}']
    except KeyError:
        week_allocation = {}

    for chain_allocation in week_allocation:
        if chain_allocation['chainId'] == _chain_id:
            for pool, rewards in chain_allocation['pools'].items():
                for r in rewards:
                    if r['tokenAddress'] == tokenAddress:
                        return pool[:42].lower()
