from src.exclusions import get_exclusions
from utils.logger import LOGGER
from src.query_gbq import query_mysql
from src.process_data import get_lm_allocations, get_lps_share_integral_for_pools


def get_result_tokens(chain_id, week_number, realtime_estimator):
    # get LM allocations for the week on the chain
    LOGGER.info('Fetching incentives allocation')
    allocations_df, week_passed = get_lm_allocations(
        chain_id, _week_number=week_number, _realtime=realtime_estimator)
    # get a list of incentivized pools
    print('run.py -> allocations_df:', allocations_df)

    incentivized_pools = allocations_df.index.drop_duplicates().values
    print('run.py -> incentivized_pools:', incentivized_pools)
    # get LM power changes data from Google Big Query
    LOGGER.info('Querying GBQ')
    raw_data_df = query_mysql(chain_id, week_number, incentivized_pools)

    print('run.py -> raw_data_df:', raw_data_df)
    # os._exit(2)
    # get pools with liquidity providers that have opted-out of LM incentives
    exclusions = get_exclusions(chain_id)  # fillte the blacklist
    print('run.py -> exclusions:', exclusions)
    # process raw data to obtain the share of LM incentives for each LP in each pool
    share_df = get_lps_share_integral_for_pools(
        raw_data_df, _exclusions=exclusions, _realtime=realtime_estimator)
    print('run.py -> share_df:', share_df)

    # compute the amounts earned by each LP on each pool
    proceeds_df = allocations_df.mul(share_df['share_integral'], axis=0)
    print('run.py -> proceeds_df:', proceeds_df)

    velocity_df = allocations_df.div(
        week_passed*7*24*3600).mul(share_df['latest_share'], axis=0)
    print('run.py -> velocity_df:', velocity_df)

    # compute the amounts earned by each LP
    amounts_df = (
        proceeds_df
        .groupby('lp_address')
        .sum()
        .melt(var_name='token_address', value_name='earned', ignore_index=False)
        .set_index('token_address', append=True)
    )
    print('run.py -> amounts_df:', amounts_df)

    # compute the velocity at which each LP is earning tokens
    velocity_df = (
        velocity_df
        .groupby('lp_address')
        .sum()
        .melt(var_name='token_address', value_name='velocity', ignore_index=False)
        .set_index('token_address', append=True)
    )

    print('run.py -> velocity_df:', velocity_df)

    results_df = amounts_df.join(velocity_df)
    print('run.py -> results_df:', results_df)

    results_tokens = results_df.index.get_level_values(
        'token_address').drop_duplicates()
    print('run.py -> results_tokens:', results_tokens)

    return [results_df, results_tokens]
