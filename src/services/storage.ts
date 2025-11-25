import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper utilitário para AsyncStorage que substitui localStorage
 * Todas as operações são assíncronas
 */

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ChatMessage {
  id?: string;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  [key: string]: unknown;
}

const STORAGE_KEYS = {
  USER: 'nath_user',
  CHAT_HISTORY: 'nathia_history',
  THEME: 'theme',
  API_KEY: 'gemini_api_key',
} as const;

export const storage = {
  // User Profile
  async getUser(): Promise<UserProfile | null> {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async saveUser(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  // Chat History
  async getChatHistory(): Promise<ChatMessage[] | null> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!history) return null;
      const parsed = JSON.parse(history);
      return parsed.map((msg: Record<string, unknown>) => ({
        ...msg,
        timestamp: new Date(msg.timestamp as string),
      })) as ChatMessage[];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return null;
    }
  },

  async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw error;
    }
  },

  async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  },

  // Theme
  async getTheme(): Promise<'light' | 'dark' | null> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return theme as 'light' | 'dark' | null;
    } catch (error) {
      console.error('Error getting theme:', error);
      return null;
    }
  },

  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  },

  // API Key
  async getApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },

  async saveApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  },

  // Generic methods
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export default storage;

