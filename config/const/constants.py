import os

# NETWORDS Config
NETWORKS = {
    # 1: 'ethereum',
    # 137: 'polygon',
    # 42161: 'arbitrum',
    43113: 'fuji',
    43114: 'avalanche'
}

# leave out of results addresses that mined less than CLAIM_THRESHOLD
CLAIM_PRECISIONS = {
    'default': 8,
    '0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32': 2
}

# LP EXCLUSION
BASE_LP_EXCLUSION_LIST = [
    '0x0000000000000000000000000000000000000000',
    '0xba12222222228d8ba445958a75a0704d566bf2c8'
]

# SQL_FILE_PATH sql file path
SQL_FILE_PATH = 'config/sql/base_mysql.sql'

# V2_LM_ALLOCATION_URL
V2_LM_ALLOCATION_URL = 'https://raw.githubusercontent.com/cryptobadass/frontend-v2/develop/src/lib/utils/liquidityMining/MultiTokenLiquidityMining.json'

# Set Frist Week Beign Timestamp  2022-03-07
WEEK_1_START_TIMESTAMP = 1646611200


# Google Cloud Project ID
PROJECT_ID = os.environ['GCP_PROJECT']
