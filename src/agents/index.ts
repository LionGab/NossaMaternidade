/**
 * Agents Export
 * Exportações centralizadas de todos os agentes IA
 */

// Core
export { BaseAgent, type AgentConfig, type AgentContext } from './core/BaseAgent';
export { AgentOrchestrator, orchestrator } from './core/AgentOrchestrator';

// Maternal Chat Agent
export {
  MaternalChatAgent,
  type ChatMessage,
  type ChatSession,
} from './maternal/MaternalChatAgent';

// Content Recommendation Agent
export {
  ContentRecommendationAgent,
  type ContentItem,
  type RecommendationRequest,
  type RecommendationResult,
} from './content/ContentRecommendationAgent';

// 🚫 MVP: Habits Analysis Agent - Desabilitado (implementar pós-launch)
// export {
//   HabitsAnalysisAgent,
//   type HabitEntry,
//   type HabitPattern,
//   type WellbeingAnalysis,
// } from './habits/HabitsAnalysisAgent';

// 🆕 Emotion Analysis Agent
export {
  EmotionAnalysisAgent,
  type EmotionSnapshot,
  type EmotionPattern,
  type EmotionAnalysisResult,
} from './emotion/EmotionAnalysisAgent';

// 🆕 NATHIA Personality Agent (VOZ AUTÊNTICA)
export {
  NathiaPersonalityAgent,
  type NathiaMessage,
  type NathiaResponse,
} from './nathia/NathiaPersonalityAgent';

// 🚫 MVP: Sleep Analysis Agent - Desabilitado (implementar pós-launch)
// export {
//   SleepAnalysisAgent,
//   type SleepEntry,
//   type SleepPattern,
//   type SleepAnalysisResult,
// } from './sleep/SleepAnalysisAgent';

// 🎨 Design Quality Agent
export {
  DesignQualityAgent,
  designQualityAgent,
  type DesignValidationInput,
  type DesignValidationOutput,
  type DesignViolation,
  type DesignAnalysis,
  type A11yAuditResult,
  type RefactorSuggestion,
} from './design/DesignQualityAgent';

// 🏥 Project Health Agent
// 🚫 DESABILITADO: Este agente usa APIs Node.js (child_process, util.promisify)
// que não funcionam no ambiente React Native/Web.
// Use apenas via CLI: npm run health-check
// export { ProjectHealthAgent, projectHealthAgent } from './health/ProjectHealthAgent';
// export type {
//   ProjectHealthReport,
//   BugStatus,
//   ConfigStatus,
//   QualityMetrics,
//   HealthCheckOptions,
// } from './health/types';

// 🚀 Release Operations Agent
export { ReleaseOpsAgent, releaseOpsAgent } from './release/ReleaseOpsAgent';
export type {
  ReleaseReadinessReport,
  StoreStatusSummary,
  CriticalCrash,
  ReleaseOpsInput,
} from './release/ReleaseOpsAgent';