import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../types/chat';

const CHAT_HISTORY_KEY = '@nossa_maternidade:chat_history';
const API_KEY_STORAGE = '@nossa_maternidade:gemini_api_key';

export const storageService = {
  // Chat history operations
  async saveMessages(messages: ChatMessage[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(messages);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  },

  async loadMessages(): Promise<ChatMessage[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  },

  async clearMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  },

  // API Key operations
  async saveApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE, apiKey);
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  },

  async loadApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_KEY_STORAGE);
    } catch (error) {
      console.error('Error loading API key:', error);
      return null;
    }
  },
};

export default storageService;
