import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getPCAResults } from "../api";

function PCAChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPCAResults().then((res) => {
      const variance = res.data.explained_variance;

      setData({
        labels: ["PC1", "PC2"],
        datasets: [
          {
            label: "Explained Variance Ratio",
            data: variance,
            backgroundColor: "rgba(255,99,132,0.6)",
          },
        ],
      });
    });
  }, []);

  if (!data) return <p>Loading PCA analytics...</p>;

  return (
    <div className="card">
      <h2>PCA Variance Analysis</h2>
      <Bar data={data} />
    </div>
  );
}

export default PCAChart;
