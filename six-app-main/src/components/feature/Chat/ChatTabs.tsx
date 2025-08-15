import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ChatTabsProps = {
  activeTab: 'chat' | 'profile';
  onTabChange: (tab: 'chat' | 'profile') => void;
};

const ChatTabs: React.FC<ChatTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={activeTab === 'chat' ? styles.activeTab : styles.inactiveTab}
        onPress={() => onTabChange('chat')}
      >
        <Text style={activeTab === 'chat' ? styles.activeTabText : styles.inactiveTabText}>
          Chat
        </Text>
        {activeTab === 'chat' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity 
        style={activeTab === 'profile' ? styles.activeTab : styles.inactiveTab}
        onPress={() => onTabChange('profile')}
      >
        <Text style={activeTab === 'profile' ? styles.activeTabText : styles.inactiveTabText}>
          Profile
        </Text>
        {activeTab === 'profile' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  activeTab: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    position: 'relative',
    width: '50%',
  },
  inactiveTab: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '50%',
  },
  activeTabText: {
    color: '#7C3AED',
    fontSize: 16,
    textAlign: 'center'
  },
  inactiveTabText: {
    color: '#D1D5DB',
    fontSize: 16,
    textAlign: 'center'
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#7C3AED',
  },
});

export default ChatTabs;
