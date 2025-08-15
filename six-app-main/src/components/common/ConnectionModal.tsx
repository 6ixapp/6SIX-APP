import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface ConnectionModalProps {
  visible: boolean;
  onClose: () => void;
  handleRemoveConnection: () => void;
  handleRemoveChat: () => void;
  userName: string;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  visible,
  onClose,
  handleRemoveConnection,
  handleRemoveChat,
  userName
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    { scale: scaleAnim },
                    { 
                      translateY: Animated.multiply(
                        Animated.subtract(1, scaleAnim), 
                        -10
                      ) 
                    }
                  ],
                  opacity: scaleAnim,
                }
              ]}
            >
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <Text style={styles.userName}>{userName}</Text>
                  <Text style={styles.headerSubtext}>Connection Options</Text>
                </View>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    handleRemoveConnection();
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="person-remove-outline" size={18} color="#EF4444" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionText}>Remove Connection</Text>
                    <Text style={styles.subText}>You will not be able to access this user's network</Text>
                  </View>
                  
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    handleRemoveChat();
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="chatbox-ellipses-outline" size={18} color="#EF4444" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionText}>Remove Chat</Text>
                    <Text style={styles.subText}>You will no longer be able to message this user or stay connected.</Text>
                  </View>
                  
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    minWidth: 280,
    maxWidth: 320,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  modalContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  optionText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  subText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
    letterSpacing: -0.2,
    marginTop: 2,
  },
});

export default ConnectionModal;