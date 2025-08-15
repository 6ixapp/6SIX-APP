import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Guide3 = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/guide4');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={handleNext}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          Scroll anonymous posts from your extended network
        </Text>
        <View style={styles.degreesContainer}>
          <Text style={styles.degreeItem}>
            "Lunch at Liverpool St?"
          </Text>
          <Text style={styles.degreeItem}>
            "CS study buddy @ NYU?"
          </Text>
          <Text style={styles.degreeItem}>
            "Subletting my flat!"
          </Text>
          <Text style={styles.degreeItem}>
            "Looking for a +1 for a gala tn!"
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

export default Guide3;