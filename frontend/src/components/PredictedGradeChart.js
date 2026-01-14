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
              backgroundColor: "#00ffd5"
            }
          ]
        });
      })
      .catch(() => setChartData(null));
  }, [dataVersion]);

  if (!chartData) return null;

  return (
    <div className="section">
      <h2>Predicted Grade Distribution</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default PredictedGradeChart;
