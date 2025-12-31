import numpy as np

def eda_summary(df):
    numeric = df.select_dtypes(include="number")

    # Histogram (G3)
    counts, bins = np.histogram(numeric["G3"], bins=10)

    # Correlation
    corr = numeric.corr().round(3)

    return {
        "histogram": {
            "labels": bins.tolist(),
            "values": counts.tolist()
        },
        "correlation": {
            "labels": corr.columns.tolist(),
            "matrix": corr.values.tolist()
        }
    }
