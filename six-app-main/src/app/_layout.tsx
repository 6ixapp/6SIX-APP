import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {

  const [loaded, error] = useFonts({
    'TimesNewRomanRegular': require('../assets/fonts/TimesNewRomanRegular.ttf'),
    'TimesNewRomanBold': require('../assets/fonts/TimesNewRomanBold.ttf'),
    'TimesNewRomanBoldItalic': require('../assets/fonts/TimesNewRomanBoldItalic.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(protected)' />
      </Stack>
    </AuthProvider>
  )
}