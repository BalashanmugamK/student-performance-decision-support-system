import React, { useEffect, useState } from "react";
import { getRiskOverview } from "../api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function RiskChart({ dataVersion }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getRiskOverview()
      .then((res) => {
        setChartData({
          labels: ["High Risk", "Medium Risk", "Low Risk"],
          datasets: [
            {
              label: "Number of Students",
              data: [
                res.data["High Risk"],
                res.data["Medium Risk"],
                res.data["Low Risk"],
              ],
              backgroundColor: ["red", "orange", "green"],
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
      <h2>Risk Distribution</h2>
      <div style={{ height: 260 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default RiskChart;
