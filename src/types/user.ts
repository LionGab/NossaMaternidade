export interface UserProfile {
  name?: string;
  email?: string;
  stage?: string; // 'gestante', 'puérpera', 'mãe'
  timelineInfo?: string; // '28 semanas', '3 meses', etc
  biggestChallenge?: string;
  supportLevel?: string;
  currentFeeling?: string;
  primaryNeed?: string;
  notificationsEnabled?: boolean;
}

// Onboarding types
export type UserStage = 'gestante' | 'puerpera' | 'mae';
export type UserEmotion = 'feliz' | 'ansiosa' | 'cansada' | 'sobrecarregada' | 'esperancosa' | 'confusa';
export type UserChallenge = 'amamentacao' | 'sono' | 'ansiedade' | 'solidao' | 'rotina' | 'parceiro';
export type UserSupport = 'parceiro' | 'familia' | 'amigos' | 'nenhum';
export type UserNeed = 'acolhimento' | 'informacao' | 'comunidade' | 'organizacao';
