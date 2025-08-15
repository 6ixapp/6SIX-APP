import { Contact, Message } from '@/src/constants/types/chat.types';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MessageItem from './MessageItem';

type MessageListProps = {
  messages: Message[];
  contact: Contact;
};

const MessageList: React.FC<MessageListProps> = ({ messages, contact }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const prevMessagesLength = useRef<number>(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // On mount, scroll to bottom (initial load)
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
        setTimeout(() => setInitialScrollDone(true), 50); // Show after scroll
      }, 200); // Wait for messages to render
    } else {
      setInitialScrollDone(true);
    }
    prevMessagesLength.current = messages.length;
  }, []);

  // On new message, scroll to bottom (but not on initial load)
  useEffect(() => {
    if (
      messages.length > prevMessagesLength.current // new message added
      && messages.length > 0
    ) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={[
          styles.chatContainer,
          !initialScrollDone && { opacity: 0, height: 1 }, // Hide until scrolled
        ]}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            contact={contact}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up available space
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
    paddingBottom: 20,
  },
});

export default MessageList;