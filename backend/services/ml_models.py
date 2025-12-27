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

# -------------------- Globals --------------------
risk_model = None
grade_model = None
selected_features = None

# -------------------- Utilities --------------------
def infer_features(df, target):
    """
    Automatically infer numeric features excluding target.
    """
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    if target not in numeric_cols:
        raise ValueError(f"Target column '{target}' must be numeric")
    numeric_cols.remove(target)
    return numeric_cols

def create_risk_label(df, target):
    """
    Convert numeric target into risk categories.
    """
    return pd.qcut(
        df[target],
        q=3,
        labels=["High Risk", "Medium Risk", "Low Risk"]
    )

# -------------------- Training --------------------
def train_models(df):
    global risk_model, grade_model, selected_features

    if df is None:
        raise ValueError("Dataset not loaded")

    # Choose target dynamically
    TARGET_GRADE = df.select_dtypes(include="number").columns[-1]

    # Infer features
    selected_features = infer_features(df, TARGET_GRADE)

    X = df[selected_features]
    y_grade = df[TARGET_GRADE]
    y_risk = create_risk_label(df, TARGET_GRADE)

    # Pipelines
    risk_model = Pipeline([
        ("scaler", StandardScaler()),
        ("model", RandomForestClassifier(random_state=42))
    ])

    grade_model = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LinearRegression())
    ])

    risk_model.fit(X, y_risk)
    grade_model.fit(X, y_grade)

    # Save everything
    joblib.dump(risk_model, RISK_MODEL_PATH)
    joblib.dump(grade_model, GRADE_MODEL_PATH)
    joblib.dump(selected_features, FEATURES_PATH)

# -------------------- Prediction --------------------
def predict_risk(data):
    model = joblib.load(RISK_MODEL_PATH)
    features = joblib.load(FEATURES_PATH)

    X = pd.DataFrame([data])[features]
    return model.predict(X)[0]

def predict_grade(data):
    model = joblib.load(GRADE_MODEL_PATH)
    features = joblib.load(FEATURES_PATH)

    X = pd.DataFrame([data])[features]
    return round(float(model.predict(X)[0]), 2)
