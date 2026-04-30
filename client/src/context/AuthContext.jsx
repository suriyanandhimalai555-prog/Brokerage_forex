import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      toast.success("Logged out successfully 👋");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingAuth,
        loadUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);