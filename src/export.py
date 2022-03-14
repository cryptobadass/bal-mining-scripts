from lib2to3.pgen2 import token
import os
import json
from utils.logger import LOGGER
from utils.mysql import get_mysql_connect
from config.const.constants import *
from web3 import Web3
from urllib.request import urlopen
from utils.claim import *
import pymysql


class CreateReports:  # create reports

    __week_number = 0
    __chain_id = 0
    __token = ''
    __data = []

    # init data
    def __init__(self, _week_number, _chain_id, _token, _data):
        print(self.__class__)
        self.__week_number = _week_number
        self.__chain_id = _chain_id
        self.__token = _token
        self.__data = _data
        print('[CreateReports] _week_number:', self.__week_number,
              '_chain_id:', self.__chain_id, '_token:', self.__token, '_data:', self.__data)

    def save_fuji_report(self):
        LOGGER.debug(f'saving {self.__token} report...')
        network = NETWORKS[self.__chain_id]
        reports_dir = f'reports/{self.__week_number}'

        if not os.path.exists(reports_dir):
            os.makedirs(reports_dir)

        filename = f'{reports_dir}/__{network}_{self.__token}.json'
        export_data = self.__data[self.__data >
                                  get_claim_threshold(self.__token)]
        export = export_data.apply(lambda x: format(
            x, f'.{get_claim_precision(self.__token)}f'))
        export_json = export.to_json()

        parsed_export = json.loads(export_json)
        print('save_fuji_report -> parsed_export: ', parsed_export)

        # insert user reward data
        items = parsed_export.items()
        for address, amount in items:
            print('save_fuji_report-> ', str(address) + '=' + str(amount))
            poolAddress = self.getPoolAddressByTokenAddress()
            self.insertUserRewardData(poolAddress, address, str(amount), '0')

        # Write reward data into JSON file
        with open(filename, "w") as write_file:
            json.dump(parsed_export, write_file, indent=4)
        LOGGER.debug(f'saved to {filename}')

        # If it is the main chain, write fuji_totals JSON file
        if self.__chain_id == 43113 and self.__token == '0xE00Bf4d40670FCC1DcB3A757ebccBe579f372fbc':
            filename = f'{reports_dir}/fuji_totals.json'
            with open(filename, "w") as write_file:
                json.dump(parsed_export, write_file, indent=4)
            # print success log
            LOGGER.debug(f'saved to {filename} success!')

    # insert reward user data
    def insertUserRewardData(self, pool_address, user_address, current_estimate, velocity):

        print('[insertUserRewardData]',
              'pool_address:', pool_address,
              'user_address:', user_address,
              'current_estimate:', current_estimate,
              'velocity:', velocity)

        conn = get_mysql_connect()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

        querySQL = "SELECT * FROM every_week_need_reward_user_snapshot WHERE chain_id=%d AND pool_address='%s' AND token_address='%s' AND user_address='%s' AND week=%d" % (
            self.__chain_id, pool_address, self.__token, user_address, self.__week_number)

        cursor.execute(querySQL)
        result = cursor.fetchall()

        if len(result) == 0:
            sql = "INSERT INTO every_week_need_reward_user_snapshot(chain_id,pool_address,token_address,user_address,current_estimate,velocity,week) VALUES(%s,%s,%s,%s,%s,%s,%s)"
            cursor.execute(sql, (
                self.__chain_id,
                pool_address,
                self.__token,
                user_address,
                current_estimate,
                velocity,
                self.__week_number)
            )
            conn.commit()

        cursor.close()
        conn.close()

    def getPoolAddressByTokenAddress(self):

        jsonurl = urlopen(V2_LM_ALLOCATION_URL)

        try:
            week_allocation = json.loads(jsonurl.read())[
                f'week_{self.__week_number}']
        except KeyError:
            week_allocation = {}
        for chain_allocation in week_allocation:
            if chain_allocation['chainId'] == self.__chain_id:
                for pool, rewards in chain_allocation['pools'].items():
                    for r in rewards:
                        if r['tokenAddress'] == self.__token:
                            return pool[:42].lower()
