import React, { useState } from "react";

// Core components
import UploadDataset from "./components/UploadDataset";
import StudentSummary from "./components/StudentSummary";
import RiskOverview from "./components/RiskOverview";
import Recommendations from "./components/Recommendations";

// Visualizations (CLIENT-FRIENDLY)
import RiskChart from "./components/RiskChart";
import ClassCards from "./components/ClassCards";
import FeedbackAnalytics from "./components/FeedbackAnalytics";
import FeedbackSentimentChart from "./components/FeedbackSentimentChart";

function App() {
  // used to re-fetch data after upload/reset
  const [dataVersion, setDataVersion] = useState(0);

  // track which datasets are available
  const [hasStudentData, setHasStudentData] = useState(false);
  const [hasFeedbackData, setHasFeedbackData] = useState(false);

  // callbacks from UploadDataset
  const onStudentUpload = () => {
    setHasStudentData(true);
    setDataVersion((v) => v + 1);
  };

  const onFeedbackUpload = () => {
    setHasFeedbackData(true);
    setDataVersion((v) => v + 1);
  };

  const onReset = () => {
    setHasStudentData(false);
    setHasFeedbackData(false);
    setDataVersion((v) => v + 1);
  };

  return (
    <div className="app-container">
      <h1>Student Performance Decision Support System</h1>

      {/* ================= UPLOAD SECTION ================= */}
      <UploadDataset
        onStudentUpload={onStudentUpload}
        onFeedbackUpload={onFeedbackUpload}
        onReset={onReset}
      />

      {/* ================= STUDENT ANALYTICS ================= */}
      {hasStudentData ? (
        <>
          <StudentSummary dataVersion={dataVersion} />
          <RiskOverview dataVersion={dataVersion} />
          <RiskChart dataVersion={dataVersion} />
          <ClassCards dataVersion={dataVersion} />
          <Recommendations dataVersion={dataVersion} />
        </>
      ) : (
        <p>Please upload a student dataset to view performance analytics.</p>
      )}

      {/* ================= FEEDBACK ANALYTICS ================= */}
      {hasFeedbackData ? (
        <>
          <FeedbackAnalytics dataVersion={dataVersion} />
          <FeedbackSentimentChart dataVersion={dataVersion} />
        </>
      ) : (
        <p>Please upload a feedback dataset to view feedback analytics.</p>
      )}
    </div>
  );
}

export default App;
