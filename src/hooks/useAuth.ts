import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider(): AuthContextType {
  const [users, setUsers] = useLocalStorage<User[]>('networkmaster-users', []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('networkmaster-current-user', null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = users.find(user => user.id === currentUserId) || null;

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate against a backend
    // For demo purposes, we'll check if user exists and use a simple password check
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // Simple password validation (in real app, this would be hashed)
      const storedPassword = localStorage.getItem(`networkmaster-password-${user.id}`);
      if (storedPassword === password) {
        setCurrentUserId(user.id);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      name,
      createdAt: new Date().toISOString(),
      avatar: name.charAt(0).toUpperCase(),
      preferences: {
        theme: 'light',
        notifications: true,
        weeklyGoal: 7
      }
    };
    
    // Store user and password
    setUsers([...users, newUser]);
    localStorage.setItem(`networkmaster-password-${newUser.id}`, password);
    setCurrentUserId(newUser.id);
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };
}

export { AuthContext };