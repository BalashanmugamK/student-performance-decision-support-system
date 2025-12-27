import React from "react";

function ModelSelector() {
  return (
    <div className="section">
      <h2>Model Selection</h2>
      <select>
        <option>Random Forest</option>
        <option>Logistic Regression</option>
        <option>Decision Tree</option>
      </select>
    </div>
  );
}

export default ModelSelector;
