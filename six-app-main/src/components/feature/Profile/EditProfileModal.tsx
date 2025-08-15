import { Theme } from '@/src/constants/color';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TraitsInput from './TraitsInput';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, traits: string[]) => Promise<void>;
  initialName: string;
  initialTraits: string[];
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialName,
  initialTraits
}) => {
  const [name, setName] = useState(initialName);
  const [traits, setTraits] = useState(initialTraits);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setTraits(initialTraits);
    }
  }, [visible, initialName, initialTraits]);

  // Also reset when modal is closed to ensure clean state
  useEffect(() => {
    if (!visible) {
      setIsLoading(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (name.trim().length < 3 || !traits.every(trait => trait.trim().length >= 3)) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(name.trim(), traits.map(trait => trait.trim()));
      onClose();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraitsChange = (newTraits: string[]) => {
    setTraits(newTraits);
  };

  const isValid = name.trim().length >= 3 && traits.every(trait => trait.trim().length >= 3);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
            disabled={isLoading}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Profile</Text>
          
          <TouchableOpacity 
            onPress={handleSave}
            style={[styles.saveButton, { opacity: isValid && !isLoading ? 1 : 0.5 }]}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Theme.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Name</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name (min 3 characters)"
              placeholderTextColor="#666"
              maxLength={50}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tell us about yourself</Text>
            <Text style={styles.sectionSubtitle}>Share three interesting things</Text>
            <TraitsInput
              initialTraits={traits}
              onTraitsChange={handleTraitsChange}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#9191ff',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  nameInput: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#9191ff',
    paddingVertical: 12,
    color: '#000',
    marginBottom: 20,
  },
});

export default EditProfileModal;