export interface UserProfile {
  name?: string;
  email?: string;
  stage?: string;
  timelineInfo?: string;
  biggestChallenge?: string;
  supportLevel?: string;
  currentFeeling?: string;
  primaryNeed?: string;
  notificationsEnabled?: boolean;
}

// Onboarding enums - valores em português para UI
export enum UserStage {
  PREGNANT = 'Gestante',
  NEW_MOM = 'Puérpera (Recém-nascido)',
  MOM_BABY_6_12M = 'Mãe (Bebê 6-12 meses)',
  MOM_CHILD_1_3Y = 'Mãe (Criança 1-3 anos)',
}

export enum UserEmotion {
  HAPPY = 'Feliz',
  ANXIOUS = 'Ansiosa',
  TIRED = 'Cansada',
  OVERWHELMED = 'Sobrecarregada',
  HOPEFUL = 'Esperançosa',
  CONFUSED = 'Confusa',
}

export enum UserChallenge {
  BREASTFEEDING = 'Amamentação',
  SLEEP = 'Sono do bebê',
  ANXIETY = 'Ansiedade e culpa',
  LONELINESS = 'Solidão',
  ROUTINE = 'Organização da rotina',
  PARTNER = 'Relação com parceiro',
}

export enum UserSupport {
  HIGH = 'Tenho, graças a Deus',
  MEDIUM = 'Às vezes/Pouca',
  LOW = 'Me sinto muito sozinha',
}

export enum UserNeed {
  CHAT = 'Desabafar',
  LEARN = 'Aprender',
  CALM = 'Acalmar',
  CONNECT = 'Conectar',
}
