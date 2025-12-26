# This module will contain functions to load data, train models, and make predictions

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# --- Model Training and Prediction Utilities ---

def load_data(csv_path: str):
    df = pd.read_csv(csv_path, sep=';')
    # Create risk_level as in the notebook
    df['risk_level'] = pd.cut(
        df['G3'],
        bins=[-1, 9, 14, 20],
        labels=['High Risk', 'Medium Risk', 'Low Risk']
    )
    return df

def prepare_features(df):
    features = ['studytime', 'absences', 'G1', 'G2', 'failures']
    X = df[features]
    y_class = df['risk_level']
    y_reg = df['G3']
    return X, y_class, y_reg

def train_classification_models(X, y):
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Logistic Regression
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train_scaled, y_train)

    # Decision Tree
    dt = DecisionTreeClassifier(random_state=42)
    dt.fit(X_train, y_train)

    # Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)

    return {
        'scaler': scaler,
        'lr': lr,
        'dt': dt,
        'rf': rf,
        'X_test': X_test,
        'y_test': y_test
    }

def predict_risk(model_dict, X_new):
    # Use Random Forest by default
    scaler = model_dict['scaler']
    rf = model_dict['rf']
    X_new_scaled = scaler.transform(X_new)
    return rf.predict(X_new_scaled)

def train_regression_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    lr_reg = LinearRegression()
    lr_reg.fit(X_train, y_train)
    return {
        'reg': lr_reg,
        'X_test': X_test,
        'y_test': y_test
    }

def predict_grade(model_dict, X_new):
    reg = model_dict['reg']
    return reg.predict(X_new)
