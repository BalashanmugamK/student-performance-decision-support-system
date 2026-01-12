from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd

from services.ml_models import (
    predict_risk_all,
    predict_grade_all,
    predict_risk,
    predict_grade,
    class_grade_stats
)
from services.clustering import cluster_students
from services.text_analytics import sentiment_analysis, top_keywords
from services.eda import eda_summary

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

# -------------------- GLOBAL STATE --------------------
student_df = None
feedback_df = None

# -------------------- HELPERS --------------------
def read_csv_auto(file):
    try:
        return pd.read_csv(file, sep=None, engine="python")
    except Exception as e:
        raise HTTPException(400, f"CSV read failed: {e}")

# -------------------- INPUT SCHEMA --------------------
class StudentInput(BaseModel):
    studytime: float
    absences: float
    G1: float
    G2: float
    failures: int

# -------------------- RESET --------------------
@app.post("/reset")
def reset_system():
    global student_df, feedback_df
    student_df = None
    feedback_df = None
    return {"status": "System reset successful"}

# -------------------- UPLOAD STUDENT --------------------
@app.post("/upload/student")
async def upload_student(file: UploadFile = File(...)):
    global student_df

    df = read_csv_auto(file.file)

    REQUIRED = {"studytime", "absences", "G1", "G2", "failures"}
    if not REQUIRED.issubset(set(df.columns)):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid student dataset. Required columns: {REQUIRED}"
        )

    student_df = df
    return {"status": "Student dataset uploaded successfully"}

# -------------------- UPLOAD FEEDBACK --------------------
@app.post("/upload/feedback")
async def upload_feedback(file: UploadFile = File(...)):
    global feedback_df

    df = read_csv_auto(file.file)

    if df.shape[1] < 1:
        raise HTTPException(400, "Invalid feedback dataset")

    feedback_df = df
    return {"status": "Feedback dataset uploaded successfully"}

# =====================================================
# STUDENT SUMMARY (CORE CLIENT FEATURE)
# =====================================================

@app.get("/students/summary")
def students_summary():
    if student_df is None:
        raise HTTPException(400, "Student dataset not uploaded")

    risks = predict_risk_all(student_df)
    grades = predict_grade_all(student_df)
    clusters = cluster_students(student_df)

    cluster_map = {
        0: "Needs Academic Support",
        1: "Average Progress",
        2: "High Performers"
    }

    summary = []
    for r, g, c in zip(risks, grades, clusters):
        row = student_df.iloc[r["student_id"]]
        name = row.get("name", f"Student {r['student_id']}")

        summary.append({
            "student_id": r["student_id"],
            "name": name,
            "risk_level": r["risk_level"],
            "predicted_grade": g["predicted_grade"],
            "group": cluster_map[c["cluster"]]
        })

    return summary

# -------------------- RISK OVERVIEW --------------------
@app.get("/students/risk-overview")
def risk_overview():
    if student_df is None:
        raise HTTPException(400, "Student dataset not uploaded")

    risks = predict_risk_all(student_df)
    counts = {"High Risk": 0, "Medium Risk": 0, "Low Risk": 0}

    for r in risks:
        counts[r["risk_level"]] += 1

    return counts

# -------------------- CLASS OVERVIEW --------------------
@app.get("/analytics/class-overview")
def class_overview():
    if student_df is None:
        raise HTTPException(400, "Student dataset not uploaded")

    return {
        "eda": eda_summary(student_df),
        "grade_stats": class_grade_stats(student_df)
    }

# -------------------- FEEDBACK --------------------
@app.get("/feedback/sentiment")
def feedback_sentiment():
    if feedback_df is None:
        raise HTTPException(400, "Feedback not uploaded")
    return sentiment_analysis(feedback_df)

@app.get("/feedback/keywords")
def feedback_keywords():
    if feedback_df is None:
        raise HTTPException(400, "Feedback not uploaded")
    sentiment_analysis(feedback_df)
    return top_keywords(feedback_df)

# -------------------- RECOMMENDATIONS --------------------
@app.get("/recommendations")
def recommendations():
    if student_df is None:
        raise HTTPException(400, "Student dataset not uploaded")

    risks = predict_risk_all(student_df)
    high = sum(1 for r in risks if r["risk_level"] == "High Risk")

    suggestions = []
    if high > len(risks) * 0.3:
        suggestions.append("Conduct remedial classes")
    if high > 0:
        suggestions.append("Monitor attendance and internal assessments")

    return suggestions

# -------------------- OPTIONAL SINGLE STUDENT --------------------
@app.post("/students/predict")
def predict_single_student(data: StudentInput):
    return {
        "risk_level": predict_risk(data.dict()),
        "predicted_grade": predict_grade(data.dict())
    }
