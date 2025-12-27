
# --- Imports ---
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import pandas as pd
import ml_models
import os
from models import Student, SessionLocal

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SaveStudentRequest(BaseModel):
    studytime: float
    absences: float
    G1: float
    G2: float
    failures: float
    risk_level: str
    predicted_grade: float

# Save student record endpoint
@app.post("/save_student")
def save_student(input: SaveStudentRequest, db: Session = Depends(get_db)):
    student = Student(
        studytime=input.studytime,
        absences=input.absences,
        G1=input.G1,
        G2=input.G2,
        failures=input.failures,
        risk_level=input.risk_level,
        predicted_grade=input.predicted_grade
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return {"status": "success", "student_id": student.id}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory model storage (for demo)
model_store = {
    'classification': None,
    'regression': None,
    'features': ['studytime', 'absences', 'G1', 'G2', 'failures']
}

@app.get("/")
def read_root():
    return {"message": "Student Performance Decision Support System API is running."}

class PredictRequest(BaseModel):
    studytime: float
    absences: float
    G1: float
    G2: float
    failures: float

@app.post("/train")
def train_models():
    # Load and prepare data
    df = ml_models.load_data(os.path.join("..", "data", "student_performance.csv"))
    X, y_class, y_reg = ml_models.prepare_features(df)
    # Train models
    model_store['classification'] = ml_models.train_classification_models(X, y_class)
    model_store['regression'] = ml_models.train_regression_model(X, y_reg)
    return {"message": "Models trained successfully."}

@app.post("/predict-risk")
def predict_risk(input: PredictRequest):
    if not model_store['classification']:
        return {"error": "Model not trained. Call /train first."}
    X_new = pd.DataFrame([[input.studytime, input.absences, input.G1, input.G2, input.failures]], columns=model_store['features'])
    pred = ml_models.predict_risk(model_store['classification'], X_new)
    return {"risk_level": str(pred[0])}

@app.post("/predict-grade")
def predict_grade(input: PredictRequest):
    if not model_store['regression']:
        return {"error": "Model not trained. Call /train first."}
    X_new = pd.DataFrame([[input.studytime, input.absences, input.G1, input.G2, input.failures]], columns=model_store['features'])
    pred = ml_models.predict_grade(model_store['regression'], X_new)
    return {"predicted_grade": float(pred[0])}
