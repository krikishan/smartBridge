import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopez_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shopez_token');
    if (token) {
      authAPI.getProfile()
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('shopez_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('shopez_token');
          localStorage.removeItem('shopez_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: userData, token } = res.data;
    setUser(userData);
    localStorage.setItem('shopez_token', token);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authAPI.register(data);
    const { user: userData, token } = res.data;
    setUser(userData);
    localStorage.setItem('shopez_token', token);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (e) { /* ignore */ }
    setUser(null);
    localStorage.removeItem('shopez_token');
    localStorage.removeItem('shopez_user');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
