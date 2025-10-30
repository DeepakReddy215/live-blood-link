import api from './api';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  OTPVerification,
} from '@/types';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  // Register
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  // Verify OTP
  verifyOTP: async (otpData: OTPVerification): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/verify-otp', otpData);
    return data;
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  // Reset password
  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/reset-password', {
      token,
      password,
    });
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
