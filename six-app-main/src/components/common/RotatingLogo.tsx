import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

const RotatingLogo: React.FC = () => {
  const rotation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start()
  }, [rotation])

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@/src/assets/images/icon.png')}
        style={[styles.logo, { transform: [{ rotate: rotateInterpolate }] }]}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
})

export default RotatingLogo
