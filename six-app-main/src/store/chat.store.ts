import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { UserChat } from '../constants/types/message.types';

interface ChatStoreState {
  chats: UserChat[];
  setChats: (chats: UserChat[]) => void;
  updateChat: (chat: UserChat) => void;
  clearChats: () => void;
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set) => ({
      chats: [],
      setChats: (chats) => set({ chats }),
      updateChat: (chat) => set((state) => ({
        chats: state.chats.map((c) => c.chat_id === chat.chat_id ? chat : c),
      })),
      clearChats: () => set({ chats: [] }),
    }),
    {
      name: 'chat-storage', 
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
