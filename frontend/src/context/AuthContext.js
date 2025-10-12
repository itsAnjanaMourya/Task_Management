import { createContext, useState, useEffect } from "react";
import * as api from "../api/mockApi";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = api.getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { user } = await api.login(credentials);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const register = async ({ name, email, password }) => {
    await api.register(name, email, password);
  };

  return (
    <AuthContext.Provider value={{ login, logout, register, isAuthenticated, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
