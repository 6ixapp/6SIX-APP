import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  loading = false,
  disabled,
  style,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#9191ff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#d1d1ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default CustomButton;