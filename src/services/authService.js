import axios from "../utils/axiosInstance";

const API_URL = "http://localhost:8000/api"; // sesuaikan dengan backend kamu

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/token/`, { email, password });
  return response.data; // berisi access & refresh token
};

export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/user/profile/`);
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post(`${API_URL}/token/refresh/`, {
    refresh: refreshToken,
  });
  return response.data;
};
