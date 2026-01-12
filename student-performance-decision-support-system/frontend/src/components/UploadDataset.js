import React, { useState } from "react";
import {
  uploadStudentDataset,
  uploadFeedbackDataset,
  resetSystem
} from "../api";

function UploadDataset({
  onStudentUpload = () => {},
  onFeedbackUpload = () => {},
  onReset = () => {}
}) {
  const [studentFile, setStudentFile] = useState(null);
  const [feedbackFile, setFeedbackFile] = useState(null);
  const [status, setStatus] = useState("");
  const [inputKey, setInputKey] = useState(0); // 🔥 IMPORTANT

  const uploadStudents = async () => {
    if (!studentFile) {
      setStatus("Please select a student CSV file.");
      return;
    }

    try {
      setStatus("Uploading student dataset...");
      await uploadStudentDataset(studentFile);
      setStatus("Student dataset uploaded successfully.");
      onStudentUpload();
    } catch (e) {
      setStatus(e.response?.data?.detail || "Student upload failed");
    }
  };

  const uploadFeedback = async () => {
    if (!feedbackFile) {
      setStatus("Please select a feedback CSV file.");
      return;
    }

    try {
      setStatus("Uploading feedback dataset...");
      await uploadFeedbackDataset(feedbackFile);
      setStatus("Feedback dataset uploaded successfully.");
      onFeedbackUpload();
    } catch (e) {
      setStatus(e.response?.data?.detail || "Feedback upload failed");
    }
  };

  const resetAll = async () => {
    try {
      await resetSystem();

      // 🔥 reset React state
      setStudentFile(null);
      setFeedbackFile(null);
      setStatus("System reset. Upload new datasets.");

      // 🔥 force file input reset
      setInputKey((k) => k + 1);

      onReset();
    } catch {
      setStatus("Reset failed");
    }
  };

  return (
    <div className="section">
      <h2>Upload Datasets</h2>

      {/* Student dataset */}
      <input
        key={`student-${inputKey}`}
        type="file"
        accept=".csv"
        onChange={(e) => setStudentFile(e.target.files[0])}
      />
      <button onClick={uploadStudents}>Submit Student Dataset</button>

      <br /><br />

      {/* Feedback dataset */}
      <input
        key={`feedback-${inputKey}`}
        type="file"
        accept=".csv"
        onChange={(e) => setFeedbackFile(e.target.files[0])}
      />
      <button onClick={uploadFeedback}>Submit Feedback Dataset</button>

      <br /><br />

      <button
        style={{ backgroundColor: "#ff4d4d", color: "white" }}
        onClick={resetAll}
      >
        Start Fresh / Reset
      </button>

      <p>{status}</p>
    </div>
  );
}

export default UploadDataset;
