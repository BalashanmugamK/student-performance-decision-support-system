import React, { useState } from "react";
import { trainModels, predictRisk, predictGrade, saveStudent } from "./api";
import Dashboard from "./components/Dashboard";
import ModelSelector from "./components/ModelSelector";
import ResultsTable from "./components/ResultsTable";
import UploadDataset from "./components/UploadDataset";
import Charts from "./components/Charts";

function App() {
  const [input, setInput] = useState({
    studytime: "",
    absences: "",
    G1: "",
    G2: "",
    failures: "",
  });
  const [riskResult, setRiskResult] = useState(null);
  const [gradeResult, setGradeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainSuccess, setTrainSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleSaveStudent = async () => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await saveStudent({
        ...input,
        risk_level: riskResult,
        predicted_grade: gradeResult,
      });
      setSaveSuccess(true);
    } catch (err) {
      setError("Save failed.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleTrain = async () => {
    setLoading(true);
    setError(null);
    try {
      await trainModels();
      setTrainSuccess(true);
      setError(null);
    } catch (err) {
      setError("Training failed.");
      setTrainSuccess(false);
    }
    setLoading(false);
  };

  const handlePredictRisk = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictRisk(input);
      setRiskResult(res.data.risk_level);
    } catch (err) {
      setError("Prediction failed.");
    }
    setLoading(false);
  };

  const handlePredictGrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictGrade(input);
      setGradeResult(res.data.predicted_grade);
    } catch (err) {
      setError("Prediction failed.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Student Performance Decision Support System</h1>
      <button onClick={handleTrain} disabled={loading}>
        Train Models
      </button>
      {trainSuccess && (
        <div style={{ color: "green" }}>Training successful!</div>
      )}
      <div>
        <h2>Enter Student Data</h2>
        <input
          name="studytime"
          placeholder="Study Time"
          value={input.studytime}
          onChange={handleChange}
        />
        <input
          name="absences"
          placeholder="Absences"
          value={input.absences}
          onChange={handleChange}
        />
        <input
          name="G1"
          placeholder="G1"
          value={input.G1}
          onChange={handleChange}
        />
        <input
          name="G2"
          placeholder="G2"
          value={input.G2}
          onChange={handleChange}
        />
        <input
          name="failures"
          placeholder="Failures"
          value={input.failures}
          onChange={handleChange}
        />
        <button onClick={handlePredictRisk} disabled={loading}>
          Predict Risk
        </button>
        <button onClick={handlePredictGrade} disabled={loading}>
          Predict Grade
        </button>
        <button
          onClick={handleSaveStudent}
          disabled={loading || !riskResult || !gradeResult}
        >
          Save Student Record
        </button>
      </div>
      {riskResult && (
        <div>
          <strong>Risk Level:</strong> {riskResult}
        </div>
      )}
      {gradeResult && (
        <div>
          <strong>Predicted Grade:</strong> {gradeResult}
        </div>
      )}
      {saveSuccess && (
        <div style={{ color: "green" }}>Student record saved!</div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ResultsTable riskResult={riskResult} gradeResult={gradeResult} />
      <Dashboard />
      <ModelSelector />
      <UploadDataset />
      <Charts />
    </div>
  );
}

export default App;
