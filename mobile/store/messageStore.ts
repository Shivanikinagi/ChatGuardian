import { create } from 'zustand';
import { apiClient } from '@services/api';

export interface Message {
  id: string;
  groupId: string;
  groupName: string;
  sender: {
    id: string;
    name: string;
    phoneNumber: string;
    relationship?: string;
  };
  content: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio' | 'document';
  mediaUrl?: string;
  timestamp: Date;
  priority: 'emergency' | 'important' | 'informational' | 'noise' | 'blocked';
  isRead: boolean;
  aiClassification: {
    confidence: number;
    categories: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    isFakeNews: boolean;
    needsResponse: boolean;
  };
  autoResponse?: string;
}

interface MessageState {
  messages: Message[];
  emergencyMessages: Message[];
  importantMessages: Message[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  fetchMessages: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  updatePriority: (messageId: string, priority: Message['priority']) => Promise<void>;
  sendFeedback: (messageId: string, feedback: 'correct' | 'incorrect') => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  emergencyMessages: [],
  importantMessages: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchMessages: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.get('/messages');
      const messages = response.data;
      
      set({
        messages,
        emergencyMessages: messages.filter((m: Message) => m.priority === 'emergency'),
        importantMessages: messages.filter((m: Message) => m.priority === 'important'),
        unreadCount: messages.filter((m: Message) => !m.isRead).length,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  markAsRead: async (messageId: string) => {
    try {
      await apiClient.post(`/messages/${messageId}/read`);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, isRead: true } : m
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error: any) {
      console.error('Failed to mark message as read:', error);
    }
  },

  updatePriority: async (messageId: string, priority: Message['priority']) => {
    try {
      await apiClient.post(`/messages/${messageId}/priority`, { priority });
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, priority } : m
        ),
      }));
    } catch (error: any) {
      console.error('Failed to update priority:', error);
    }
  },

  sendFeedback: async (messageId: string, feedback: 'correct' | 'incorrect') => {
    try {
      await apiClient.post(`/messages/${messageId}/feedback`, { feedback });
    } catch (error: any) {
      console.error('Failed to send feedback:', error);
    }
  },
}));
