import axios from 'axios';
import Constants from 'expo-constants';
import { ApiResponse } from '../constants/types/api.types';
import { AppConfigExtra } from '../constants/types/env.types';
import { PaginatedPostsResponse, PostInput } from '../constants/types/post.types.';
import { supabase } from '../db/supabase';
import { logger } from './logger.service';

const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra;

export const fetchPostsByDegree = async (
  userId: string,
  degreeFilter: number = 0,
  page: number = 1,
  limit: number = 20

): Promise<ApiResponse<PaginatedPostsResponse> | null> => {

  try {
    const response = await axios.get(`${BACKEND_URL}/users/posts/${userId}`, {
      params: {
        degreeFilter,
        page,
        limit
      }
    })

    if (response.data.success) {
      return response.data
    }
    return null;

  } catch (error) {
    logger.error('fetchPostsByDegree', 'Error fetching posts:', error as string);
    return {
      success: false,
      error: (error as Error).message || 'Failed to fetch posts'
    };
  }
};

export const createPost = async (input: PostInput) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([{
        user_id: input.user_id,
        content: input.content,
        category: input.category,
        hide_from_chat: input.hide_from_chat ?? false,
        connection_type: input.connectiontype,
        image_url: input.image_url
      }])
      .select()
      .single();

    console.log('data', data);  
    if (error) throw error;

    return {
      success: true,
      data: data
    }
  } catch (err) {
    await logger.error('createPost', 'Error creating post:', err as string);
    return {
      success: false,
      error: (err as Error).message || 'Failed to create post'
    };
  }
};


