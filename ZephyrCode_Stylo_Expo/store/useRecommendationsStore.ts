import create from 'zustand';

interface RecommendationData {
  faceShape: string;
  recommendations: { imageLink: string; how_to_achieve: string }[];
}

type Store = {
  recommendationsData: RecommendationData | null;
  setRecommendationsData: (data: RecommendationData) => void;
};

export const useRecommendationsStore = create<Store>((set) => ({
  recommendationsData: null,
  setRecommendationsData: (data) => set({ recommendationsData: data }),
}));
