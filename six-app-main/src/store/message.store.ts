import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Message } from '../constants/types/chat.types';

interface MessageStoreState {
  messagesByChat: { [chatId: string]: Message[] };
  setMessages: (chatId: string, messages: Message[]) => void;
  appendMessage: (chatId: string, message: Message) => void;
  clearMessages: (chatId: string) => void;
}

export const useMessageStore = create<MessageStoreState>()(
  persist(
    (set, get) => ({
      messagesByChat: {},
      setMessages: (chatId, messages) =>
        set((state) => ({
          messagesByChat: { ...state.messagesByChat, [chatId]: messages },
        })),
      appendMessage: (chatId, message) =>
        set((state) => ({
          messagesByChat: {
            ...state.messagesByChat,
            [chatId]: [...(state.messagesByChat[chatId] || []), message],
          },
        })),
      clearMessages: (chatId) =>
        set((state) => {
          const newMessages = { ...state.messagesByChat };
          delete newMessages[chatId];
          return { messagesByChat: newMessages };
        }),
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => AsyncStorage)    
    }
  )
);