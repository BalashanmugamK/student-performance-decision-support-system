import React from "react";

function ResultsTable({ risk, grade }) {
  return (
    <div className="section">
      <h2>Results</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Risk Level</th>
            <th>Predicted Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{risk || "-"}</td>
            <td>{grade || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
