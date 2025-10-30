import { BloodType } from '@/types';

// API and Socket configuration for Render deployment
// In production (Render), these will be set via environment variables
// In development, fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_TYPE_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

export const URGENCY_COLORS = {
  low: 'hsl(var(--info))',
  medium: 'hsl(var(--warning))',
  high: 'hsl(var(--primary))',
  critical: 'hsl(var(--destructive))',
};

export const STATUS_COLORS = {
  pending: 'hsl(var(--warning))',
  matched: 'hsl(var(--info))',
  'in-transit': 'hsl(var(--primary))',
  completed: 'hsl(var(--success))',
  cancelled: 'hsl(var(--muted-foreground))',
  assigned: 'hsl(var(--info))',
  'picked-up': 'hsl(var(--primary))',
  delivered: 'hsl(var(--success))',
  failed: 'hsl(var(--destructive))',
};

export const ROLE_ROUTES = {
  donor: '/donor/dashboard',
  recipient: '/recipient/dashboard',
  delivery: '/delivery/dashboard',
  admin: '/admin/dashboard',
};

export const MAP_CONFIG = {
  defaultCenter: [40.7128, -74.0060] as [number, number],
  defaultZoom: 13,
  maxZoom: 18,
  minZoom: 3,
};
