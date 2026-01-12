import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getClusteringResults } from "../api";

function ClusterChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getClusteringResults().then((res) => {
      const clusters = res.data;
      const labels = Object.keys(clusters);
      const avgG1 = labels.map((k) => clusters[k].G1);

      setData({
        labels: labels.map((c) => `Cluster ${c}`),
        datasets: [
          {
            label: "Average G1 Score",
            data: avgG1,
            backgroundColor: "rgba(54,162,235,0.6)",
          },
        ],
      });
    });
  }, []);

  if (!data) return <p>Loading clustering analytics...</p>;

  return (
    <div className="card">
      <h2>Clustering Analysis</h2>
      <Bar data={data} />
    </div>
  );
}

export default ClusterChart;
