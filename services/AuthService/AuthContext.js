'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from './AuthService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('currentUser');
    if (loggedIn && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      
      // Store token and auth state
      localStorage.setItem('isLoggedIn', 'true');
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      const userObj = {
        name: data.user?.name || 'Admin',
        email: data.user?.email || email,
        role: data.user?.type || 'Super Admin',
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      setUser(userObj);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      let backendType = 'admin';
      if (role === 'Super Admin') {
        backendType = 'superadmin';
      } else if (role === 'Matchmaker') {
        backendType = 'admin'; // mapping if needed or keeping as role
      }

      const response = await AuthService.signup({
        name,
        email,
        password,
        type: backendType,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
