/**
 * NathIA Onboarding Types
 * Focused on lifestyle + motherhood (NO menstruation/cycle/LMP/ovulation)
 */

export type LifeStage = "trying" | "pregnant" | "postpartum" | "lifestyle";

export type TryingFocus = "trying_emotions" | "mixed" | "lifestyle_only";
export type Trimester = "t1" | "t2" | "t3" | "unknown";
export type BabyAgeBucket = "0-6w" | "2-6m" | "6-12m" | "1y+";
export type Routine = "calm" | "busy" | "chaotic";
export type AgeRange = "18-24" | "25-34" | "35+" | "unknown";

export type InterestOption =
  | "beachwear"
  | "dance"
  | "self_esteem"
  | "sleep_energy"
  | "motherhood"
  | "travel"
  | "basic";

export type MoodToday = "excited" | "powerful" | "anxious" | "tired" | "other";

export type SensitiveTopic = "body_comparison" | "weight_diet" | "anxiety" | "none";

export type TonePreference = "direct" | "warm" | "balanced";

export type NotificationPref = "none" | "daily" | "weekly";

export interface StageDetail {
  trying_focus?: TryingFocus;
  trimester?: Trimester;
  week_approx?: number | null;
  baby_age_bucket?: BabyAgeBucket;
  routine?: Routine;
  age_range?: AgeRange;
}

export interface NathIAOnboardingProfile {
  nickname?: string | null;
  life_stage: LifeStage;
  stage_detail: StageDetail;
  interests: InterestOption[];
  mood_today?: MoodToday;
  mood_note?: string | null;
  sensitive_topics: SensitiveTopic[];
  body_safe_mode: boolean;
  tone_pref: TonePreference;
  allow_brand_recos: boolean;
  notifications_pref: NotificationPref;
  health_connect_interest: boolean;
  onboarding_completed_at: string | null;
  onboarding_version: number;
}

export const DEFAULT_NATHIA_PROFILE: NathIAOnboardingProfile = {
  nickname: null,
  life_stage: "lifestyle",
  stage_detail: {},
  interests: [],
  mood_today: undefined,
  mood_note: null,
  sensitive_topics: [],
  body_safe_mode: false,
  tone_pref: "balanced",
  allow_brand_recos: false,
  notifications_pref: "none",
  health_connect_interest: false,
  onboarding_completed_at: null,
  onboarding_version: 1,
};

// Screen step types
export type NathIAOnboardingStep =
  | "phase"
  | "context"
  | "interests"
  | "mood"
  | "preferences";

// Options for each screen
export const LIFE_STAGE_OPTIONS: {
  id: LifeStage;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "trying",
    label: "Tentando engravidar",
    emoji: "🌱",
    description: "Estou no caminho da maternidade",
  },
  {
    id: "pregnant",
    label: "Estou gravida",
    emoji: "🤰",
    description: "Esperando meu bebe chegar",
  },
  {
    id: "postpartum",
    label: "Sou mae / pos-parto",
    emoji: "👶",
    description: "Meu bebe ja chegou",
  },
  {
    id: "lifestyle",
    label: "Lifestyle, moda e autoestima",
    emoji: "💖",
    description: "Foco em bem-estar e estilo",
  },
];

export const TRYING_FOCUS_OPTIONS: {
  id: TryingFocus;
  label: string;
  description: string;
}[] = [
  {
    id: "trying_emotions",
    label: "Emocoes/rotina de tentante",
    description: "Apoio emocional nessa jornada",
  },
  {
    id: "mixed",
    label: "Lifestyle + maternidade",
    description: "Um pouco de tudo",
  },
  {
    id: "lifestyle_only",
    label: "So lifestyle por enquanto",
    description: "Foco em bem-estar geral",
  },
];

export const TRIMESTER_OPTIONS: {
  id: Trimester;
  label: string;
}[] = [
  { id: "t1", label: "1o trimestre (ate 12 semanas)" },
  { id: "t2", label: "2o trimestre (13-26 semanas)" },
  { id: "t3", label: "3o trimestre (27+ semanas)" },
  { id: "unknown", label: "Prefiro nao dizer" },
];

export const BABY_AGE_OPTIONS: {
  id: BabyAgeBucket;
  label: string;
}[] = [
  { id: "0-6w", label: "0-6 semanas (recem-nascido)" },
  { id: "2-6m", label: "2-6 meses" },
  { id: "6-12m", label: "6-12 meses" },
  { id: "1y+", label: "1 ano ou mais" },
];

export const ROUTINE_OPTIONS: {
  id: Routine;
  label: string;
  emoji: string;
}[] = [
  { id: "calm", label: "Tranquila", emoji: "😌" },
  { id: "busy", label: "Corrida", emoji: "🏃‍♀️" },
  { id: "chaotic", label: "Caotica", emoji: "😅" },
];

export const AGE_RANGE_OPTIONS: {
  id: AgeRange;
  label: string;
}[] = [
  { id: "18-24", label: "18-24 anos" },
  { id: "25-34", label: "25-34 anos" },
  { id: "35+", label: "35+ anos" },
  { id: "unknown", label: "Prefiro nao dizer" },
];

export const INTEREST_OPTIONS: {
  id: InterestOption;
  label: string;
  emoji: string;
}[] = [
  { id: "beachwear", label: "Moda praia / looks", emoji: "🩱" },
  { id: "dance", label: "Fitness leve, danca e movimento", emoji: "💃" },
  { id: "self_esteem", label: "Autoestima e confianca no corpo", emoji: "✨" },
  { id: "sleep_energy", label: "Sono/energia e rotina pratica", emoji: "🔋" },
  { id: "motherhood", label: "Gravidez/maternidade real", emoji: "👶" },
  { id: "travel", label: "Viagens/lifestyle", emoji: "✈️" },
  { id: "basic", label: "So o basico", emoji: "✅" },
];

export const MOOD_OPTIONS: {
  id: MoodToday;
  label: string;
  emoji: string;
}[] = [
  { id: "excited", label: "Animada", emoji: "✨" },
  { id: "powerful", label: "Poderosa", emoji: "💪" },
  { id: "anxious", label: "Ansiosa", emoji: "😰" },
  { id: "tired", label: "Cansada", emoji: "🥱" },
  { id: "other", label: "Outra vibe", emoji: "💭" },
];

export const SENSITIVE_TOPIC_OPTIONS: {
  id: SensitiveTopic;
  label: string;
}[] = [
  { id: "body_comparison", label: "Corpo/comparacao" },
  { id: "weight_diet", label: "Peso/dieta" },
  { id: "anxiety", label: "Ansiedade" },
  { id: "none", label: "Nenhum" },
];

export const TONE_OPTIONS: {
  id: TonePreference;
  label: string;
  description: string;
}[] = [
  {
    id: "direct",
    label: "Direta e objetiva",
    description: "Vai direto ao ponto",
  },
  {
    id: "warm",
    label: "Acolhedora e conversa",
    description: "Mais carinhosa e detalhada",
  },
  {
    id: "balanced",
    label: "Meio termo",
    description: "Equilibrio entre os dois",
  },
];

export const NOTIFICATION_OPTIONS: {
  id: NotificationPref;
  label: string;
  description: string;
}[] = [
  { id: "none", label: "Nao", description: "Sem notificacoes" },
  { id: "daily", label: "Diaria", description: "Uma mensagem por dia" },
  { id: "weekly", label: "Semanal", description: "Resumo semanal" },
];
