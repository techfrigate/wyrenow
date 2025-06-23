import { useState, useEffect } from 'react';
import { authManager, AuthState } from '../utils/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(() => {
      setAuthState(authManager.getState());
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const success = await authManager.login(email, password);
      return success;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authManager.logout();
  };

  return {
    ...authState,
    loading,
    login,
    logout
  };
}