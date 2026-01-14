import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# -------------------- Paths --------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

RISK_MODEL_PATH = os.path.join(MODEL_DIR, "risk_model.pkl")
GRADE_MODEL_PATH = os.path.join(MODEL_DIR, "grade_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "features.pkl")

risk_model = None
grade_model = None
features = None

# -------------------- Training --------------------
def train_models(df):
    global risk_model, grade_model, features

    features = ["studytime", "absences", "G1", "G2", "failures"]
    target = "G3"

    X = df[features]
    y = df[target]

    y_risk = pd.qcut(y, q=3, labels=["High Risk", "Medium Risk", "Low Risk"])

    risk_model = Pipeline([
        ("scaler", StandardScaler()),
        ("model", RandomForestClassifier(random_state=42))
    ])

    grade_model = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LinearRegression())
    ])

    risk_model.fit(X, y_risk)
    grade_model.fit(X, y)

    joblib.dump(risk_model, RISK_MODEL_PATH)
    joblib.dump(grade_model, GRADE_MODEL_PATH)
    joblib.dump(features, FEATURES_PATH)

def load_models():
    global risk_model, grade_model, features

    if risk_model is None or grade_model is None:
        risk_model = joblib.load(RISK_MODEL_PATH)
        grade_model = joblib.load(GRADE_MODEL_PATH)
        features = joblib.load(FEATURES_PATH)

# -------------------- Severity (UPDATED & FINAL) --------------------
def compute_severity(row):
    current_avg = (row["G1"] + row["G2"]) / 2

    severity = (
        (row["failures"] * 2)
        + (row["absences"] / 5)
        + ((20 - current_avg) / 2)
    )

    return round(severity, 2)

# -------------------- Prediction --------------------
def predict_risk(data):
    load_models()
    X = pd.DataFrame([data])[features]
    return risk_model.predict(X)[0]

def predict_grade(data):
    load_models()
    X = pd.DataFrame([data])[features]

    pred = float(grade_model.predict(X)[0])
    pred = max(0, min(20, pred))
    return round(pred, 2)

def class_grade_stats(df):
    return {
        "class_average": round(float(df["G3"].mean()), 2),
        "class_std": round(float(df["G3"].std()), 2),
        "min_grade": round(float(df["G3"].min()), 2),
        "max_grade": round(float(df["G3"].max()), 2),
        "total_students": int(len(df))
    }

def predict_risk_all(df):
    load_models()
    preds = risk_model.predict(df[features])
    return [{"student_id": i, "risk_level": str(p)} for i, p in enumerate(preds)]

def predict_grade_all(df):
    load_models()
    preds = grade_model.predict(df[features])

    results = []
    for i, p in enumerate(preds):
        p = max(0, min(20, float(p)))
        results.append({
            "student_id": i,
            "predicted_grade": round(p, 2)
        })
    return results

def compute_severity_all(df):
    return [
        {"student_id": i, "severity": compute_severity(row)}
        for i, row in df.iterrows()
    ]
