import { decode } from "base64-arraybuffer";
import { UserProfile } from "../constants/types/user.types";
import { supabase } from "../db/supabase";
import { logger } from "./logger.service";

interface ProfileResponse {
  success: boolean;
  data?: UserProfile;
  error?: string;
}

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const fetchUserProfile = async (userId: string): Promise<ProfileResponse> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        profile_photos, 
        keyword_summary
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as UserProfile
    };

  } catch (error) {
    logger.error('fetchUserProfile', 'Error fetching user profile:', error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile'
    };
  }
};


export const updateProfilePicture = async (
  userId: string,
  base64Image: string,
  photoIndex: number = 0
): Promise<UploadResponse> => {
  try {
    // Remove the data:image/jpeg;base64, prefix if present
    const base64Str = base64Image.includes("base64,")
      ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
      : base64Image;
    const res = decode(base64Str);

    if (!(res.byteLength > 0)) {
      return { success: false, error: 'Invalid image data' };
    }

    // Clean up old profile pictures for this specific index
    const { data: filesList } = await supabase
      .storage
      .from('pfp')
      .list(`${userId}`);

    if (filesList && filesList.length > 0) {
      // Delete old photo for this specific index
      const oldPhotoFile = filesList.find(file => file.name.includes(`photo-${photoIndex}`));
      if (oldPhotoFile) {
        await supabase.storage.from('pfp').remove([`${userId}/${oldPhotoFile.name}`]);
      }
    }

    // Upload new profile picture
    const timestamp = Date.now();
    const fileName = `${userId}/photo-${photoIndex}-${timestamp}`;

    const { error: uploadError } = await supabase
      .storage
      .from('pfp')
      .upload(fileName, res, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('pfp')
      .getPublicUrl(fileName);

    const cacheBustedUrl = `${publicUrl}?t=${timestamp}`;

    // Get current profile photos array
    const { data: currentUser } = await supabase
      .from('users')
      .select('profile_photos')
      .eq('id', userId)
      .single();

    const currentPhotos = currentUser?.profile_photos || [];
    const updatedPhotos = [...currentPhotos];
    
    // Update the specific photo at the given index
    updatedPhotos[photoIndex] = cacheBustedUrl;

    // Update user profile with the new photos array
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_photos: updatedPhotos })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, url: cacheBustedUrl };
  } catch (error) {
    logger.error('updateProfilePicture', 'Profile picture update error:', error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile picture'
    };
  }
};

export const updateUserProfile = async (userData: UserProfile): Promise<ProfileResponse> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        keyword_summary: userData.keyword_summary,
      })
      .eq('id', userData.id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as UserProfile
    };
  } catch (error) {
    logger.error('updateUserProfile', 'Error updating user profile:', error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user profile'
    };
  }
}