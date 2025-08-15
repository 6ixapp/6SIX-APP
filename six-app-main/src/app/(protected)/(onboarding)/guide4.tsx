import { useAuth } from '@/src/context/AuthContext';
import { logger } from '@/src/service/logger.service';
import { useUserStore } from '@/src/store/userStore';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Guide2 = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { user } = useUserStore();
  const navigation = useNavigation();

  const handleNext = async () => {
    if (user) {
       login({
        id: user.id,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: '(protected)' as never   }],
      });
      router.dismissAll();
      router.replace('/');
    } else {
      logger.error('Guide2: handleNext', 'No user data found at end of onboarding');
    }
  };


  return (
    <TouchableOpacity
          style={styles.container} 
          activeOpacity={0.8}
          onPress={handleNext} >
      <View style={styles.content}>
        <Text style={styles.title}>
          Tap "Interested"
        </Text>
        <View style={styles.degreesContainer}>
          <Text style={styles.degreeItem}>
            If you are both interested, both names unlock and a chat opens.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    marginTop: 60,
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 34,
  },
  degreesContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  degreeItem: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  degreeHighlight: {
    color: '#9191ff',
    fontWeight: '600',
  }
});

export default Guide2;