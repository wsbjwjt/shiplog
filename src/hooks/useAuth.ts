'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useCallback } from 'react';

interface UseAuthReturn {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: 'github' | 'google') => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (provider: 'github' | 'google') => {
    try {
      setError(null);
      await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    } catch (err) {
      setError('登录失败，请重试');
      console.error('Login error:', err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut({
        callbackUrl: '/login',
        redirect: true,
      });
    } catch (err) {
      setError('登出失败，请重试');
      console.error('Logout error:', err);
    }
  }, []);

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    login,
    logout,
    error,
    clearError,
  };
}
