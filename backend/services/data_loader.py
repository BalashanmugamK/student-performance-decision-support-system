import pandas as pd

def load_student_dataset(file):
    return pd.read_csv(file, sep=None, engine="python")
