import React, { useState } from "react";

// API calls
import {
  trainModels,
  predictRisk,
  predictGrade,
} from "./api";

// Components
import UploadDataset from "./components/UploadDataset";
import ResultsTable from "./components/ResultsTable";
import ClusterChart from "./components/ClusterChart";
import PCAChart from "./components/PCAChart";
import SentimentChart from "./components/SentimentChart";

function App() {
  // Workflow state
  const [datasetReady, setDatasetReady] = useState(false);
  const [modelsTrained, setModelsTrained] = useState(false);
  const [feedbackReady, setFeedbackReady] = useState(false);

  // Status & results
  const [status, setStatus] = useState("");
  const [riskResult, setRiskResult] = useState(null);
  const [gradeResult, setGradeResult] = useState(null);

  // Input for prediction
  const [input, setInput] = useState({
    studytime: "",
    absences: "",
    G1: "",
    G2: "",
    failures: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Train ML models
  const handleTrain = async () => {
    try {
      setStatus("Training models...");
      await trainModels();
      setModelsTrained(true);
      setStatus("Models trained successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Model training failed.");
    }
  };

  // Predict risk
  const handlePredictRisk = async () => {
    try {
      const res = await predictRisk(input);
      setRiskResult(res.data.risk_level);
    } catch (err) {
      console.error(err);
    }
  };

  // Predict grade
  const handlePredictGrade = async () => {
    try {
      const res = await predictGrade(input);
      setGradeResult(res.data.predicted_grade);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Student Performance Decision Support System</h1>

      {/* STEP 1: Upload Student Dataset */}
      <UploadDataset
        label="Upload Student Dataset"
        endpoint="student"
        onUploadSuccess={() => setDatasetReady(true)}
      />

      {/* STEP 1b: Upload Feedback Dataset (optional but required for sentiment) */}
      {datasetReady && (
        <UploadDataset
          label="Upload Feedback Dataset"
          endpoint="feedback"
          onUploadSuccess={() => setFeedbackReady(true)}
        />
      )}

      {/* STEP 2: Train Models */}
      {datasetReady && (
        <div className="card">
          <button onClick={handleTrain}>Train Models</button>
        </div>
      )}

      <p>{status}</p>

      {/* STEP 3: Prediction Inputs */}
      {modelsTrained && (
        <div className="card">
          <h2>Student Performance Prediction</h2>

          <input
            name="studytime"
            placeholder="Study Time"
            onChange={handleChange}
          />
          <input
            name="absences"
            placeholder="Absences"
            onChange={handleChange}
          />
          <input
            name="G1"
            placeholder="G1"
            onChange={handleChange}
          />
          <input
            name="G2"
            placeholder="G2"
            onChange={handleChange}
          />
          <input
            name="failures"
            placeholder="Failures"
            onChange={handleChange}
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={handlePredictRisk}>Predict Risk</button>
            <button onClick={handlePredictGrade} style={{ marginLeft: "10px" }}>
              Predict Grade
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Prediction Results */}
      {modelsTrained && (
        <ResultsTable
          riskResult={riskResult}
          gradeResult={gradeResult}
        />
      )}

      {/* STEP 5: Analytics Dashboard */}
      {modelsTrained && (
        <>
          <ClusterChart />
          <PCAChart />
          {feedbackReady && <SentimentChart />}
        </>
      )}
    </div>
  );
}

export default App;
