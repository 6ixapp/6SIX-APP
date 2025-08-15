import { ChatResponse, UserChat } from "../constants/types/message.types";
import { supabase } from "../db/supabase";
import { logger } from "./logger.service";

interface MessageResponse {
    success: boolean;
    error?: string;
}

interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

interface MessagesResponse {
    success: boolean;
    data: Message[];
    error?: string;
}

export const sendMessage = async (
    currentUserId: string,
    chatId: string,
    content: string
): Promise<MessageResponse> => {
    try {
        const { error: messageError } = await supabase
            .from('messages')
            .insert([
                {
                    chat_id: chatId,
                    sender_id: currentUserId,
                    content,
                    read_by: [currentUserId]
                },
            ]);

        if (messageError) {
            throw new Error(`Failed to send message: ${messageError.message}`);
        }

        return { success: true };
    } catch (error) {
        logger.error('sendMessage', 'Error sending message:', error as string);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send message'
        };
    }
};

export const fetchUserChats = async (userId: string): Promise<ChatResponse> => {
    try {
        const { data, error } = await supabase
            .rpc('get_latest_chats_with_photos_and_connections', { p_user_id: userId });

        if (error) {
            throw new Error(`Failed to fetch chats: ${error.message}`);
        }
        return {
            success: true,
            data: data as UserChat[]
        };

    } catch (error) {
        logger.error('fetchUserChats', 'Error fetching user chats:', error as string);
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch user chats'
        };
    }
};

export const fetchChatMessages = async (chatId: string): Promise<MessagesResponse> => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at');

        if (error) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }

        return {
            success: true,
            data: data as Message[],
            error: undefined
        };

    } catch (error) {
        logger.error('fetchChatMessages', 'Error fetching chat messages:', error as string);
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch messages'
        };
    }
};


export const markMessagesAsRead = async (chatId: string, userId: string): Promise<MessageResponse> => {
    try {
        const { data, error } = await supabase.rpc("mark_messages_as_read_text", {
            chat: chatId,
            uid: userId,
        });
        if (error) {
            logger.error("markMessagesAsRead", "❌ Failed to mark messages as read:", error.message);
        }

        return {
            success: true,
            error: undefined
        };

    } catch (err) {
        logger.error("markMessagesAsRead", "🔥 Unexpected error in markMessagesAsRead:", err as string);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to mark messages as read'
        };
    }
};


