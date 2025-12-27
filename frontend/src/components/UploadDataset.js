import React, { useState } from "react";
import { uploadStudentDataset } from "../api";

function UploadDataset({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setStatus("Please select a CSV file.");
      return;
    }

    try {
      setStatus("Uploading dataset...");
      await uploadStudentDataset(file);
      setStatus("Dataset uploaded successfully.");
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      if (err.response) {
        setStatus(
          "Upload failed: " +
            err.response.status +
            " " +
            JSON.stringify(err.response.data)
        );
      } else {
        setStatus("Upload failed: " + err.message);
      }
    }
  };

  return (
    <div className="card">
      <h2>Upload Student Dataset</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit Dataset</button>
      <p>{status}</p>
    </div>
  );
}

export default UploadDataset;
