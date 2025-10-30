import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Notification } from '@/types';
import { toast } from 'sonner';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;

    if (!token || !user) {
      console.error('Cannot connect socket: No auth token or user');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      const user = useAuthStore.getState().user;
      if (user) {
        this.socket?.emit('join', { userId: user.id, role: user.role });
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to real-time updates');
      }
    });

    // Notification events
    this.socket.on('notification', (notification: Notification) => {
      useNotificationStore.getState().addNotification(notification);
      
      // Show toast based on priority
      switch (notification.priority) {
        case 'urgent':
          toast.error(notification.title, {
            description: notification.message,
            duration: 10000,
          });
          break;
        case 'high':
          toast.warning(notification.title, {
            description: notification.message,
            duration: 7000,
          });
          break;
        default:
          toast.info(notification.title, {
            description: notification.message,
          });
      }
    });

    // Blood request events
    this.socket.on('blood-request:new', (data) => {
      console.log('New blood request:', data);
      toast.info('New Blood Request', {
        description: `${data.bloodType} needed urgently`,
      });
    });

    this.socket.on('blood-request:matched', (data) => {
      console.log('Blood request matched:', data);
      toast.success('Match Found!', {
        description: 'A donor has been matched to your request',
      });
    });

    // Delivery events
    this.socket.on('delivery:status-update', (data) => {
      console.log('Delivery status update:', data);
      toast.info('Delivery Update', {
        description: `Status: ${data.status}`,
      });
    });

    this.socket.on('delivery:location-update', (data) => {
      console.log('Delivery location update:', data);
    });

    // Appointment events
    this.socket.on('appointment:reminder', (data) => {
      console.log('Appointment reminder:', data);
      toast.info('Appointment Reminder', {
        description: `You have an appointment soon at ${data.time}`,
      });
    });
  }

  // Emit events
  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  }

  // Join a specific room
  joinRoom(room: string) {
    this.emit('join-room', { room });
  }

  // Leave a specific room
  leaveRoom(room: string) {
    this.emit('leave-room', { room });
  }

  // Update location (for delivery personnel and donors)
  updateLocation(location: { latitude: number; longitude: number }) {
    this.emit('location:update', location);
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
