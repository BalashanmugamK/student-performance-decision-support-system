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
      <p>Average Grade: {stats.class_average}</p>
      <p>Standard Deviation: {stats.class_std}</p>
      <p>Total Students: {stats.total_students}</p>
    </div>
  );
}

export default ClassCards;
