import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import { apiClient } from '@services/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationState {
  expoPushToken: string | null;
  notifications: Notifications.Notification[];
  
  initializeNotifications: () => Promise<void>;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  scheduleEmergencyAlert: (message: any) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  expoPushToken: null,
  notifications: [],

  initializeNotifications: async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push notification permissions');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      set({ expoPushToken: token });

      // Register token with backend
      await apiClient.post('/notifications/register', { token });

      // Add notification listener
      Notifications.addNotificationReceivedListener((notification) => {
        set((state) => ({
          notifications: [...state.notifications, notification],
        }));
      });
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  },

  sendLocalNotification: async (title: string, body: string, data?: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Immediate
    });
  },

  scheduleEmergencyAlert: async (message: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 EMERGENCY ALERT',
        body: `${message.sender.name}: ${message.content}`,
        data: { messageId: message.id, priority: 'emergency' },
        sound: 'emergency.wav',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  },
}));
