import axios from 'axios';
import Constants from 'expo-constants';
import { AppConfigExtra } from '../constants/types/env.types';
import { logger } from './logger.service';

const { BACKEND_URL } = Constants.expoConfig?.extra as AppConfigExtra || 'https://1a6f-103-185-242-190.ngrok-free.app/api'

export async function addConnection(userId1: string, userId2: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/users/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId1, userId2 }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('addConnection', `Failed to add connection: ${error}`);
    }
  } catch (err) {
    logger.error('addConnection', 'Error calling add-connection API:', err);
  }
}

export async function createUserNode(userId: string, name: string, phone: string) {
  try {
    const response = await axios(`${BACKEND_URL}/users/create-node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { userId, name, phone },
    });

  } catch (err) {
    logger.error('createUserNode', 'Error calling create-user-node API:', err);
  }
}

export const getConnectionDetails = async (userId1: string, userId2: string) => {

  try {
    const response = await axios.post(`${BACKEND_URL}/users/connection-details`, {
     userId1, userId2
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      logger.error('getConnectionDetails', `Failed to get connection details: ${response.statusText}`);
      return null;
    }
  }
  catch (err) {
    logger.error('getConnectionDetails', 'Error calling get-connection-details API:', err);
    return null;
  }
};
