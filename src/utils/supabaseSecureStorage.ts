import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Secure storage adapter for Supabase authentication
 * Implements the Supabase storage interface using expo-secure-store for encryption on native
 * and AsyncStorage on web (since expo-secure-store doesn't work on web)
 *
 * This ensures OAuth tokens and session data are stored encrypted on device
 */
class SupabaseSecureStorage {
  /**
   * Get an item from secure storage
   * @param key Storage key
   * @returns The stored value or null
   */
  async getItem(key: string): Promise<string | null> {
    try {
      // Use AsyncStorage on web, SecureStore on native
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`SecureStore getItem error for ${key}:`, error);
      return null;
    }
  }

  /**
   * Set an item in secure storage
   * @param key Storage key
   * @param value Value to store
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Use AsyncStorage on web, SecureStore on native
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`SecureStore setItem error for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove an item from secure storage
   * @param key Storage key
   */
  async removeItem(key: string): Promise<void> {
    try {
      // Use AsyncStorage on web, SecureStore on native
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`SecureStore removeItem error for ${key}:`, error);
      throw error;
    }
  }
}

/**
 * Migrate existing Supabase session from AsyncStorage to SecureStore
 * Should be called once during app initialization
 * On web, this is a no-op since we use AsyncStorage anyway
 */
export async function migrateSupabaseSessionToSecureStore(): Promise<void> {
  // Skip migration on web since we use AsyncStorage for both old and new storage
  if (Platform.OS === 'web') {
    console.log('Web platform detected - skipping SecureStore migration');
    return;
  }

  try {
    // Buscar todas as chaves do AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();

    // Padrões de chaves que o Supabase usa
    const supabasePatterns = [
      /^supabase\.auth\.token/, // supabase.auth.token
      /^sb-.*-auth-token$/, // sb-{project-ref}-auth-token
      /^sb-.*-auth\.refresh-token$/, // sb-{project-ref}-auth.refresh-token
      /^sb-.*-auth\.code_verifier$/, // OAuth code verifier
    ];

    // Filtrar chaves que correspondem aos padrões do Supabase
    const supabaseKeys = allKeys.filter((key) =>
      supabasePatterns.some((pattern) => pattern.test(key))
    );

    let migratedCount = 0;

    // Migrar cada chave encontrada
    for (const key of supabaseKeys) {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          await SecureStore.setItemAsync(key, value);
          await AsyncStorage.removeItem(key);
          migratedCount++;
          console.log(`[Migration] ✅ Migrated: ${key}`);
        }
      } catch (keyError) {
        console.warn(`[Migration] ⚠️ Failed to migrate key ${key}:`, keyError);
        // Continuar com outras chaves mesmo se uma falhar
      }
    }

    if (migratedCount > 0) {
      console.log(`✅ [Migration] Migrated ${migratedCount} Supabase session keys to SecureStore`);
    } else {
      console.log('ℹ️ [Migration] No Supabase session keys found in AsyncStorage (migration already done or no sessions)');
    }
  } catch (error) {
    console.error('❌ [Migration] Error migrating Supabase session:', error);
    // Don't throw - migration failure shouldn't break the app
  }
}

// Export singleton instance
export const supabaseSecureStorage = new SupabaseSecureStorage();
export default supabaseSecureStorage;
