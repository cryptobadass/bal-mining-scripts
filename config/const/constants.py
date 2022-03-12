import os

# NEWWORDS Config
NETWORKS = {
    # 1: 'ethereum',
    # 137: 'polygon',
    # 42161: 'arbitrum',
    43113: 'fuji'
}

# leave out of results addresses that mined less than CLAIM_THRESHOLD
CLAIM_PRECISIONS = {
    'default': 8,
    '0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32': 2
}

# Table Config
TABLES_CONFIGS = {
    1: {
        'blocks': 'bigquery-public-data.crypto_ethereum.blocks',
        'lm_transfers': 'blockchain-etl.ethereum_balancer.view_LM_transfers',
        'lm_state': 'blockchain-etl.ethereum_balancer.view_LM_state',
    },
    137: {
        'blocks': 'public-data-finance.crypto_polygon.blocks',
        'lm_transfers': 'blockchain-etl.polygon_balancer.view_LM_transfers',
        'lm_state': 'blockchain-etl.polygon_balancer.view_LM_state',
    },
    42161: {
        'blocks': 'nansen-datasets-prod.crypto_arbitrum.blocks',
        'lm_transfers': 'blockchain-etl.arbitrum_balancer.view_LM_transfers',
        'lm_state': 'blockchain-etl.arbitrum_balancer.view_LM_state',
    },
    43113: {
        'blocks': 'bigquery-public-data.crypto_ethereum.blocks',
        'lm_transfers': 'blockchain-etl.ethereum_balancer.view_LM_transfers',
        'lm_state': 'blockchain-etl.ethereum_balancer.view_LM_state',
    },
}


# LP EXCLUSION
BASE_LP_EXCLUSION_LIST = [
    '0x0000000000000000000000000000000000000000',
    '0xba12222222228d8ba445958a75a0704d566bf2c8'
]

# SQL_FILE_PATH sql file path
SQL_FILE_PATH = 'config/sql/base_mysql.sql'

# V2_LM_ALLOCATION_URL
V2_LM_ALLOCATION_URL = 'https://raw.githubusercontent.com/cryptobadass/bal-mining-scripts/master/config/MultiTokenLiquidityMining.json'

# Set Frist Week Beign Timestamp  2022-02-28
WEEK_1_START_TIMESTAMP = 1646006400


# Google Cloud Project ID
PROJECT_ID = os.environ['GCP_PROJECT']
