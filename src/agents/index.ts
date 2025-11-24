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

// Habits Analysis Agent
export {
  HabitsAnalysisAgent,
  type HabitEntry,
  type HabitPattern,
  type WellbeingAnalysis,
} from './habits/HabitsAnalysisAgent';

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

// 🆕 Sleep Analysis Agent
export {
  SleepAnalysisAgent,
  type SleepEntry,
  type SleepPattern,
  type SleepAnalysisResult,
} from './sleep/SleepAnalysisAgent';
