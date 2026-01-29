// src/contexts/AuthContext.tsx
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { apiService } from '../api/api';
import { TOKEN_KEY } from '../api/axios';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  const [state, setState] = useState<AuthState>({
    user: null,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: true,
  });

  useEffect(() => {
    // only run init if there's a token in localStorage
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // apiService.auth.getMe() uses axios instance that reads token from localStorage
        const user = await apiService.auth.getMe();
        setState(prev => ({ ...prev, user, token, isAuthenticated: true, isLoading: false }));
      } catch (err) {
        // invalid/expired token: clear it
        localStorage.removeItem(TOKEN_KEY);
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };

    initAuth();
    // run only once on mount
  }, []);

  const login = async (username: string, password: string) => {
    // call login endpoint
    const res = await apiService.auth.login(username, password);

    // backend may return different shapes; handle common ones:
    // 1) { access_token: "...", token_type: "bearer" }
    // 2) { token: "..." }
    // 3) { token: "...", user: {...} }
    // 4) sometimes the token is the direct string
    let accessToken: string | null = null;

    if (res?.access_token) accessToken = res.access_token;
    else if (res?.token) accessToken = res.token;
    else if (typeof res === "string") accessToken = res;
    else if (res?.data && typeof res.data === "string") accessToken = res.data; // defensive

    if (!accessToken) {
      throw new Error("Login response did not include an access token");
    }

    // persist token BEFORE calling getMe so interceptor attaches it
    localStorage.setItem(TOKEN_KEY, accessToken);

    try {
      const user = await apiService.auth.getMe();
      setState({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err) {
      // if profile fetch fails, clear token and rethrow
      localStorage.removeItem(TOKEN_KEY);
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
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
