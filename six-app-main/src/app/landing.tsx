import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Landing() {
  return (
    <View style={styles.container}>
       <Image
        source={require('@/src/assets/images/icon.png')}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>unlock your{'\n'}social network</Text>
      <Text style={styles.subtitle}>every connection starts with a mutual</Text>

      <TouchableOpacity style={styles.createButton} onPress={() => router.push({
        pathname: '/phoneAuth',
        params: { authType: 'signUp' },
      })}>
        <Text style={styles.createText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push({
        pathname: '/phoneAuth',
        params: { authType: 'signIn' },
      })}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 40,
  },
  createButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  createText: {
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 25,
  },
  loginText: {
    fontSize: 16,
    color: '#000',
  },
});
