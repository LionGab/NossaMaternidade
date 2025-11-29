// Importar Reanimated apenas em plataformas nativas (não no web)
import { Platform } from 'react-native';
if (Platform.OS !== 'web') {
  require('react-native-reanimated');
}

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';
import { ErrorBoundary } from './src/components';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AgentsProvider } from './src/contexts/AgentsContext';
import { QueryProvider } from './src/contexts/QueryProvider';
import { initSentry } from './src/services/sentry';

// Inicializar Sentry antes de qualquer componente
initSentry();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider defaultMode="system">
          <AgentsProvider>
            <ErrorBoundary>
              <Navigation />
            </ErrorBoundary>
          </AgentsProvider>
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
