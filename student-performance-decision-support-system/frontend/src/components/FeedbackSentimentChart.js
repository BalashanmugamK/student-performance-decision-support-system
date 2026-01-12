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
              data: [
                res.data.Positive,
                res.data.Neutral,
                res.data.Negative
              ],
              backgroundColor: ["green", "gray", "red"]
            }
          ]
        });
      })
      .catch(() => setData(null));
  }, [dataVersion]);

  if (!data) return null;

  return (
    <div className="section">
      <h2>Feedback Sentiment</h2>
      <Bar data={data} />
    </div>
  );
}

export default FeedbackSentimentChart;
