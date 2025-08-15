import { create } from 'zustand';

type UserOnboardingState = {
  name: string;
  traits: string[];
  setName: (name: string) => void;
  setTraits: (traits: string[]) => void;
};

export const useUserOnboardingStore = create<UserOnboardingState>((set) => ({
  name: '',
  traits: [],
  setName: (name) => set({ name }),
  setTraits: (traits) => set({ traits }),
}));
