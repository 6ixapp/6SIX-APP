import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileImageUploadProps {
  profilePhoto?: string | null;
  isLoading: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profilePhoto,
  isLoading,
  onPress,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      style={styles.profileImageContainer}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <View style={styles.uploadContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.uploadText}>Uploading...</Text>
        </View>
      ) : profilePhoto ? (
        <Image
          source={{ uri: profilePhoto }}
          style={styles.profileImage}
        />
      ) : (
        <View style={styles.uploadContainer}>
          <Feather name="upload" size={50} color="#666" />
          <Text style={styles.uploadText}>Upload Profile Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 50,
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  uploadContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'TimesNewRomanRegular',
  },
});

export default ProfileImageUpload; 