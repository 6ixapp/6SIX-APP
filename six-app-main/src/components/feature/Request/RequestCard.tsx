import { createChatRequest } from '@/src/service/chat.service';
import { logger } from '@/src/service/logger.service';
import { deleteReaction } from '@/src/service/request.service';
import { useConnectionRequestStore } from '@/src/store/connectionRequest';
import { useUserStore } from '@/src/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface RequestCardProps {
  request: {
    id: string;
    degree: number;
    mutuals: number;
    reactor_id: string;
    posts: {
      id: string;
      content: string;
    };
    intro: string 
  };
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { requests, setRequests } = useConnectionRequestStore();
  const { user } = useUserStore();

  const handleAccept = async () => {
    setLoading(true);
    try {
      if (user) {
        const response = await createChatRequest(user.id, request.reactor_id, request.posts.id, request.id);
        if (response.success) {
          setRequests(requests.filter(r => r.id !== request.id));
          router.navigate('/(protected)/(tabs)/chats');
        }
      }
    } catch (error) {
      logger.error('handleAcceptRequest', 'Error accepting request:', error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      const response = await deleteReaction(request.id);
      if (response.success) {
        setRequests(requests.filter(r => r.id !== request.id));
        router.navigate('/(protected)/(tabs)/chats');
      }
    } catch (error) {
      logger.error('handleDeclineRequest', 'Error declining request:', error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.requestCard}>
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>
          {request.intro}
        </Text>
        <Text style={styles.postContent} numberOfLines={2}>
          Post: {request.posts?.content || 'No content available'}
        </Text>
      </View>
      
      {!loading ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDecline}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator 
          style={styles.loadingIndicator}
          color="#666"
          size="small"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    marginVertical: 6,
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  
  messageBubble: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  
  messageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 24,
  },
  
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  acceptButton: {
    backgroundColor: '#9191ff',
  },
  
  declineButton: {
    backgroundColor: '#f5f5f5',
  },
  
  loadingIndicator: {
    marginTop: 8,
    alignSelf: 'flex-end',
  }
});

export default RequestCard;