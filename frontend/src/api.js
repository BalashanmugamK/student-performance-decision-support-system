import axios from "axios";

const API_BASE = "http://localhost:8000";

// =======================
// UPLOAD
// =======================
export const uploadStudentDataset = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${API_BASE}/upload/student`, fd);
};

export const uploadFeedbackDataset = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${API_BASE}/upload/feedback`, fd);
};

// =======================
// RESET
// =======================
export const resetSystem = () =>
  axios.post(`${API_BASE}/reset`);

// =======================
// STUDENT & CLASS INSIGHTS
// =======================
export const getStudentSummary = () =>
  axios.get(`${API_BASE}/students/summary`);

export const getRiskOverview = () =>
  axios.get(`${API_BASE}/students/risk-overview`);

export const getClassOverview = () =>
  axios.get(`${API_BASE}/analytics/class-overview`);

export const getRecommendations = () =>
  axios.get(`${API_BASE}/recommendations`);

// =======================
// FEEDBACK ANALYTICS
// =======================
export const getSentimentResults = () =>
  axios.get(`${API_BASE}/feedback/sentiment`);

export const getKeywordResults = () =>
  axios.get(`${API_BASE}/feedback/keywords`);
