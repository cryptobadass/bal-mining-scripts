import os
import pandas as pd

reports_dir = f'reports-fuji/91'

if not os.path.exists(reports_dir):
    os.makedirs(reports_dir)

print('\nReports totals:')
checks = {}
report_files = os.listdir(reports_dir)
report_files.sort()
for filename in report_files:
    _sum = pd.read_json(reports_dir+'/'+filename,
                        orient='index').sum().values[0]
    print(f'{filename}: {_sum}')
