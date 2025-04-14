// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['x-auth-token'] = token;
          const userResponse = await authService.getCurrentUser();
          if (userResponse) {
            setUser(userResponse);
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid token');
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['x-auth-token'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const register = async (userData) => {
    try {
      clearMessages();
      setLoading(true);
      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      return await authService.register(userData);
    } catch (err) {
      const errorMessage = err || 'Failed to register. Please try again.';
      setError(errorMessage);
      setSuccessMessage(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      clearMessages();
      setLoading(true);
      await authService.login(email, password);
      const userResponse = await authService.getCurrentUser();
      setUser(userResponse);
      setIsAuthenticated(true);
      return userResponse;
    } catch (err) {
      const errorMessage = err || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    clearMessages();
  };

  const resetMessages = () => {
    clearMessages();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        successMessage,
        isAuthenticated,
        register,
        login,
        logout,
        resetMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);