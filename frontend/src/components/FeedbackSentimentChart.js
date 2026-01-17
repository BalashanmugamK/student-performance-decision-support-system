import React, { useEffect, useState } from "react";
import { getSentimentResults } from "../api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function FeedbackSentimentChart({ dataVersion }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSentimentResults()
      .then((res) => {
        setData({
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              label: "Feedback Count",
              data: [res.data.Positive, res.data.Neutral, res.data.Negative],
              backgroundColor: ["green", "gray", "red"],
            },
          ],
        });
      })
      .catch(() => setData(null));
  }, [dataVersion]);

  if (!data) return null;

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
      <h2>Feedback Sentiment</h2>
      <div style={{ height: 260 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default FeedbackSentimentChart;
