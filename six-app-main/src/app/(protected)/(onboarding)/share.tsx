import NextButton from '@/src/components/common/NextButton';
import SharingCard from '@/src/components/common/SharingCard';
import { useContacts } from '@/src/hooks/useContact';
import { Ionicons } from '@expo/vector-icons';
import * as Burnt from "burnt";
import * as Linking from 'expo-linking';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const Share = () => {
  const router = useRouter();
  const {
    contacts,
    permissionStatus,
    isLoading,
    isSyncing,
    checkAndLoadContacts,
    syncContacts,
    handleReload,
  } = useContacts();

  const hasCheckedOnFocus = useRef(false);

  useFocusEffect( 
    React.useCallback(() => {
      if (!hasCheckedOnFocus.current) {
        hasCheckedOnFocus.current = true;
        checkAndLoadContacts(true); // Changed to true to enable auto-sync
      }
      
      return () => {
        hasCheckedOnFocus.current = false;
      };
    }, []) 
  );

  const openSettings = async () => {
    await Linking.openSettings();
  };

  const handleSyncContacts = async () => {
    try {
      // If we don't have permission or contacts, check and load first
      if (permissionStatus !== 'granted') {
        await checkAndLoadContacts(true); // Auto-sync after loading
      } else if (contacts.length === 0) {
        await checkAndLoadContacts(true); // Auto-sync after loading
      } else {
        await syncContacts();
      }
      
      Burnt.toast({
        title: "Contacts synced successfully",
        preset: "done",
      });
    } catch (error) {
      Burnt.toast({
        title: "Failed to sync contacts",
        preset: "error",
      });
    }
  };

  const renderLoadingState = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          {isLoading ? 'Loading contacts...' : 'Syncing contacts...'}
        </Text>
      </View>
    );
  };

  const renderGrantedState = () => {
    return (
      <>
        <View style={styles.syncHeader}>
          <Text style={styles.subtitle}>Click to Sync</Text>
          <TouchableOpacity
            style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            onPress={handleSyncContacts}
            disabled={isSyncing || isLoading}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons name="refresh-outline" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
        </View>
        <SharingCard />
      </>
    );
  };

  const renderPermissionDeniedState = () => {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Please enable contacts access in settings
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openSettings}
          >
            <Text style={styles.settingsButtonText}>
              Enable in Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={handleReload}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="reload-outline" size={24} color="#666" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading || isSyncing) {
      return renderLoadingState();
    }

    switch (permissionStatus) {
      case 'checking':
        return <Text style={styles.subtitle}>Checking permissions...</Text>;
      case 'granted':
        return renderGrantedState();
      default:
        return renderPermissionDeniedState();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Almost There</Text>
          {renderContent()}
        </View>
      </View>

      <NextButton
        onPress={() => {
          router.replace('/guide1');
        }}
        disabled={permissionStatus !== 'granted' || isLoading || isSyncing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    marginTop: 60,
    alignItems: 'stretch',
    marginBottom: 30
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'TimesNewRomanRegular',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    textAlignVertical: 'center',
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  syncButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonDisabled: {
    opacity: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  permissionText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 8,
  },
  permissionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 16,
  },
  settingsButton: {
    paddingHorizontal: 16,
  },
  settingsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  reloadButton: {
    padding: 4,
  },
});

export default Share;