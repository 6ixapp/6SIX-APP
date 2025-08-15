import HeaderText from '@/src/components/common/HeaderText';
import ChatMessageCard from '@/src/components/feature/Chat/ChatMessageCard';
import ConnectionRequestNotification from '@/src/components/feature/ConnectionRequest/ConnectionRequestNotification';
import FlexiblePostComponent from '@/src/components/feature/Post/PostModal';
import { supabase } from '@/src/db/supabase';
import { removeChatAndConnection, removeConnection } from '@/src/service/chat.service';
import { logger } from '@/src/service/logger.service';
import { fetchUserChats } from '@/src/service/message.services';
import { useChatStore } from '@/src/store/chat.store';
import { usePostModalStore } from '@/src/store/postModalStore';
import { usePostStore } from '@/src/store/postStore';
import { useUserStore } from '@/src/store/userStore';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatsListScreen = () => {
  const { user } = useUserStore();
  const { chats, setChats } = useChatStore();
  const { removeUserPost } = usePostStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { showPostModal } = useLocalSearchParams<{ showPostModal?: string }>();
  const { isChatPostModalVisible, setChatPostModalVisible } = usePostModalStore();
  const supabaseChannel = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (showPostModal)
      setChatPostModalVisible(true);
  }, [showPostModal]);

  useEffect(() => {
    if (user?.id) {
      // setLoading(true);
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    supabaseChannel.current = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new;

          // Check if this chat involves current user
          const { data: chat } = await supabase
            .from('chats')
            .select('*')
            .eq('chat_id', newMessage.chat_id)
            .single();

          if (chat && (chat.user1 === user.id || chat.user2 === user.id)) {
            loadChats();
          }
        }
      )
      .on(
        'broadcast',
        { event: 'chat-update' },
        (payload) => {
          if (payload.payload.type === 'read') {
            loadChats();
          }
        }
      )
      .subscribe();

    return () => {
      if (supabaseChannel.current) {
        supabase.removeChannel(supabaseChannel.current);
      }
    };
  }, [user?.id]);

  // Separate useEffect for handling chat deletion
  useEffect(() => {
    if (!user?.id) return;

    const deleteChannel = supabase
      .channel('chat-deletion')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          const deletedChat = payload.old;
          if (deletedChat && deletedChat.chat_id) {
            const updatedChats = chats.filter(chat => chat.chat_id !== deletedChat.chat_id);
            setChats(updatedChats);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(deleteChannel);
    };
  }, [user?.id, chats]);

  const loadChats = async () => {
    if (!user?.id) return;

    try {
      const response = await fetchUserChats(user.id);

      if (response.success) {
        setChats(response.data);
      } else {
        logger.error('loadChats', 'Failed to load chats:', response.error);
      }
    } catch (error) {
      logger.error('loadChats', 'Error loading chats:', error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (chatUserId: string) => {
    try { 
      if (!user?.id) return;
      await removeConnection(user.id, chatUserId);
      removeUserPost(chatUserId);
    } catch (error) {
      logger.error('handleRemoveConnection', 'Error removing connection:', error as string);
    }
  };

  const handleRemoveChatAndConnection = async (chatId: string, chatUserId: string) => {
    try {
      if (!user?.id) return;
      await removeChatAndConnection(user.id, chatUserId, chatId);
      removeUserPost(chatUserId);
      setChats(chats.filter(chat => chat.chat_id !== chatId));
    } catch (error) {
      logger.error('handleRemoveChat', 'Error removing chat:', error as string);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat =>
    chat.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <HeaderText title="Chats" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <ConnectionRequestNotification />
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isChatPostModalVisible && (
        <FlexiblePostComponent
          isModal={true}
          visible={isChatPostModalVisible}
          onClose={() => setChatPostModalVisible(false)}
        />
      )}

      {/* Messages List */}
      <ScrollView 
        style={styles.messagesContainer} 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9191ff']}
            tintColor="#9191ff"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading chats...</Text>
          </View>
        ) : filteredChats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching chats found' : 'No chats yet'}
            </Text>
          </View>
        ) : (
          filteredChats.map(chat => (
            <ChatMessageCard
              key={chat.chat_id}
              message={{
                id: chat.chat_id,
                sender_id: chat.other_user_id,
                name: chat.other_user_name,
                profile_photos: chat.other_user_profile_photos  || undefined,
                message: chat.last_message,
                timestamp: new Date(chat.last_message_at),
                isOwnMessage: chat.last_message_sender === user?.id,
                keyword_summary: chat.other_user_keyword_summary || [],
                unread_count: chat.unread_count,
                connection_degree: chat.connection_degree,  
                connection_mutuals: chat.mutual_connections
              }}
              onRemoveConnection={handleRemoveConnection}
              onRemoveChat={handleRemoveChatAndConnection}
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
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 42,
    fontFamily: 'TimesNewRomanBold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Regular'
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  tabButtonText: {
    color: '#000',
  },
  tabButtonActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabButtonActiveText: {
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  verificationBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#bc00ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  navButtonIcon: {
    fontSize: 24,
  },
  navButtonActive: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  hexagonContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagon: {
    width: 24,
    height: 24,
    borderRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'TimesNewRomanRegular',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },

});

export default ChatsListScreen;

