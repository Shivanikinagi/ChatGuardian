import { create } from 'zustand';
import { apiClient } from '@services/api';

interface DayStat {
  date: string;
  count: number;
  emergency: number;
  important: number;
  informational: number;
  noise: number;
}

interface AnalyticsState {
  weeklyStats: DayStat[];
  messageDistribution: {
    emergency: number;
    important: number;
    informational: number;
    noise: number;
    blocked: number;
  };
  topSenders: Array<{
    name: string;
    count: number;
  }>;
  timeSaved: number; // in minutes
  accuracy: {
    emergencyDetection: number;
    importantMessages: number;
    fakeNewsDetection: number;
    autoResponseQuality: number;
  };
  loading: boolean;
  
  fetchAnalytics: (period: 'week' | 'month' | 'year') => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  weeklyStats: [],
  messageDistribution: {
    emergency: 0,
    important: 0,
    informational: 0,
    noise: 0,
    blocked: 0,
  },
  topSenders: [],
  timeSaved: 0,
  accuracy: {
    emergencyDetection: 98,
    importantMessages: 94,
    fakeNewsDetection: 91,
    autoResponseQuality: 87,
  },
  loading: false,

  fetchAnalytics: async (period: 'week' | 'month' | 'year' = 'week') => {
    try {
      set({ loading: true });
      const response = await apiClient.get(`/analytics?period=${period}`);
      set({
        weeklyStats: response.data.dailyStats,
        messageDistribution: response.data.distribution,
        topSenders: response.data.topSenders,
        timeSaved: response.data.timeSaved,
        accuracy: response.data.accuracy,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      set({ loading: false });
    }
  },
}));
