import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export interface RequestType {
  id: string;
  users: {
    id: string;
    name: string;
    profile_photo: string;
  };
  posts: {
    id: string;
    content: string;
  };
  created_at: string;
}

interface RequestMessageCardProps {
  request: RequestType;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

const RequestMessageCard: React.FC<RequestMessageCardProps> = ({
  request,
  onAccept,
  onReject,
}) => {
  const router = useRouter();

  return (
    <View style={styles.requestCard}>
      <Image
        source={{
          uri: request.users.profile_photo || 'https://via.placeholder.com/60',
        }}
        style={styles.avatar}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{request.users.name}</Text>
          <Text style={styles.timeText}>
            {getTimeAgo(new Date(request.created_at))}
          </Text>
        </View>
        <Text style={styles.messageText} numberOfLines={2}>
          Interested in your post: {request.posts.content}
        </Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onAccept(request.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onReject(request.id)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
});

export default RequestMessageCard;

