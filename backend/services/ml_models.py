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

    if risk_model is None:
        risk_model = joblib.load(RISK_MODEL_PATH)
        grade_model = joblib.load(GRADE_MODEL_PATH)
        features = joblib.load(FEATURES_PATH)


# -------------------- Prediction --------------------
def predict_risk(data):
    model = joblib.load(RISK_MODEL_PATH)
    features = joblib.load(FEATURES_PATH)

    X = pd.DataFrame([data])
    X = X[features]

    return model.predict(X)[0]

def predict_grade(data):
    model = joblib.load(GRADE_MODEL_PATH)
    features = joblib.load(FEATURES_PATH)

    X = pd.DataFrame([data])
    X = X[features]

    return round(float(model.predict(X)[0]), 2)

def class_grade_stats(df):
    """
    Compute class-level grade statistics
    """
    if "G3" not in df.columns:
        raise ValueError("Target column G3 not found in dataset")

    return {
        "class_average": round(float(df["G3"].mean()), 2),
        "class_std": round(float(df["G3"].std()), 2),
        "total_students": int(len(df))
    }
def predict_risk_all(df):
    load_models()
    X = df[features]
    preds = risk_model.predict(X)

    return [
        {"student_id": i, "risk_level": str(p)}
        for i, p in enumerate(preds)
    ]


def predict_grade_all(df):
    load_models()
    X = df[features]
    preds = grade_model.predict(X)

    return [
        {"student_id": i, "predicted_grade": round(float(p), 2)}
        for i, p in enumerate(preds)
    ]


