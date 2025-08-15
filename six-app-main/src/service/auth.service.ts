import axios from 'axios';
import Constants from 'expo-constants';
import { AuthType } from "../constants/types/auth.types";
import { AppConfigExtra } from '../constants/types/env.types';
import { supabase } from "../db/supabase";
import { logger } from './logger.service';

const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra;


interface OTPResponse {
    success: boolean;
    error?: string;
    data?: any;
    isNewUser?: boolean;
}

export const verifyOTP = async (phoneNumber: string, otp: string, authType: AuthType): Promise<OTPResponse> => {
    try {
        const body = {
            phone: phoneNumber,
            otp: otp,
            isSignup: authType === AuthType.SignUp ? true : false
        }
        const response = await axios.post(`${BACKEND_URL}/otp/verify`, body)
        
        if (response.data.success) {
            await supabase.auth.setSession({
                access_token: response.data.session.access_token,
                refresh_token: response.data.session.refresh_token
            })

            return {
                success: true,
                data: response.data.user,
                isNewUser: response.data.isNewUser
            };
        }
        return {
            success: false,
            error: response.data.error
        };
    } catch (error) {
        logger.error('verifyOTP', 'Error verifying OTP:', error as string);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to verify OTP'
        };
    }
};
