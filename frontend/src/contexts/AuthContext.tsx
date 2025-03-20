'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      setToken(storedToken);
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Authentication check failed', error);
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
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
      
      const { token } = response.data;
      setToken(token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      
      // Fetch user data
      const userResponse = await api.get('/auth/me');
      if (!userResponse.data || !userResponse.data.data) {
        throw new Error('Failed to retrieve user data');
      }
      
      const userData = userResponse.data.data;
      setUser(userData);
      
      // Redirect based on user role
      if (userData?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Login failed', error);
      // Clear any partial auth state on error
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setIsLoading(false);
      router.push('/auth/login');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider; 