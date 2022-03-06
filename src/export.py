import os
import json
from src.logger import LOGGER
from src.constants import *
from web3 import Web3


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
    export_data = _data[_data > get_claim_threshold(_token)]
    export = export_data.apply(lambda x: format(
        x, f'.{get_claim_precision(_token)}f'))
    export_json = export.to_json()
    parsed_export = json.loads(export_json)
    print('save_fuji_report -> parsed_export: ', parsed_export)
    with open(filename, "w") as write_file:
        json.dump(parsed_export, write_file, indent=4)
    LOGGER.debug(f'saved to {filename}')
    if _chain_id == 43113 and _token == '0xE00Bf4d40670FCC1DcB3A757ebccBe579f372fbc':
        print('save_fuji_report -> filename: ', filename)
        filename = f'{reports_dir}/fuji_totals.json'
        with open(filename, "w") as write_file:
            json.dump(parsed_export, write_file, indent=4)
        LOGGER.debug(f'saved to {filename}')
