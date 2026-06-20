import { useState } from "react";
import { apiFetch } from "../utils/api";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("fs_token") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("fs_email") || "");

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, "");
    localStorage.setItem("fs_token", data.token);
    localStorage.setItem("fs_email", data.email);
    setToken(data.token);
    setUserEmail(data.email);
  };

  const register = async (email, password) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, "");
    localStorage.setItem("fs_token", data.token);
    localStorage.setItem("fs_email", data.email);
    setToken(data.token);
    setUserEmail(data.email);
  };

  const logout = () => {
    localStorage.removeItem("fs_token");
    localStorage.removeItem("fs_email");
    setToken("");
    setUserEmail("");
  };

  return { token, userEmail, login, register, logout };
}
