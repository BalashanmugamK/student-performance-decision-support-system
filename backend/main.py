from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd

from services.ml_models import (
    predict_risk_all,
    predict_grade_all,
    predict_risk,
    predict_grade,
    class_grade_stats,
    compute_severity_all
)
from services.text_analytics import sentiment_analysis, top_keywords
from services.eda import eda_summary

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Root endpoint for health check or welcome message
@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

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
    feedback_df = read_csv_auto(file.file)
    return {"status": "Feedback dataset uploaded successfully"}

# =====================================================
# STUDENT SUMMARY (CORE API)
# =====================================================
@app.get("/students/summary")
def students_summary():
    if student_df is None:
        raise HTTPException(400, "Student dataset not uploaded")

    risks = predict_risk_all(student_df)
    grades = predict_grade_all(student_df)
    severity = compute_severity_all(student_df)

    summary = []

    for i in range(len(student_df)):
        row = student_df.iloc[i]

        current_avg = (row["G1"] + row["G2"]) / 2

        # Handle early stage (G2 not yet available)
        if row["G2"] == 0:
            predicted = 0.0
        else:
            predicted = float(grades[i]["predicted_grade"])

        if predicted >= 10:
            group = "Likely to Pass"
        elif predicted >= 7:
            group = "Borderline"
        else:
            group = "Likely to Fail"

        summary.append({
            "student_id": int(i),
            "name": str(row.get("name", f"Student {i}")),

            "actual_G1": float(row["G1"]),
            "actual_G2": float(row["G2"]),
            "current_average": round(current_avg, 2),

            "predicted_grade": predicted,
            "risk_level": str(risks[i]["risk_level"]),
            "severity": float(severity[i]["severity"]),

            "group": group
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
        counts[str(r["risk_level"])] += 1

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

# -------------------- FEEDBACK ANALYTICS --------------------
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

# -------------------- SINGLE STUDENT --------------------
@app.post("/students/predict")
def predict_single_student(data: StudentInput):
    return {
        "risk_level": predict_risk(data.dict()),
        "predicted_grade": predict_grade(data.dict())
    }

# -------------------- PREDICTED GRADE DISTRIBUTION --------------------
@app.get("/analytics/predicted-grade-distribution")
def predicted_grade_distribution():
    if student_df is None:
        raise HTTPException(400, "Student dataset not uploaded")

    grades = predict_grade_all(student_df)

    bins = {
        "0–5": 0,
        "5–10": 0,
        "10–15": 0,
        "15–20": 0
    }

    for g in grades:
        p = float(g["predicted_grade"])

        if p < 5:
            bins["0–5"] += 1
        elif p < 10:
            bins["5–10"] += 1
        elif p < 15:
            bins["10–15"] += 1
        else:
            bins["15–20"] += 1

    return bins
