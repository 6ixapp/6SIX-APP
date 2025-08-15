import { ConnectionLevel, Post } from '@/src/constants/types/post.types.';
import { useAuth } from '@/src/context/AuthContext';
import { logger } from '@/src/service/logger.service';
import { reactToPost } from '@/src/service/request.service';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

type props = {
  post: Post;
};

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return postDate.toLocaleDateString();
};

const PostCard = ({ post }: props) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [isReplied, setIsReplied] = useState(false);

  const handleShowDetailsToggle = () => {
    setShowDetails(s => !s);
  };

  const handleInterestedClick = async () => {
    if (user) {
      const response = await reactToPost(post.id, post.user_id, user.id);
      if (!response.success) {
        logger.error('handleInterestedClick', 'Failed to react:', response.error);
      }
      setIsReplied(true);
    }
  };

  const connectionText =
    post.connection_degree == ConnectionLevel.First
      ? '1st connection'
      : post.connection_degree == ConnectionLevel.Second
        ? '2nd connection'
        : post.connection_degree == ConnectionLevel.Third
          ? '3rd connection' : 'your post'

  return (
    <TouchableWithoutFeedback onPress={handleShowDetailsToggle}>
      <View key={post.id} style={styles.postCard}>
        {post.image_url && (
          <Image source={{ uri: post.image_url }} style={styles.postImage} />
        )}
        <View style={styles.postHeader}>
          {
            post.connection_degree == ConnectionLevel.First && !post.has_chat ? (
              <View style={styles.subPostHeader}>
                <Text style={styles.postConnectionText}>{post.user_name}</Text>
              </View>
            )
            :
            <View style={styles.subPostHeader}>
            <Text style={styles.postConnectionText}>{connectionText}</Text>
            {
              post.mutual_count > 0 && (
              <View style={styles.mutualContainer}>
                <Text style={{ fontSize: 18, color: '#888', marginHorizontal: 3, fontWeight: '500', textAlign: 'center' }}>{'\u2022'}</Text>
                <Text style={styles.postConnectionText}>
                  mutuals {post.mutual_count}
                </Text>
              </View>
              )
            }
          </View>
          }
          <Text style={styles.postTimeText}>{getTimeAgo(post.created_at)}</Text>
        </View>

        {post.content && <Text style={styles.postTitle}>{post.content}</Text>}
        {/* {post.category !== CategoryTabs.General && */}

        <View style={styles.postActions}>
          <View style={styles.meetButton}>
            <Text style={styles.meetButtonText}>{post.category}</Text>
          </View>
        </View>

        {showDetails && user && post.user_id != user.id && (
          <View>
            {post.user_interested ? (
              <TouchableOpacity
                style={[styles.interestedButton, styles.interestedButtonLocked]}
                disabled={true}
              >
                <Text style={styles.interestedButtonText}>Interested</Text>
              </TouchableOpacity>
            ) : !isReplied ? (
              <View>
                {post.keyword_summary &&
                  <View style={styles.keywordContainer}>
                    {post.keyword_summary.map((info, index) => (
                      <Text key={index} style={styles.postDescription}>
                        {info}
                        {index < post.keyword_summary.length - 1 && " • "}
                      </Text>
                    ))}
                  </View>
                }
                <TouchableOpacity
                  style={styles.interestedButton}
                  onPress={handleInterestedClick}
                >
                  <Text style={styles.interestedButtonText}>Interested</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.repliedContaniner}>
                <Text style={styles.repliedText}>Replied</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subPostHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  mutualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postConnectionText: { 
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  postTimeText: {
    color: '#888',
    fontSize: 12,
  },
  categoryPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#444',
    textTransform: 'capitalize',
  },
  postTitle: {
    fontSize: 26,
    fontWeight: '300',
    marginBottom: 2,
    // fontFamily: 'TimesNewRomanRegular',
  },
  userNameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  postDescription: {
    color: '#555',
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  },
  interestedButton: {
    backgroundColor: '#9191ff',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  interestedButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  repliedContaniner: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  repliedText: {
    backgroundColor: '#d0f2fc',
    color: '#35c3f0',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  meetButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  meetButtonText: {
    fontSize: 14,
    color: '#333',
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    alignItems: 'center',
  },
  interestedButtonPending: {
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  interestedButtonTextPending: {
    color: '#999',
    fontSize: 14,
    fontWeight: '400',
  },
  lockIcon: {
    marginLeft: 4,
  },
  interestedButtonLocked: {
    backgroundColor: '#b3b3ff',
    opacity: 0.8,
  },
});

export default PostCard;
