import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BloodRequest {
  _id?: string;
  bloodType: string;
  unitsNeeded: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  hospital: {
    name: string;
    address: string;
    contactNumber?: string;
  };
  notes?: string;
  status?: string;
  recipientId?: any;
  donorId?: any;
  createdAt?: string;
}

export const requestService = {
  // Create blood request
  createRequest: async (data: BloodRequest) => {
    const response = await api.post('/requests', data);
    return response.data;
  },

  // Get all requests
  getRequests: async (filters?: { status?: string; urgency?: string; bloodType?: string }) => {
    const response = await api.get('/requests', { params: filters });
    return response.data;
  },

  // Get single request
  getRequestById: async (id: string) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  // Accept request (donor)
  acceptRequest: async (id: string) => {
    const response = await api.post(`/requests/${id}/accept`);
    return response.data;
  },

  // Decline request (donor)
  declineRequest: async (id: string) => {
    const response = await api.post(`/requests/${id}/decline`);
    return response.data;
  },

  // Match donors (admin)
  matchDonors: async (id: string) => {
    const response = await api.post(`/requests/${id}/match`);
    return response.data;
  },

  // Escalate to emergency (admin)
  escalateRequest: async (id: string) => {
    const response = await api.post(`/requests/${id}/escalate`);
    return response.data;
  },
};
