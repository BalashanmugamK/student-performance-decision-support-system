def eda_summary(df):
    return {
        "shape": df.shape,
        "columns": list(df.columns),
        "missing_values": df.isnull().sum().to_dict(),
        "description": df.describe().to_dict()
    }
