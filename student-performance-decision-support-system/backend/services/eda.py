import numpy as np
def eda_summary(df):
    return {
        "total_students": int(len(df)),
        "average_G3": round(float(df["G3"].mean()), 2) if "G3" in df else None,
        "average_absences": round(float(df["absences"].mean()), 2),
        "students_low_attendance": int((df["absences"] > 10).sum())
    }
