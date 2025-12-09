// Importar Reanimated apenas em plataformas nativas (não no web)
import { Platform } from 'react-native';
if (Platform.OS !== 'web') {
  require('react-native-reanimated');
}

// Importar CSS apenas na web (NativeWind não precisa de importação explícita no mobile)
if (Platform.OS === 'web') {
  require('./src/styles/global.css');
}

// Configurar NativeWind dark mode para 'class' em vez de 'media'
// Isso permite controle manual do tema via JavaScript
// ⚠️ CRÍTICO: Deve ser executado ANTES de qualquer outro código que use NativeWind
if (Platform.OS === 'web') {
  try {
    // NativeWind CSS Interop runtime - dynamic require necessário para web
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StyleSheet = require('react-native-css-interop/runtime/web/color-scheme') as {
      setFlag?: (flag: string, value: string) => void;
    };
    // ✅ Configurar darkMode como 'class' ANTES de qualquer MutationObserver ser ativado
    if (StyleSheet?.setFlag) {
      StyleSheet.setFlag('darkMode', 'class');
    }
    // ✅ Também configurar classe inicial no HTML para evitar race condition
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (!html.classList.contains('light') && !html.classList.contains('dark')) {
        html.classList.add('light'); // Default para light
      }
    }
  } catch (error) {
    // Log apenas em desenvolvimento para debug
    if (__DEV__) {
      console.warn('[App] NativeWind darkMode config failed:', error);
    }
  }
}

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from './src/components';
import { AgentsProvider } from './src/contexts/AgentsContext';
import { QueryProvider } from './src/contexts/QueryProvider';
import { WellnessProvider } from './src/features/wellness';
import { Navigation } from './src/navigation';
import { initSentry } from '@/services';
import { ThemeProvider } from './src/theme/ThemeContext';

// Inicializar Sentry antes de qualquer componente
initSentry();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider defaultMode="system">
          <WellnessProvider>
            <AgentsProvider>
              <ErrorBoundary>
                <Navigation />
              </ErrorBoundary>
            </AgentsProvider>
          </WellnessProvider>
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
