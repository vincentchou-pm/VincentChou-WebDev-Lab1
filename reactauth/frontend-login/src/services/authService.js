import api from "./api";

export const register = async (data) => {
  console.log("📦 Data yang dikirim ke backend:", data); // <--- Tambah ini
  const res = await api.post("register/", data);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post("login/", credentials);
  const { access, refresh } = res.data;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};