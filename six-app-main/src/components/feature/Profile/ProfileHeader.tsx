import { Theme } from '@/src/constants/color';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  onSyncContacts: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  isLoading: boolean;
  isSyncing: boolean;
  isLoadingContacts: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSyncContacts,
  onEditProfile,
  onLogout,
  isLoading,
  isSyncing,
  isLoadingContacts
}) => {
  const isDisabled = isLoading || isSyncing || isLoadingContacts;

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Profile</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSyncContacts}
          disabled={isDisabled}
        >
          {isSyncing || isLoadingContacts ? (
            <ActivityIndicator size="small" color={Theme.secondary} />
          ) : (
            <Ionicons name="refresh-outline" size={22} color={Theme.secondary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onEditProfile}
          disabled={isDisabled}
        >
          <Feather name="edit-2" size={22} color={Theme.secondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onLogout}
          disabled={isDisabled}
        >
          <Ionicons name="log-out-outline" size={22} color={Theme.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 38,
    fontFamily: 'TimesNewRomanBold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default ProfileHeader; 