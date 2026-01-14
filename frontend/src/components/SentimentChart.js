import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getSentimentResults } from "../api";

function SentimentChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSentimentResults().then((res) => {
      const stats = res.data;

      setData({
        labels: ["Min", "Q1", "Median", "Q3", "Max"],
        datasets: [
          {
            label: "Sentiment Score Distribution",
            data: [
              stats.min,
              stats["25%"],
              stats["50%"],
              stats["75%"],
              stats.max,
            ],
            backgroundColor: "rgba(75,192,192,0.6)",
          },
        ],
      });
    });
  }, []);

  if (!data) return <p>Loading sentiment analytics...</p>;

  return (
    <div className="card">
      <h2>Sentiment Analysis</h2>
      <Bar data={data} />
    </div>
  );
}

export default SentimentChart;
