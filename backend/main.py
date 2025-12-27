from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd

from services.data_loader import load_student_dataset
from services.eda import eda_summary
from services.ml_models import train_models, predict_risk, predict_grade
from services.clustering import cluster_students, pca_analysis
from services.text_analytics import sentiment_analysis, topic_modeling

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Global State --------------------
student_df = None
feedback_df = None

# -------------------- Input Schema --------------------
class StudentInput(BaseModel):
    studytime: float
    absences: float
    G1: float
    G2: float
    failures: float

# -------------------- Helpers --------------------
def read_csv_auto(file):
    """
    Automatically detect delimiter and read CSV safely.
    """
    try:
        return pd.read_csv(file, sep=None, engine="python")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CSV read failed: {str(e)}")

# -------------------- Upload Endpoints --------------------
@app.post("/upload/student")
async def upload_student(file: UploadFile = File(...)):
    global student_df
    student_df = read_csv_auto(file.file)
    return {"status": "Student dataset uploaded"}

@app.post("/upload/feedback")
async def upload_feedback(file: UploadFile = File(...)):
    global feedback_df
    feedback_df = read_csv_auto(file.file)
    return {"status": "Feedback dataset uploaded"}

# -------------------- Analytics Endpoints --------------------
@app.get("/eda")
def run_eda():
    if student_df is None:
        raise HTTPException(status_code=400, detail="Student dataset not uploaded")
    return eda_summary(student_df)

@app.post("/train")
def train():
    if student_df is None:
        raise HTTPException(status_code=400, detail="Student dataset not uploaded")
    train_models(student_df)
    return {"status": "Models trained"}

@app.post("/predict-risk")
def risk(data: StudentInput):
    return {"risk_level": predict_risk(data.dict())}

@app.post("/predict-grade")
def grade(data: StudentInput):
    return {"predicted_grade": predict_grade(data.dict())}

@app.get("/clustering")
def clustering():
    if student_df is None:
        raise HTTPException(status_code=400, detail="Student dataset not uploaded")
    return cluster_students(student_df)

@app.get("/pca")
def pca():
    if student_df is None:
        raise HTTPException(status_code=400, detail="Student dataset not uploaded")
    return pca_analysis(student_df)

@app.get("/sentiment")
def sentiment():
    if feedback_df is None:
        return {"error": "Feedback dataset not uploaded"}
    return sentiment_analysis(feedback_df)

@app.get("/topics")
def topics():
    if feedback_df is None:
        return {"error": "Feedback dataset not uploaded"}
    return topic_modeling(feedback_df)
