import { createContext, useState, useEffect } from "react";
import { login as loginUser, refreshAccessToken } from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);

    // decode JWT payload
    const payload = JSON.parse(atob(data.access.split(".")[1]));
    setUser({
      email: payload.email,
      username: payload.username,
      role: payload.role,
      full_name: payload.full_name,
      major: payload.major,
    });
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
