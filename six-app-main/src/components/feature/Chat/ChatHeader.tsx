import { Contact } from '@/src/constants/types/chat.types'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ProfileImage from '../Profile/ProfileImage'

type ChatHeaderProp = {
  contact: Contact
  isLoadingConnectionDetails?: boolean
}

const ChatHeader = ({ contact, isLoadingConnectionDetails = false }: ChatHeaderProp) => {
  const router = useRouter();
  // Get the first profile photo or null if array is empty/null
  const profilePhoto = contact.profile_photos && contact.profile_photos.length > 0
    ? contact.profile_photos[0]
    : null;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({ pathname: '/connectionProfile', params: { 
        contact: JSON.stringify(contact)
      } })}>
        <ProfileImage
          imageUrl={profilePhoto}
          name={contact.name}
          size={90}
        />
     </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerName}>{contact.name}</Text>
        {isLoadingConnectionDetails ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#9CA3AF" />
          </View>
        ) : (
          <>
            <Text style={styles.connectionText}>{contact.connectionDegree}</Text>
            <Text style={styles.connectionText}>{contact.mutualCount} mutuals</Text>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerName: {
    fontSize: 24,
    fontFamily: 'TimesNewRomanBold',
  },
  connectionText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
})

export default ChatHeader