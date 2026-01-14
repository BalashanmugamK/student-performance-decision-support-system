import React, { useEffect, useState } from "react";
import { getClassOverview } from "../api";

function ClassOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getClassOverview().then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="section">
      <h2>Class Overview</h2>
      <p>Class Average: {data.grade_stats.class_average}</p>
      <p>Class Std Dev: {data.grade_stats.class_std}</p>
      <p>Total Students: {data.grade_stats.total_students}</p>
    </div>
  );
}

export default ClassOverview;
