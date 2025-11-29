import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Ritual: undefined;
  Diary: undefined;
  ContentDetail: { contentId: string }; // 🆕 Tela de detalhes de conteúdo (Week 1)
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Settings: undefined;
  AgentsStatus: undefined; // 🆕 Tela de status dos agentes IA
  Profile: undefined;
  DesignSystem: undefined; // 🎨 Tela de teste do Design System
  DesignMetrics: undefined; // 📊 Dashboard de métricas do design system
};

/**
 * MainTabParamList - 5 Tabs Principais
 *
 * 🏠 Home - Dashboard principal
 * 👥 MaesValentes - Comunidade de mães
 * 💬 Chat - MãesValente IA (NathIA)
 * 📚 MundoNath - Conteúdo e Feed
 * 📊 Habitos - Bem-estar e hábitos
 */
export type MainTabParamList = {
  Home: undefined;
  MaesValentes: undefined;
  Chat: undefined;
  MundoNath: undefined;
  Habitos: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

