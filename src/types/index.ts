// User Types
export type UserRole = 'donor' | 'recipient' | 'delivery' | 'admin';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  bloodType?: BloodType;
  location?: Location;
  avatar?: string;
  isVerified: boolean;
  dateOfBirth?: string;
  gender?: Gender;
  aadharNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonorProfile extends User {
  role: 'donor';
  lastDonationDate?: string;
  eligibilityDate?: string;
  totalDonations: number;
  badges: Badge[];
  isAvailable: boolean;
}

export interface RecipientProfile extends User {
  role: 'recipient';
  medicalRecords?: string[];
  activeRequests: number;
}

export interface DeliveryPersonnel extends User {
  role: 'delivery';
  vehicleType?: string;
  licenseNumber?: string;
  activeDeliveries: number;
  totalDeliveries: number;
  rating: number;
}

export interface AdminProfile extends User {
  role: 'admin';
  permissions: string[];
}

// Blood Types
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Location
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  zipCode?: string;
  pincode?: string;
}

// Blood Request
export type RequestStatus = 'pending' | 'matched' | 'in-transit' | 'completed' | 'cancelled';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface BloodRequest {
  id: string;
  recipientId: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  hospital: string;
  location: Location;
  message?: string;
  matchedDonorId?: string;
  deliveryPersonnelId?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}

// Appointment
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  donorId: string;
  bloodBankId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Blood Bank
export interface BloodBank {
  id: string;
  name: string;
  location: Location;
  phoneNumber: string;
  email: string;
  operatingHours: {
    open: string;
    close: string;
  };
  inventory: BloodInventory[];
  capacity: number;
  availableSlots: number;
}

export interface BloodInventory {
  bloodType: BloodType;
  unitsAvailable: number;
  lastUpdated: string;
}

// Delivery
export type DeliveryStatus = 'assigned' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';

export interface Delivery {
  id: string;
  requestId: string;
  deliveryPersonnelId: string;
  status: DeliveryStatus;
  pickupLocation: Location;
  deliveryLocation: Location;
  currentLocation?: Location;
  estimatedArrival?: string;
  actualArrival?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification
export type NotificationType = 'match' | 'appointment' | 'delivery' | 'system' | 'alert';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Analytics
export interface DonationStats {
  totalDonations: number;
  totalDonors: number;
  totalRecipients: number;
  activeRequests: number;
  completedDeliveries: number;
  bloodTypeDistribution: Record<BloodType, number>;
  urgencyBreakdown: Record<UrgencyLevel, number>;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'donation' | 'request' | 'delivery' | 'appointment';
  description: string;
  userId: string;
  timestamp: string;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  bloodType?: BloodType;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

// Blood Card
export type CardStatus = 'active' | 'expired' | 'pending' | 'suspended';

export interface HealthInfo {
  hemoglobinLevel?: number;
  weight?: number;
  bloodPressure?: string;
  medicalConditions?: string[];
  allergies?: string[];
  medications?: string[];
  lastCheckupDate?: string;
}

export interface BloodCard {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
  cardNumber: string;
  bloodType: BloodType;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  aadharNumber?: string;
  healthInfo?: HealthInfo;
  lastDonationDate?: string;
  status: CardStatus;
  issueDate: string;
  expiryDate: string;
  qrCode: string;
  digitalSignature: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}
