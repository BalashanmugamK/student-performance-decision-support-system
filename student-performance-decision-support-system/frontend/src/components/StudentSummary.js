import React, { useEffect, useState } from "react";
import { getStudentSummary } from "../api";

function StudentSummary({ dataVersion }) {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");

  // sortConfig = [{ key, direction }]
  const [sortConfig, setSortConfig] = useState([]);

  useEffect(() => {
    getStudentSummary()
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  }, [dataVersion]);

  if (!students.length) {
    return <p>No student data available.</p>;
  }

  // 🔹 SEARCH FILTER
  let filtered = students.filter((s) =>
    Object.values(s)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // 🔹 MULTI-COLUMN SORT
  if (sortConfig.length > 0) {
    filtered = [...filtered].sort((a, b) => {
      for (let { key, direction } of sortConfig) {
        let aVal = a[key];
        let bVal = b[key];

        // numeric sort
        if (!isNaN(aVal) && !isNaN(bVal)) {
          if (aVal !== bVal) {
            return direction === "asc" ? aVal - bVal : bVal - aVal;
          }
        } else {
          // string sort
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();

          if (aVal < bVal) return direction === "asc" ? -1 : 1;
          if (aVal > bVal) return direction === "asc" ? 1 : -1;
        }
        // if equal → move to next sort key
      }
      return 0;
    });
  }

  const requestSort = (key) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);

      // toggle direction if already exists
      if (existing) {
        return prev.map((s) =>
          s.key === key
            ? { ...s, direction: s.direction === "asc" ? "desc" : "asc" }
            : s
        );
      }

      // add as next priority
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

  return (
    <div className="section">
      <h2>Student Summary</h2>

      <input
        placeholder="Search by name, id, risk, grade, group..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <button onClick={clearSort} style={{ marginBottom: "10px" }}>
        Clear Sorting
      </button>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th onClick={() => requestSort("student_id")}>
              ID{sortIndicator("student_id")}
            </th>
            <th onClick={() => requestSort("name")}>
              Name{sortIndicator("name")}
            </th>
            <th onClick={() => requestSort("risk_level")}>
              Risk{sortIndicator("risk_level")}
            </th>
            <th onClick={() => requestSort("predicted_grade")}>
              Predicted Grade{sortIndicator("predicted_grade")}
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
              <td>{s.risk_level}</td>
              <td>{s.predicted_grade}</td>
              <td>{s.group}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        Click multiple headers to sort by multiple attributes (Excel-style).
      </p>
    </div>
  );
}

export default StudentSummary;
