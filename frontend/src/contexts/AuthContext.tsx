'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from '@/lib/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  telephoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  telephoneNumber: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentToken = getAuthToken();
      
      if (!currentToken) {
        throw new Error('No token found');
      }

      const response = await api.get('/auth/me');
      setUser(response.data.data);
      setToken(currentToken);
    } catch (error) {
      console.error('Authentication check failed', error);
      setUser(null);
      setToken(null);
      removeAuthToken();
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }
      
      const { token: newToken } = response.data;
      setAuthToken(newToken);
      setToken(newToken);
      
      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data.data;
      setUser(userData);
      
      router.push(userData?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setUser(null);
      setToken(null);
      removeAuthToken();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }
      
      const { token } = response.data;
      setToken(token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      
      await checkAuth();
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUser(null);
      setToken(null);
      removeAuthToken();
      setIsLoading(false);
      router.push('/auth/login');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;