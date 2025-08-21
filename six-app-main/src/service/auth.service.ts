import axios, { isAxiosError } from "axios";
import Constants from "expo-constants";
import { AuthType } from "../constants/types/auth.types";
import { AppConfigExtra } from "../constants/types/env.types";
import { supabase } from "../db/supabase";
import { logger } from "./logger.service";

const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra;

interface OTPVerifyResponse {
  success: boolean;
  error?: string;
  data?: any;
  isNewUser?: boolean;
}

interface OTPRequestResponse {
  success: boolean;
  error?: string;
  data?: any;
  needsConversationInit?: boolean;
}

export const verifyOTP = async (
  phoneNumber: string,
  otp: string,
  authType: AuthType
): Promise<OTPVerifyResponse> => {
  try {
    const body = {
      phone: phoneNumber,
      otp: otp,
      isSignup: authType === AuthType.SignUp ? true : false,
    };

    const response = await axios.post(`${BACKEND_URL}/otp/verify`, body);

    if (response.data.success) {
      await supabase.auth.setSession({
        access_token: response.data.session.access_token,
        refresh_token: response.data.session.refresh_token,
      });

      logger.info("verifyOTP", `OTP verified for ${phoneNumber}`);

      return {
        success: true,
        data: response.data.user,
        isNewUser: response.data.isNewUser,
      };
    }
    return {
      success: false,
      error: response.data.error,
    };
  } catch (error) {
    logger.error("verifyOTP", "Error verifying OTP:", error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify OTP",
    };
  }
};

export const requestOTP = async (
  phoneNumber: string
): Promise<OTPRequestResponse> => {
  const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra;

  try {
    const response = await axios.post(`${BACKEND_URL}/otp/request`, {
      phone: phoneNumber,
    });

    if (response.data.success) {
      logger.info("requestOTP", `OTP sent for ${phoneNumber}`);

      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.data.error || "Failed to send OTP",
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      const backendError =
        error.response.data.error || error.response.data.message;

      // "no active conversations" case
      const needsConversationInit =
        backendError && backendError.includes("no active conversations");

      logger.error("requestOTP", "Backend error:", backendError);

      return {
        success: false,
        error: backendError || "Failed to request OTP",
        needsConversationInit,
      };
    }

    logger.error("requestOTP", "Error requesting OTP:", error as string);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to request OTP",
    };
  }
};
