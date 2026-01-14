import React, { useEffect, useState } from "react";
import { getSentimentResults, getKeywordResults } from "../api";

function FeedbackAnalytics({ dataVersion }) {
  const [sentiment, setSentiment] = useState(null);
  const [keywords, setKeywords] = useState(null);

  useEffect(() => {
    getSentimentResults()
      .then((res) => setSentiment(res.data))
      .catch(() => setSentiment(null));

    getKeywordResults()
      .then((res) => setKeywords(res.data))
      .catch(() => setKeywords(null));
  }, [dataVersion]);

  if (!sentiment && !keywords) {
    return <p>No feedback analytics available.</p>;
  }

  return (
    <div className="section">
      <h2>Feedback Analytics</h2>

      {sentiment && (
        <>
          <h3>Sentiment Summary</h3>
          <ul>
            <li>Positive: {sentiment.Positive}</li>
            <li>Neutral: {sentiment.Neutral}</li>
            <li>Negative: {sentiment.Negative}</li>
          </ul>
        </>
      )}

      {keywords && (
        <>
          <h3>Top Feedback Keywords</h3>
          <ul>
            {keywords.labels.map((k, i) => (
              <li key={i}>
                {k} ({keywords.values[i]})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default FeedbackAnalytics;
