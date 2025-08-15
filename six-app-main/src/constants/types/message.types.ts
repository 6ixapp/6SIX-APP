export interface UserChat {
    chat_id: string;
    last_message: string;
    last_message_at: string;
    last_message_sender: string;
    other_user_id: string;
    other_user_name: string;
    other_user_profile_photos: string[] | null;
    other_user_keyword_summary: string[] | null;
    unread_count: number;
    connection_degree: number;
    mutual_connections: number;
}

export interface ChatResponse {
    success: boolean;
    data: UserChat[];
    error?: string;
}