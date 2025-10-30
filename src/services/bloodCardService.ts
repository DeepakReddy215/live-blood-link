import api from './api';
import { BloodCard, HealthInfo } from '@/types';

export const bloodCardService = {
  // Get user's blood card
  getMyCard: async (): Promise<BloodCard> => {
    const response = await api.get('/blood-cards/me');
    return response.data;
  },

  // Get blood card by ID
  getCard: async (cardId: string): Promise<BloodCard> => {
    const response = await api.get(`/blood-cards/${cardId}`);
    return response.data;
  },

  // Create or issue a new blood card
  createCard: async (data: Partial<BloodCard>): Promise<BloodCard> => {
    const response = await api.post('/blood-cards', data);
    return response.data;
  },

  // Update health information
  updateHealthInfo: async (healthInfo: HealthInfo): Promise<BloodCard> => {
    const response = await api.patch('/blood-cards/me/health', { healthInfo });
    return response.data;
  },

  // Request card revalidation
  requestRevalidation: async (): Promise<{ message: string }> => {
    const response = await api.post('/blood-cards/me/revalidate');
    return response.data;
  },

  // Verify card via QR code
  verifyCard: async (cardNumber: string): Promise<BloodCard> => {
    const response = await api.post('/blood-cards/verify', { cardNumber });
    return response.data;
  },

  // Admin: Approve/Reject card verification
  updateCardStatus: async (
    cardId: string,
    status: 'active' | 'expired' | 'pending' | 'suspended'
  ): Promise<BloodCard> => {
    const response = await api.patch(`/blood-cards/${cardId}/status`, { status });
    return response.data;
  },
};
