from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

def ml_visuals(df):
    X = df[["studytime","absences","G1","G2","failures"]]
    y = pd.qcut(df["G3"], q=3, labels=["High","Medium","Low"])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(),
        "Random Forest": RandomForestClassifier()
    }

    accuracy = {}
    rf_confusion = None
    rf_importance = None

    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        accuracy[name] = round(accuracy_score(y_test, preds), 3)

        if name == "Random Forest":
            rf_confusion = confusion_matrix(y_test, preds).tolist()
            rf_importance = dict(
                zip(X.columns, model.feature_importances_.round(3))
            )

    return {
        "accuracy": accuracy,
        "confusion_matrix": rf_confusion,
        "feature_importance": rf_importance
    }
