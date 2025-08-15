import ProfileImageCarousel from '@/src/components/feature/Profile/ProfileImageCarousel';
import { Contact } from '@/src/constants/types/chat.types';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConnectionProfile = () => {
  const { contact } = useLocalSearchParams();
  const connectionDetails = JSON.parse(contact as string) as Contact;
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);


  // Parse profile_photos if it's a string
  let parsedProfilePhotos: string[] = [];
  const profilePhotosData = connectionDetails.profile_photos;
  
  if (typeof profilePhotosData === 'string') {
    try {
      // First try to parse as JSON
      const jsonParsed = JSON.parse(profilePhotosData);
      if (Array.isArray(jsonParsed)) {
        parsedProfilePhotos = jsonParsed;
      } else {
        // If it's not an array, split by comma
        parsedProfilePhotos = (profilePhotosData as string).split(',').map((url: string) => url.trim());
      }
    } catch (error) {
      ('Failed to parse profile_photos as JSON, splitting by comma');
      // Split by comma if JSON parsing fails
      parsedProfilePhotos = (profilePhotosData as string).split(',').map((url: string) => url.trim());
    }
  } else if (Array.isArray(profilePhotosData)) {
    parsedProfilePhotos = profilePhotosData;
  }

  // Ensure keyword_summary is an array of strings
  let keywords: string[] = [];
  if (Array.isArray(connectionDetails.keyword_summary)) {
    keywords = connectionDetails.keyword_summary as string[];
  } else if (typeof connectionDetails.keyword_summary === 'string') {
    keywords = (connectionDetails.keyword_summary as string)
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean);
  }

  // Check if there are any profile photos
  const hasProfilePhotos = parsedProfilePhotos && 
    parsedProfilePhotos.length > 0 && 
    parsedProfilePhotos.some(photo => photo && photo.trim() !== '');


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {hasProfilePhotos ? (
          <ProfileImageCarousel
            profilePhotos={parsedProfilePhotos}
            isLoading={isLoading}
            uploadingPhotoIndex={uploadingPhotoIndex}
            onImagePress={() => {}}
            disabled={true} 
            showUploadPlaceholders={false} 
          />
        ) : (
          <View style={styles.profileTextContainer}>
            <Text style={[styles.initials, { fontSize: 350 * 0.4 }]}>
              {connectionDetails.name.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{connectionDetails.name}</Text>
        <Text style={styles.degree}>Degree: {connectionDetails.connectionDegree}</Text>
        <Text style={styles.mutual}>{connectionDetails.mutualCount} mutual connections</Text>
        <Text style={styles.keywords}>
          {keywords.join(' | ')}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 28,
    fontFamily: 'TimesNewRomanBoldItalic',
    marginTop: 24,
  },
  degree: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 2,
  },
  mutual: {   
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  keywords: {
      fontSize: 20,
        fontWeight: '400',
    textAlign: 'center',
  },
  profileImageContainer: {
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  profileTextContainer: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    backgroundColor: '#9191ff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: "100%",
    height: "100%",
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  profileImageText: {
    fontSize: 60,
    fontFamily: 'TimesNewRomanBoldItalic',
    color: '#666',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontFamily: 'TimesNewRomanBold',
  },
}); 

export default ConnectionProfile