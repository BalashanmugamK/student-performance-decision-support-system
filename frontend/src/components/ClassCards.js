import React, { useEffect, useState } from "react";
import { getClassOverview } from "../api";

function ClassCards({ dataVersion }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getClassOverview()
      .then((res) => setStats(res.data.grade_stats))
      .catch(() => setStats(null));
  }, [dataVersion]);

  if (!stats) return null;

  return (
    <div className="section">
      <h2>Class Performance Summary</h2>

      <p><strong>Grade Scale:</strong> 0 – 20</p>

      <p><strong>Average Grade:</strong> {stats.class_average}</p>
      <p><strong>Standard Deviation:</strong> {stats.class_std}</p>

      <p><strong>Lowest Observed Grade:</strong> {stats.min_grade}</p>
      <p><strong>Highest Observed Grade:</strong> {stats.max_grade}</p>

      <p><strong>Total Students:</strong> {stats.total_students}</p>
    </div>
  );
}

export default ClassCards;
