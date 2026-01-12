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
                res.data["Low Risk"]
              ],
              backgroundColor: ["red", "orange", "green"]
            }
          ]
        });
      })
      .catch(() => setChartData(null));
  }, [dataVersion]);

  if (!chartData) return null;

  return (
    <div className="section">
      <h2>Risk Distribution</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default RiskChart;
