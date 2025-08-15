import { useAuth } from '@/src/context/AuthContext';
import { useContacts } from '@/src/hooks/useContact';
import { logger } from '@/src/service/logger.service';
import { updateProfilePicture, updateUserProfile } from '@/src/service/profile.service';
import { useUserStore } from '@/src/store/userStore';
import * as Burnt from "burnt";
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export const useProfile = () => {
  const { user, logout } = useAuth();
  const { user: userProfile, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  
  // Use contacts hook for contact syncing functionality
  const { 
    contacts, 
    permissionStatus, 
    isLoading: isLoadingContacts, 
    isSyncing, 
    checkAndLoadContacts, 
    syncContacts 
  } = useContacts();

  // Get profile photos array (supporting multiple photos)
  const getProfilePhotos = (): (string | null)[] => {
    if (!userProfile?.profile_photos || userProfile.profile_photos.length === 0) {
      return [null, null, null];
    }
    
    // Return the actual photos array, ensuring we have 3 slots
    const photos = [...userProfile.profile_photos];
    while (photos.length < 3) {
      photos.push('');
    }
    return photos.slice(0, 3); // Ensure we only return 3 photos
  };

  const handleImageUpload = async (base64Image: string, photoIndex: number = 0) => {
    if (!user?.id) {
      return;
    }
    setUploadingPhotoIndex(photoIndex);
    try {
      const result = await updateProfilePicture(user.id, base64Image, photoIndex);

      if (result.success && result.url) {
        if (userProfile) {
          // Get current photos array or create new one
          const currentPhotos = userProfile.profile_photos || [];
          const updatedPhotos = [...currentPhotos];
          
          // Update the specific photo at the given index
          updatedPhotos[photoIndex] = result.url;
          
          setUser({ ...userProfile, profile_photos: updatedPhotos });
        }
        Burnt.toast({
          title: `Profile Photo ${photoIndex + 1} updated`,
          preset: "done",
        });
      } else {
        Burnt.toast({
          title: "Failed to upload profile photo.",
          preset: "error",
        });
      }
    } catch (error) {
      logger.error('handleImageUpload', 'Image upload error:', error as string);
    } finally {
      setUploadingPhotoIndex(null);
    }
  };

  const pickImage = async (photoIndex: number = 0) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
      base64: true
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await handleImageUpload(base64Image, photoIndex);
    }
  };

  const handleEditProfile = async (name: string, traits: string[]) => {
    if (!user?.id) {
      throw new Error('User not found');
    }

    try {
      const userData = {
        id: user.id,
        name: name,
        keyword_summary: traits
      };

      const response = await updateUserProfile(userData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile');
      }

      // Update local user state
      if (userProfile) {
        setUser({
          ...userProfile,
          name: name,
          keyword_summary: traits
        });
      }
    } catch (error) {
      logger.error('handleEditProfile', 'Error updating profile:', error instanceof Error ? error.message : error as string);
      Burnt.toast({
        title: "Failed to update profile",
        preset: "error",
      });
      throw error;
    }
  };

  const handleSyncContacts = async () => {
    console.log('permissionStatus', permissionStatus);
    try {
      // First check permissions and load contacts if needed
      if (permissionStatus !== 'granted' || contacts.length === 0) {
        await checkAndLoadContacts(true);
      } else {
        // If we already have contacts, just sync them
        await syncContacts();
      }
      
      Burnt.toast({
        title: "Contacts synced",
        preset: "done",
      });
    } catch (error) {
      console.log('error', error);
      logger.error('handleSyncContacts', 'Error syncing contacts:', error as string);
      
      // If permission is denied, show a more helpful message
      if (error instanceof Error && error.message.includes('Permission not granted')) {
        Burnt.toast({
          title: "Contacts access denied",
          message: "Please enable contacts access in your device settings",
          preset: "error",
          haptic: "error",
        });
      } else {
        Burnt.toast({
          title: "Failed to sync contacts",
          preset: "error",
        });
      }
    }
  };

  return {
    // State
    userProfile,
    isLoading,
    uploadingPhotoIndex,
    isEditModalVisible,
    permissionStatus,
    isLoadingContacts,
    isSyncing,
    
    // Actions
    pickImage,
    handleEditProfile,
    handleSyncContacts,
    logout,
    setIsEditModalVisible,
    getProfilePhotos,
  };
}; 