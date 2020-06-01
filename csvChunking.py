import pandas as pd

chunk_size = 1000

batch_no =1

for chunk in pd.read_csv('data/master/PincodeMaster.csv',chunksize=chunk_size):
    chunk.to_csv('data/chunks/pincode'+str(batch_no)+".csv", index=False)
    batch_no = batch_no + 1