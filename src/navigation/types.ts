import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Ritual: undefined;
  Diary: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  Feed: undefined;
  Community: undefined;
  Habits: undefined;
  Refugio: undefined;
  NathSemFiltro: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

