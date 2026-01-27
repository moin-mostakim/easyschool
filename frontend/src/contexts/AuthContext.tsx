import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.profile();
      setUser(response.data);
      setLoading(false);
    } catch (error: any) {
      // Only clear auth if it's an authentication error (401)
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setUser(null);
      }
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { accessToken, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('accessToken', accessToken);
      
      // Fetch full profile to ensure we have complete user data
      try {
        const profileResponse = await authAPI.profile();
        setUser(profileResponse.data);
      } catch (profileError) {
        // If profile fetch fails, use the user data from login response
        // This ensures login still works even if profile endpoint has issues
        setUser(userData);
      }
    } catch (error: any) {
      // Clear any existing auth data on login failure
      localStorage.removeItem('accessToken');
      setUser(null);
      throw error; // Re-throw to let Login component handle the error
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
