from utils.realtime_utils import get_current_lm_week_end_timestamp
from utils.logger import LOGGER
from utils.claim import *
from src.redirections import apply_redirects
from src.parse_params import parse_params
from src.result_tokens import get_result_tokens
from dotenv import load_dotenv

from src.export import CreateReports
from config.const.constants import *
import pandas as pd
from web3 import Web3

import os

# load envirnment variable
load_dotenv(verbose=True)


# get init params
week_number, realtime_estimator = parse_params()

# for each network
LOGGER.info(f'Week: {week_number}')
full_export = pd.DataFrame()
for chain_id in NETWORKS.keys():
    LOGGER.info(f'Computing distributions for {NETWORKS[chain_id]}')
    results_df, results_tokens = get_result_tokens(
        chain_id, week_number, realtime_estimator)

    # apply redirects and save reports
    for token in results_tokens:
        LOGGER.debug(f'Redirecting {token}...')

        print('run.py -> results_tokens -> token:', token)

        export_data = results_df.loc[(slice(None), [token]), [
            'earned']].droplevel('token_address')

        redirects = apply_redirects(export_data)
        export_data = redirects[0]
        redirected_n = redirects[1]

        print('run.py -> results_tokens -> token:',
              token, 'export_data:', export_data, 'redirects:', redirects)

        reportsObj = CreateReports(
            week_number,
            chain_id,
            token,
            export_data['earned'])

        LOGGER.info(f'{token} - {redirected_n} redirectors')

        filename = reportsObj.save_fuji_report()

    if realtime_estimator:
        results_df = results_df.reset_index()
        results_df['lp_address'] = results_df['lp_address'].apply(
            Web3.toChecksumAddress)
        results_df = results_df.rename(columns={'lp_address': 'address'})
        results_df['timestamp'] = get_current_lm_week_end_timestamp()
        results_df['week'] = week_number
        results_df['earned'] = results_df['earned'].apply(
            lambda x: format(x, f'.{get_claim_precision(token)}f'))
        results_df['velocity'] = results_df['velocity'].apply(
            lambda x: format(x, f'.{get_claim_precision(token)}f'))
        results_df['chain_id'] = chain_id
        full_export = full_export.append(results_df)

if not realtime_estimator:
    reports_dir = f'reports/{week_number}'
    print('\nReports totals:')
    checks = {}
    report_files = os.listdir(reports_dir)
    report_files.sort()
    for filename in report_files:
        _sum = pd.read_json(reports_dir+'/'+filename,
                            orient='index').sum().values[0]
        print(f'{filename}: {_sum}')
