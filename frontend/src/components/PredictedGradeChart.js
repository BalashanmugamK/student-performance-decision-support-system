import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

const API_BASE = "http://localhost:8000";

function PredictedGradeChart({ dataVersion }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/analytics/predicted-grade-distribution`)
      .then((res) => {
        setChartData({
          labels: Object.keys(res.data),
          datasets: [
            {
              label: "Number of Students",
              data: Object.values(res.data),
              backgroundColor: "#00ffd5",
            },
          ],
        });
      })
      .catch(() => setChartData(null));
  }, [dataVersion]);

  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div
      className="section"
      style={{ minHeight: 320, maxWidth: 600, margin: "0 auto" }}
    >
      <h2>Predicted Grade Distribution</h2>
      <div style={{ height: 260 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PredictedGradeChart;
