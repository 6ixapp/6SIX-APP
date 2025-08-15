import { create } from 'zustand';

type PostModalState = {
  isHomePostModalVisible: boolean;
  setHomePostModalVisible: (visible: boolean) => void;

  isChatPostModalVisible: boolean;
  setChatPostModalVisible: (visible: boolean) => void;
};

export const usePostModalStore = create<PostModalState>((set) => ({
  isHomePostModalVisible: false,
  setHomePostModalVisible: (visible) => set({ isHomePostModalVisible: visible }),

  isChatPostModalVisible: false,
  setChatPostModalVisible: (visible) => set({ isChatPostModalVisible: visible }),
}));
