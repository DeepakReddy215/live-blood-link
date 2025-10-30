import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BloodBank {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  contactNumber: string;
  email?: string;
  operatingHours?: string;
  inventory: Array<{
    bloodType: string;
    unitsAvailable: number;
    lastUpdated: string;
  }>;
  distance?: number;
}

export const bloodBankService = {
  // Get all blood banks
  getAllBloodBanks: async (filters?: { city?: string; state?: string; bloodType?: string }) => {
    const response = await api.get('/blood-banks', { params: filters });
    return response.data;
  },

  // Search nearby blood banks
  searchNearby: async (latitude: number, longitude: number, radius?: number) => {
    const response = await api.get('/blood-banks/nearby', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },

  // Get single blood bank
  getBloodBankById: async (id: string) => {
    const response = await api.get(`/blood-banks/${id}`);
    return response.data;
  },
};
