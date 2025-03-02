import { create } from 'zustand';
import axiosInstance from '@/constants/axiosInstance'; // Import your axios instance

interface History {
  id: string;
  faceshape: string;
  front_image_link: string;
  actionDateTime: string;
}

interface HistoryStore {
  history: History[];
  fetchHistory: (email: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  fetchHistory: async (email: string) => {
    console.log('Fetching history for:', email);

    try {
      const response = await axiosInstance.get(`/user-history`, {
        params: { email }, // Axios query parameter handling
      });

      console.log('Response status:', response.status);
      if (response.status === 200) {
        console.log('Fetched History Data:', response.data);
        set({ history: response.data });
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  },
}));
