import { useEffect } from 'react';
import { socketService } from '@/services/socketService';
import { useAuthStore } from '@/store/authStore';

export const useSocket = () => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect();

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return socketService;
};
