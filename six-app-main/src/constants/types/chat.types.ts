export type MessageType = {
  id: string;
  name: string;
  profile_photo: string;
  message: string;
  timestamp: Date;
  isOwnMessage?: boolean;
};

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact' | 'sixai';
  timestamp: Date;  
  sender_name?: string;
  profile_photos?: string[] | null;
}

export interface Contact {
  id: string;
  name: string;
  profile_photos: string[] | null;
  sender_id: string;
  connectionDegree: string
  mutualCount: number,
  keyword_summary: string[]
}
