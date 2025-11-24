import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './StackNavigator';
import { AuthProvider } from '../context/AuthContext';
import { networkMonitor } from '../utils/networkMonitor';

export const Navigation = () => {
  useEffect(() => {
    // Inicializar network monitor
    networkMonitor.startMonitoring().catch((error) => {
      console.error('[Navigation] Erro ao inicializar network monitor:', error);
    });

    return () => {
      networkMonitor.stopMonitoring();
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default Navigation;

