export interface UserProfile {
  name?: string;
  email?: string;
  stage?: string; // 'gestante', 'puérpera', 'mãe'
  timelineInfo?: string; // '28 semanas', '3 meses', etc
  biggestChallenge?: string;
  supportLevel?: string;
  currentFeeling?: string;
}
