import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const MAX_CHARS = 30; // Maximum characters per trait

interface TraitsInputProps {
  initialTraits?: string[];
  onTraitsChange: (traits: string[]) => void;
  placeholders?: string[];
}

const TraitsInput: React.FC<TraitsInputProps> = ({ 
  initialTraits = ['', '', ''], 
  onTraitsChange,
  placeholders = ['Uni / Work (NYU\'24 econ)', 'Interests', 'One more please']
}) => {
  const [traits, setTraits] = useState(initialTraits);
  const fadeAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Stagger animation for each input
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    onTraitsChange(traits);
  }, [traits, onTraitsChange]);

  const handleTraitChange = (text: string, index: number) => {
    // Restrict input length
    if (text.length <= MAX_CHARS) {
      const newTraits = [...traits];
      newTraits[index] = text;
      setTraits(newTraits);
    }
  };

  return (
    <View style={styles.inputsContainer}>
      {fadeAnims.map((fadeAnim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.inputContainer,
            { opacity: fadeAnim }
          ]}
        >
          <TextInput
            style={styles.input}
            value={traits[index]}
            onChangeText={(text) => handleTraitChange(text, index)}
            placeholder={placeholders[index]}
            placeholderTextColor="#666"
            maxLength={MAX_CHARS}
          />
          <Text style={[
            styles.charCount,
            { color: traits[index].trim().length >= 3 ? '#666' : '#ff6b6b' }
          ]}>
            {traits[index].length}/{MAX_CHARS}
            {traits[index].trim().length < 3 && traits[index].length > 0 && ' (min 3)'}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#9191ff',
    paddingVertical: 12,
    paddingRight: 45, // Make space for character count
    color: '#000',
  },
  charCount: {
    position: 'absolute',
    right: 0,
    bottom: 15,
    fontSize: 12,
    color: '#666',
  },
});

export default TraitsInput;