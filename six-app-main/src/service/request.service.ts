import axios from "axios";
import Constants from "expo-constants";
import { AppConfigExtra } from "../constants/types/env.types";
import { supabase } from "../db/supabase";
import { logger } from "./logger.service";

const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra;

interface RequestUser {
  keyword_summary: string[]
}
interface RequestPost {
  id: string;
  content: string;
}

export interface ConnectionRequest {
  id: string;
  reactor_id: string;
  post_owner_id: string;
  posts: RequestPost;
  user: RequestUser
  degree: number
  mutuals: number,
  intro: string
}


export const fetchPostRequests = async (userId: string, userName: string): Promise<any> => {
  try {
    const result = await axios.get(`${BACKEND_URL}/users/connection-requests/${userId}/${userName}`)
    return {
      success: result.data.success,
      data: result.data.data,
    };

  } catch (error) {
    logger.error('fetchPostRequests', 'Error fetching post requests:', error as string);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch requests'
    };
  }
};


interface ReactionResponse {
  success: boolean;
  error?: string;
}

export const reactToPost = async (
  postId: string,
  post_owner_id: string,
  reactor_id: string,
): Promise<ReactionResponse> => {
  try {
    
    const { error } = await supabase
      .from("post_reactions")
      .upsert(
        {
          post_id: postId,
          post_owner_id: post_owner_id,
          reactor_id: reactor_id,
          interest: true
        },
        {
          onConflict: 'post_id,reactor_id'
        }
      );

    if (error) throw error;

    return {
      success: true
    };
  } catch (error) {
    logger.error('reactToPost', 'Error reacting to post:', error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to react to post'
    };
  }
};

interface DeleteReactionResponse {
  success: boolean;
  error?: string;
}

export const deleteReaction = async (reactionId: string): Promise<DeleteReactionResponse> => {
  try {
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('id', reactionId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error('deleteReaction', 'Error deleting reaction:', error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete reaction'
    };
  }
};


