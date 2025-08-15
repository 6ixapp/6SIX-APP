import axios from "axios";
import Constants from 'expo-constants';
import { AppConfigExtra } from '../constants/types/env.types';
import { logger } from "./logger.service";

const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra;

export const fetchPostSuggestion = async (keyword_summary: string[]): Promise<any> => {
  try {
    const { data } = await axios.post(`${BACKEND_URL}/sixai/suggestion`, {
        keyword_summary
    })
    return {
      success: true,
      data: data.data,
    };

  } catch (error) {
    logger.error('fetchPostSuggestion', 'Error fetching post suggestion:', error as string);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch suggestion'
    };
  }
};