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

// Onboarding enums - valores usados pelos screens
export enum UserStage {
  TRYING = 'Tentante',
  PREGNANT = 'Gestante',
  NEW_MOM = 'Puérpera (Recém-nascido)',
  MOM = 'Mãe experiente',
}

export enum UserEmotion {
  ANXIOUS = 'Ansiosa',
  TIRED = 'Cansada',
  GUILTY = 'Culpada',
  HAPPY = 'Feliz',
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
