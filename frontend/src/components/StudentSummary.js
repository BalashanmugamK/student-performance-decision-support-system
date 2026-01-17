import React, { useEffect, useState } from "react";
import { getStudentSummary } from "../api";

function StudentSummary({ dataVersion }) {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");

  // [{ key, direction }]
  const [sortConfig, setSortConfig] = useState([]);

  useEffect(() => {
    getStudentSummary()
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  }, [dataVersion]);

  if (!students.length) {
    return <p>No student data available.</p>;
  }

  // 🔍 SEARCH FILTER
  let filtered = students.filter((s) =>
    Object.values(s).join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  // 🔢 MULTI-COLUMN SORT (Excel-style)
  if (sortConfig.length > 0) {
    filtered = [...filtered].sort((a, b) => {
      for (let { key, direction } of sortConfig) {
        let aVal = a[key];
        let bVal = b[key];

        if (!isNaN(aVal) && !isNaN(bVal)) {
          if (aVal !== bVal) {
            return direction === "asc" ? aVal - bVal : bVal - aVal;
          }
        } else {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();

          if (aVal < bVal) return direction === "asc" ? -1 : 1;
          if (aVal > bVal) return direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
  }

  const requestSort = (key) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);

      if (existing) {
        return prev.map((s) =>
          s.key === key
            ? { ...s, direction: s.direction === "asc" ? "desc" : "asc" }
            : s,
        );
      }

      return [...prev, { key, direction: "asc" }];
    });
  };

  const sortIndicator = (key) => {
    const index = sortConfig.findIndex((s) => s.key === key);
    if (index === -1) return "";
    const arrow = sortConfig[index].direction === "asc" ? "▲" : "▼";
    return ` (${index + 1}${arrow})`;
  };

  const clearSort = () => setSortConfig([]);

  const severityStyle = (severity) => {
    if (severity >= 5) return { color: "red", fontWeight: "bold" };
    if (severity >= 2) return { color: "orange" };
    return { color: "green" };
  };

  return (
    <div className="section">
      <h2>Student Summary</h2>

      <input
        placeholder="Search by name, id, G1, G2, predicted grade, risk, severity, group..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "10px", width: "60%" }}
      />

      <br />

      <button onClick={clearSort} style={{ marginBottom: "10px" }}>
        Clear Sorting
      </button>

      <div className="table-responsive">
        <table border="1" width="100%">
          <thead>
            <tr>
              <th onClick={() => requestSort("student_id")}>
                ID{sortIndicator("student_id")}
              </th>
              <th onClick={() => requestSort("name")}>
                Name{sortIndicator("name")}
              </th>
              <th onClick={() => requestSort("actual_G1")}>
                G1{sortIndicator("actual_G1")}
              </th>
              <th onClick={() => requestSort("actual_G2")}>
                G2{sortIndicator("actual_G2")}
              </th>
              <th onClick={() => requestSort("current_average")}>
                Current Avg{sortIndicator("current_average")}
              </th>
              <th onClick={() => requestSort("predicted_grade")}>
                Predicted Grade{sortIndicator("predicted_grade")}
              </th>
              <th onClick={() => requestSort("risk_level")}>
                Risk{sortIndicator("risk_level")}
              </th>
              <th onClick={() => requestSort("severity")}>
                Severity{sortIndicator("severity")}
              </th>
              <th onClick={() => requestSort("group")}>
                Group{sortIndicator("group")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.student_id}>
                <td>{s.student_id}</td>
                <td>{s.name}</td>
                <td>{s.actual_G1}</td>
                <td>{s.actual_G2}</td>
                <td>{s.current_average.toFixed(2)}</td>

                <td>{s.predicted_grade.toFixed(2)}</td>

                <td>{s.risk_level}</td>

                <td style={severityStyle(s.severity)}>
                  {s.severity.toFixed(2)}
                </td>

                <td>{s.group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📘 SEVERITY EXPLANATION */}
      <div className="severity-box">
        <h4>Severity Score – Explanation</h4>

        <p>
          Severity is a <b>simple, explainable academic stress indicator</b>. It
          is <b>not a grade</b> and does not represent marks or percentages.
        </p>

        <div className="severity-formula">
          Severity = (Failures × 2) + (Absences ÷ 5) + (20 − Current Avg) ÷ 2
        </div>

        <ul>
          <li>
            <b>Higher severity</b> → Worse academic situation
          </li>
          <li>
            <b>Lower severity</b> → Student is relatively stable
          </li>
        </ul>

        <p>
          This score uses <b>existing academic data only</b> such as attendance,
          internal assessments, and failure history.
        </p>

        <p style={{ opacity: 0.85 }}>
          Severity has no fixed maximum or minimum and should be interpreted{" "}
          <b>relative to other students in the same dataset</b>.
        </p>
      </div>
    </div>
  );
}

export default StudentSummary;
