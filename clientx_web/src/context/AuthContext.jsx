import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi, ApiService, userApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = ApiService.getToken();
      if (token) {
        try {
          const userData = await userApi.getProfile();
          if (userData) {
            setUser(userData);
          } else {
             ApiService.clearTokens(); 
          }
        } catch (error) {
          ApiService.clearTokens();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const result = await authApi.login(username, password);
    if (result.success) {
      const userData = await userApi.getProfile();
      setUser(userData);
      return { success: true };
    }
    return result;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const register = async (userData) => {
      return await authApi.register(userData);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
