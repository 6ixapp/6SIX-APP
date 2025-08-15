import { Theme } from '@/src/constants/color';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface SyncingIndicatorProps {
  isSyncing: boolean;
  isLoadingContacts: boolean;
}

const SyncingIndicator: React.FC<SyncingIndicatorProps> = ({ 
  isSyncing, 
  isLoadingContacts 
}) => {
  if (!isSyncing && !isLoadingContacts) {
    return null;
  }

  return (
    <View style={styles.syncingIndicator}>
      <ActivityIndicator size="small" color={Theme.primary} />
      <Text style={styles.syncingText}>
        {isLoadingContacts ? 'Loading contacts...' : 'Syncing contacts...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  syncingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  syncingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SyncingIndicator; 