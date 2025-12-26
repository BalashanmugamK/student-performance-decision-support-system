import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function Charts() {
  // Example: Feature importance (static for demo)
  const [data, setData] = useState({
    labels: ["studytime", "absences", "G1", "G2", "failures"],
    datasets: [
      {
        label: "Feature Importance",
        data: [0.1, 0.05, 0.4, 0.35, 0.1], // Example values
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  });

  return (
    <div>
      <h2>Charts</h2>
      <Bar data={data} />
    </div>
  );
}

export default Charts;
