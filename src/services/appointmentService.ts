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

export interface Appointment {
  _id?: string;
  bloodBankId: string;
  scheduledAt: string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

export const appointmentService = {
  // Create appointment
  createAppointment: async (data: Appointment) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  // Get all appointments
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Get single appointment
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string) => {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  // Reschedule appointment
  rescheduleAppointment: async (id: string, scheduledAt: string) => {
    const response = await api.patch(`/appointments/${id}/reschedule`, { scheduledAt });
    return response.data;
  },
};
