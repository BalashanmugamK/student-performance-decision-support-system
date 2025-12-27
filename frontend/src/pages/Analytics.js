import React, { useState } from "react";
import { trainModels, predictRisk, predictGrade } from "../api";
import ResultsTable from "../components/ResultsTable";
import Charts from "../components/Charts";
import ModelSelector from "../components/ModelSelector";

function Analytics() {
  const [input, setInput] = useState({
    studytime: "",
    absences: "",
    G1: "",
    G2: "",
    failures: "",
  });

  const [riskResult, setRiskResult] = useState(null);
  const [gradeResult, setGradeResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleTrain = async () => {
    await trainModels();
    setMessage("Models trained successfully");
  };

  const handleRisk = async () => {
    const res = await predictRisk(input);
    setRiskResult(res.data.risk_level);
  };

  const handleGrade = async () => {
    const res = await predictGrade(input);
    setGradeResult(res.data.predicted_grade);
  };

  return (
    <div className="section">
      <h2>Analytics</h2>

      <button onClick={handleTrain}>Train Models</button>
      <p>{message}</p>

      <h3>Enter Student Data</h3>
      <input name="studytime" placeholder="Study Time" onChange={handleChange} />
      <input name="absences" placeholder="Absences" onChange={handleChange} />
      <input name="G1" placeholder="G1" onChange={handleChange} />
      <input name="G2" placeholder="G2" onChange={handleChange} />
      <input name="failures" placeholder="Failures" onChange={handleChange} />

      <br />
      <button onClick={handleRisk}>Predict Risk</button>
      <button onClick={handleGrade}>Predict Grade</button>

      <ResultsTable riskResult={riskResult} gradeResult={gradeResult} />
      <ModelSelector />
      <Charts />
    </div>
  );
}

export default Analytics;
