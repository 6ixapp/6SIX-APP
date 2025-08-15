import HeaderText from '@/src/components/common/HeaderText';
import RequestCard from '@/src/components/feature/Request/RequestCard';
import { useConnectionRequestStore } from '@/src/store/connectionRequest';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RequestScreen = () => {
  const router = useRouter();
  const { requests } = useConnectionRequestStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#666" />
        </TouchableOpacity>
        <HeaderText title="Six" />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        ) : (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
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
    paddingTop: 12,
  },
  
  scrollContent: {
    paddingBottom: 32,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default RequestScreen;