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

# -------------------- Training --------------------
def train_models(df):
    
    features = ["studytime", "absences", "G1", "G2", "failures"]
    target = "G3"

    # Safety check
    for col in features + [target]:
        if col not in df.columns:
            raise ValueError(f"Required column '{col}' not found in dataset")

    X = df[features]
    y = df[target]

    # Risk labels
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
