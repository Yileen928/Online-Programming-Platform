import numpy as np
import pandas as pd

# 创建一个简单的数组
arr = np.array([1, 2, 3, 4, 5])
print(f"NumPy array: {arr}")

# 创建一个简单的DataFrame
df = pd.DataFrame({'numbers': arr})
print("\nPandas DataFrame:")
print(df)