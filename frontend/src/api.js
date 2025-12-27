import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const trainModels = async () => {
  return axios.post(`${API_BASE}/train`);
};

export const saveStudent = async (data) => {
  return axios.post(`${API_BASE}/save_student`, data);
};

export const predictRisk = async (data) => {
  return axios.post(`${API_BASE}/predict-risk`, data);
};

export const predictGrade = async (data) => {
  return axios.post(`${API_BASE}/predict-grade`, data);
};
