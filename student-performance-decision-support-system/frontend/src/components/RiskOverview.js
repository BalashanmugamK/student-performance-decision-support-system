import React, { useEffect, useState } from "react";
import { getRiskOverview } from "../api";

function RiskOverview() {
  const [risk, setRisk] = useState({});

  useEffect(() => {
    getRiskOverview().then((res) => setRisk(res.data));
  }, []);

  return (
    <div className="section">
      <h2>Risk Overview</h2>
      <p style={{ color: "red" }}>High Risk: {risk["High Risk"]}</p>
      <p style={{ color: "orange" }}>Medium Risk: {risk["Medium Risk"]}</p>
      <p style={{ color: "green" }}>Low Risk: {risk["Low Risk"]}</p>
    </div>
  );
}

export default RiskOverview;
