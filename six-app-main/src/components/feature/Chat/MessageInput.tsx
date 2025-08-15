import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';

type MessageInputProps = {
  onSend: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: 250,
          useNativeDriver: false
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    onSend(newMessage);
    setNewMessage('');
  };

  return (
    <Animated.View 
      style={[
        styles.inputContainer,
        // This will push the input up when keyboard shows
        { marginBottom: keyboardHeight }
      ]}
    >
      <TextInput
        style={styles.textInput}
        placeholder="Type a message..."
        placeholderTextColor="#A0A0A0"
        multiline
        value={newMessage}
        onChangeText={setNewMessage}
        autoFocus={false}
      />
      <TouchableOpacity 
        style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!newMessage.trim()}
      >
        <Feather name="send" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
    // Make sure it stays on top
    zIndex: 999,
    // Ensure it stays at the bottom of the screen
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});

export default MessageInput;