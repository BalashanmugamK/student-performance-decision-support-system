import React from "react";

function ResultsTable({ riskResult, gradeResult }) {
  return (
    <div>
      <h2>Results Table</h2>
      <table border="1" style={{ margin: "10px 0", minWidth: "300px" }}>
        <thead>
          <tr>
            <th>Risk Level</th>
            <th>Predicted Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{riskResult || "-"}</td>
            <td>{gradeResult !== null ? gradeResult : "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
