import { Contact, Message } from '@/src/constants/types/chat.types';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileImage from '../Profile/ProfileImage';

type MessageItemProps = {
  message: Message;
  contact: Contact;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, contact }) => {
  const formatMessageText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[^\s]+)/g;

    const parts = text.split(urlRegex);

    const handleLinkPress = async (url: string) => {
      await Clipboard.setStringAsync(url);
    };

    return parts.map((part, index) => {
      if (part && urlRegex.test(part)) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleLinkPress(part)}
          >
            <Text style={styles.linkText}>{part}</Text>
          </TouchableOpacity>
        )
      }
      return part ? <Text key={index}>{part}</Text> : null;
    });
  };

  if (message.sender === 'user') {
    return (
      <View style={styles.sentMessageContainer}>
        <View style={styles.sentMessage}>
          <Text style={[styles.messageText, styles.sentMessageText]}>
            {formatMessageText(message.text)}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.receivedMessageContainer}>
        {message.sender === 'contact' ? (
          <>
            <ProfileImage
              imageUrl={message.profile_photos && message.profile_photos.length > 0 ? message.profile_photos[0] : null}
              name={message.sender_name}
              size={40}
              onPress={() => router.push({ pathname: '/connectionProfile', params: { contact: JSON.stringify(contact) } })}
            />
            <View style={styles.receivedMessage}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={require('@/src/assets/images/icon.png')}
              style={styles.avatarPlaceholder}
            />
            <LinearGradient
              colors={['#ff66c4', '#5170ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.receivedMessage}
            >
              <Text style={styles.sixMessageText}>{message.text}</Text>
            </LinearGradient>
          </>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  sentMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  receivedMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#9191ff',
    borderRadius: 18,
    maxWidth: '70%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessage: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    maxWidth: '70%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
  },
  receivedMessageNoAvatar: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    maxWidth: '70%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 50,
  },
  messageText: {
    fontSize: 16,
  },
  sixMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  sentStatus: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  messageProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#ffffff',
  },
});

export default MessageItem;