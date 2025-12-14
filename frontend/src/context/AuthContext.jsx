import { createContext, useState, useEffect } from "react";
import api from "../services/api";

console.log("=== AUTH CONTEXT LOADED ===");
console.log("API Base URL:", api.defaults.baseURL);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/api/login/", { username, password });
    const { access, refresh, user } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (username, email, password) => {
    const response = await api.post("/api/register/", { username, email, password });
    const { access, refresh, user } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  // ADD THIS FUNCTION - Google Login
  const googleLogin = async (credential) => {
    const response = await api.post("/api/google-login/", { token: credential });
    const { access, refresh, user } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ADD googleLogin TO THE PROVIDER VALUE
  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};