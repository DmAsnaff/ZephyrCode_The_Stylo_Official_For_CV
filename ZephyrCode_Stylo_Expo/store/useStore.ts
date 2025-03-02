// import create from 'zustand';
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';


type Gender = 'male' | 'female' | null;


interface AuthState {
  token: string | null;
  email: string;
  userName: string;
  
  frontImage: string | null;
  sideImage: string | null;
  gender: Gender;
  ageRange: string | null;
  dressCode: string | null;
  hairLength: string | null;
  recommendations: any;
  isLoading: boolean;
  setGender: (gender: Gender) => void;
  setImages: (front: string | null, side: string | null) => void;
  setPreferences: (ageRange: string, dressCode: string, hairLength: string) => void;
  setRecommendations: (data: any) => void;
  setLoading: (loading: boolean) => void;

  login: (token: string, email: string, userName: string) => void;
  logout: () => void;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: '', // Initialize email as an empty string
  userName: '', // Initialize userName as an empty string
 
  frontImage: null,
  sideImage: null,
  gender: null,
  ageRange: null,
  dressCode: null,
  hairLength: null,
  recommendations: null,
  isLoading: false,
  setGender: (gender) => set({ gender }),
  setImages: (front, side) => set({ frontImage: front, sideImage: side }),
  setPreferences: (ageRange, dressCode, hairLength) => set({ ageRange, dressCode, hairLength }),
  setRecommendations: (data) => set({ recommendations: data }),
  setLoading: (loading) => set({ isLoading: loading }),

  login: async (token: string, email: string, userName: string) => {
    await SecureStore.setItemAsync('userToken', token);
    set({ token, email, userName }); // Set token, email, and userName
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    set({ token: null, email: '', userName: '' }); // Reset token, email, and userName
  },
  restoreToken: async () => {
    const token = await SecureStore.getItemAsync('userToken');
    set({ token });
  },
}));




// Define the store interface
interface Store {
  frontImage: string | null;
  setFrontImage: (imageUri: string) => void;
}

// Create the Zustand store
export const usefrontImage = create<Store>((set) => ({
  frontImage: null,
  setFrontImage: (imageUri: string) => set({ frontImage: imageUri }),
}));