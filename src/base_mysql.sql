SELECT p.`timestamp` as block_timestamp , u.user_address as lp_address, p.pool_address as pool_address,  CAST(u.user_balance AS FLOAT8) as delta 
FROM pool_info p
LEFT JOIN balance_snapshot u ON p.pool_address = u.pool_address
WHERE p.pool_address IN ('{pool_addresses}')
AND u.user_address NOT IN ('{excluded_lps}')
