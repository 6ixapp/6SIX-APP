import { useAuth } from '@/src/context/AuthContext';
import { Redirect, Stack } from 'expo-router';

export default function RootLayout() {

  const {user} = useAuth();
  if(!user) {
    return <Redirect href='/landing'/>
  }
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name='profile' />
      <Stack.Screen name="request"/>
      <Stack.Screen name="chat/[id]" options={{ title: 'chat' }} />
      <Stack.Screen name="connectionProfile" />  
    </Stack>
  )
}