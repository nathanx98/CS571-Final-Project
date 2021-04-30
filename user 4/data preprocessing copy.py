import pandas as pd
import re

df = pd.read_csv("/Users/nathanxuan/Downloads/boston311.csv")

# case_enquiry_id
# open_dt (for task 2)
# type
# location 
# neighborhood (for task 1)


cols = ['case_enquiry_id','open_dt','location','neighborhood','type']
useful_cols = df[cols]
n_neighborhood = useful_cols['neighborhood'].value_counts()

time = df['open_dt']
time = time.replace(regex=r'...........', value='')
time = time.replace(regex = r':..:..',value = '')
n_time = time.value_counts()

n_neighborhood.to_csv("neighbourhood_count.csv")
n_time.to_csv("time_count.csv")
useful_cols.to_csv("useful_cols.csv")

