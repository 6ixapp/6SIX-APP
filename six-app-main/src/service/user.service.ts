import { supabase } from '../db/supabase';
import { logger } from './logger.service';

type CreateUserParams = {
  id: string;
  phone: string;
};

type UpdateUserProfileParams = {
  id: string;
  name: string;
  keyword_summary: string[];
};

export const checkUserExists = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    logger.error(
      'checkUserExists',
      'Exception checking user existence:',
      (error as Error).message || JSON.stringify(error)
    );
    return false;
  }
};


export const createUser = async ({ id, phone }: CreateUserParams) => {
  try {
    // Step 1: Check if user already exists
    const exists = await checkUserExists(id);
    
    if (exists) {
      return {
        success: true,
        exists: true,
        data: null
      };
    }

    // Step 2: Insert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, phone }])
      .select()
      .single();

    if (error) {
      logger.error('createUser', 'Error creating user:', error.message || error.details || JSON.stringify(error));
      return {
        success: false,
        exists: false,
        error: error.message || 'Error inserting user'
      };
    }

    // Step 3: Return success
    return {
      success: true,
      exists: false,
      data
    };
  } catch (error) {
    logger.error(
      'createUser',
      'Exception creating user:',
      error instanceof Error ? error.message : JSON.stringify(error) 
    );
    return {
      success: false,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};


export const updateUserProfile = async ({
  id,
  name,
  keyword_summary,
}: UpdateUserProfileParams) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        keyword_summary,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('updateUserProfile', 'Error updating user profile:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger.error('updateUserProfile', 'Exception updating user profile:', error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user profile',
    };
  }
};