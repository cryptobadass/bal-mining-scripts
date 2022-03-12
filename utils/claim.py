from config.const.constants import CLAIM_PRECISIONS


# get claim precision
def get_claim_precision(_token_address=None):
    if _token_address in CLAIM_PRECISIONS.keys():
        return CLAIM_PRECISIONS[_token_address.lower()]
    return CLAIM_PRECISIONS['default']


# get claim threshold
def get_claim_threshold(_token_address=None):
    return 10**(-get_claim_precision(_token_address.lower()))
