/**
 * HomeScreenMaesValentes - MaesValentes Home Content
 *
 * This screen displays the home content extracted from MaesValentesExpo
 * Available at: /home
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeTabMaesValentes from './HomeTabMaesValentes';

export default function HomeScreenMaesValentes() {
  return (
    <LinearGradient
      colors={['#FFF0F5', '#F0F7FF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <HomeTabMaesValentes />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
