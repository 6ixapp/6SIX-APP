import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import 'react-native-url-polyfill/auto'
import { AppConfigExtra } from '../constants/types/env.types'

const { SUPABASE_URL, SUPABASE_ANON_KEY, APP_ENV, BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
