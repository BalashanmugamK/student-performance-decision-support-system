import React from "react";

function ResultsTable({ risk, grade }) {
  return (
    <div className="section">
      <h2>Results</h2>
      <div
        className="table-responsive"
        style={{ maxWidth: 400, overflowX: "auto" }}
      >
        <table border="1" style={{ width: "100%", minWidth: 300 }}>
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
    </div>
  );
}

export default ResultsTable;
