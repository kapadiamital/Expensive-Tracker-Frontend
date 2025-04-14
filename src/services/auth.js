// src/services/authService.js
import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.errors?.[0]?.msg || 'Login failed';
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.errors?.[0]?.msg || 'Registration failed';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
};