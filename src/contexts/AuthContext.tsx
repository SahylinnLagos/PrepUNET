import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { 
  initializeStorage, 
  getCurrentUser, 
  setCurrentUser, 
  clearCurrentUser, 
  getUserByEmail,
  saveUser
} from '../utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    // Check if user already exists
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    return true;
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    clearCurrentUser();
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};