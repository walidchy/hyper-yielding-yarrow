
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/utils/api';
import { UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  gender?: 'M' | 'F';
  phone?: string;
  cin?: string;
  date_naissance?: string;
  certification?: string;
  address?: string;
  join_year?: number;
  profile_picture?: string;
  status: 'active' | 'inactive' | 'banned';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  pendingModalOpen: boolean;
  setPendingModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<User | null>;
  isAuthenticated: boolean; 
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  gender?: 'M' | 'F';
  phone?: string;
  cin?: string;
  date_naissance?: string;
  certification?: string;
  address?: string;
  join_year?: number;
  profile_picture?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  pendingModalOpen: false,
  setPendingModalOpen: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => null,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);
export type { UserRole };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Compute isAuthenticated based on user being set
  const isAuthenticated = !!user;
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      api.get('/user')
        .then(response => {
          setUser(response.data);
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", { email });
      setLoading(true);
      const response = await api.post('/login', { email, password });
      console.log("Login response:", response.data);
      
      // Check if the response has the expected structure
      if (!response.data || !response.data.data) {
        console.error("Unexpected response structure:", response.data);
        throw new Error(t('validation.credentialsError'));
      }
      
      const { user: userData, access_token } = response.data.data;
      
      if (!userData || !access_token) {
        console.error("Missing user data or token in response");
        throw new Error(t('validation.credentialsError'));
      }

      if (userData.status !== "active") {
        setPendingModalOpen(true);
        setLoading(false);
        return;
      }
      
      setUser(userData);
      setToken(access_token);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 0);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        console.error("Error response:", error.response.data);
        // Check if there's a specific error message from the server
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      // Generic error message as fallback
      throw new Error(t('validation.credentialsError'));
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await api.post('/register', userData);
      const { user: newUser } = response.data.data;
      
      // Don't set user or token automatically
      // Don't store token in localStorage
      
      // Show pending account modal instead
      setPendingModalOpen(true);
      
      // Navigate to login page instead of dashboard
      navigate('/login');
      toast.success(t('accountPending.description'));
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.data?.message || t('general.validationError'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      toast.success(t('navigation.logout'));
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<User | null> => {
    try {
      if (!user?.id) return null;
      
      const response = await api.put(`/users/${user.id}`, userData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success(t('profile.updateSuccess'));
      return updatedUser;
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.response?.data?.message || t('profile.updateError'));
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    pendingModalOpen,
    setPendingModalOpen,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
