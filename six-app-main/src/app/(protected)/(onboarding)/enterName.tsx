import NextButton from '@/src/components/common/NextButton';
import { createUserNode } from '@/src/service/neo4j.service';
import { useUserOnboardingStore } from '@/src/store/userOnboardingStore';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const EnterName = () => {
  const router = useRouter();
  const setName = useUserOnboardingStore(state => state.setName);
  const {user} = useUserStore();
  const [inputName, setInputName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = async() => {
    Keyboard.dismiss();
    setName(inputName.trim());
    if(user && user.id && user.phone) {
      await createUserNode(user?.id, inputName, user?.phone);
    }
    router.replace('/traits');
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>What's your name?</Text>
        <TextInput
          style={styles.input}
          value={inputName}
          onChangeText={setInputName}
          placeholder="Enter your name"
          placeholderTextColor="#666"
          autoFocus
          maxLength={30}
        />
      </Animated.View>

        <NextButton 
          onPress={handleNext}
          disabled={!inputName.trim()}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20, 
  },
  contentContainer: {
    marginTop: 60,
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#9191ff',
    paddingVertical: 8,
    color: '#000',
  }
});

export default EnterName;