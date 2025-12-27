import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const uploadStudentDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file); 

  return axios.post(`${API_BASE}/upload/student`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const trainModels = async () => {
  return axios.post(`${API_BASE}/train`);
};

export const predictRisk = async (data) => {
  return axios.post(`${API_BASE}/predict-risk`, data);
};

export const predictGrade = async (data) => {
  return axios.post(`${API_BASE}/predict-grade`, data);
};

export const getClusteringResults = () =>
  axios.get(`${API_BASE}/clustering`);

export const getPCAResults = () =>
  axios.get(`${API_BASE}/pca`);

export const getSentimentResults = () =>
  axios.get(`${API_BASE}/sentiment`);
