'use client';

import { useState, useCallback } from 'react';
import { ApiService } from '@/lib/services/api-service';

interface UseAuthActionReturn {
  isAuthenticated: boolean;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  executeWithAuth: (action: () => void | Promise<void>) => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

/**
 * Hook để kiểm tra authentication trước khi thực hiện các thao tác CRUD
 * Nếu chưa đăng nhập, sẽ hiển thị dialog đăng nhập
 */
export function useAuthAction(): UseAuthActionReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);

  // Kiểm tra trạng thái authentication
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      // Kiểm tra token có hợp lệ không
      await ApiService.auth.getCurrentUser();
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Thực hiện action với kiểm tra auth
  const executeWithAuth = useCallback(async (action: () => void | Promise<void>): Promise<void> => {
    const isAuth = await checkAuth();
    
    if (!isAuth) {
      // Hiển thị dialog đăng nhập
      setShowAuthDialog(true);
      return;
    }

    // Thực hiện action nếu đã đăng nhập
    try {
      await action();
    } catch (error) {
      console.error('Action execution failed:', error);
      throw error;
    }
  }, [checkAuth]);

  return {
    isAuthenticated,
    showAuthDialog,
    setShowAuthDialog,
    executeWithAuth,
    checkAuth,
  };
}
