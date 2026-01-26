import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { mockApi } from '../mockApi';

interface AuthContextType extends AuthState {
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('udata_token'),
    isAuthenticated: !!localStorage.getItem('udata_token'),
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      if (state.token) {
        try {
          const user = await mockApi.auth.getMe(state.token);
          setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
        } catch (err) {
          localStorage.removeItem('udata_token');
          setState(prev => ({ ...prev, user: null, token: null, isAuthenticated: false, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    initAuth();
  }, [state.token]);

  const login = async (username: string) => {
    const { user, token } = await mockApi.auth.login(username);
    localStorage.setItem('udata_token', token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('udata_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
