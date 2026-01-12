import React, { useEffect, useState } from "react";
import { getRecommendations } from "../api";

function Recommendations() {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    getRecommendations().then((res) => setRecs(res.data));
  }, []);

  return (
    <div className="section">
      <h2>Recommendations</h2>
      <ul>
        {recs.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;
