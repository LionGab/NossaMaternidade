/**
 * Agents Context
 * Context global para gerenciar agentes IA e orquestração
 * Mobile-First para iOS/Android
 */

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { orchestrator } from '../agents';
import {
  MaternalChatAgent,
  ContentRecommendationAgent,
  HabitsAnalysisAgent,
  EmotionAnalysisAgent,
  NathiaPersonalityAgent,
  SleepAnalysisAgent,
  DesignQualityAgent,
} from '../agents';
import { logger } from '../utils/logger';

// Tipo union para todos os agentes suportados
type SupportedAgent =
  | MaternalChatAgent
  | ContentRecommendationAgent
  | HabitsAnalysisAgent
  | EmotionAnalysisAgent
  | NathiaPersonalityAgent
  | SleepAnalysisAgent
  | DesignQualityAgent;

interface AgentsContextValue {
  initialized: boolean;
  orchestrator: typeof orchestrator;
  // Agentes principais
  chatAgent: MaternalChatAgent | null;
  contentAgent: ContentRecommendationAgent | null;
  habitsAgent: HabitsAnalysisAgent | null;
  // 🆕 Novos agentes especializados
  emotionAgent: EmotionAnalysisAgent | null;
  nathiaAgent: NathiaPersonalityAgent | null;
  sleepAgent: SleepAnalysisAgent | null;
  designAgent: DesignQualityAgent | null;
  error: string | null;
  // 🚀 Lazy loading helpers
  initializeAgent: (agentName: string) => Promise<void>;
  isAgentReady: (agentName: string) => boolean;
}

const AgentsContext = createContext<AgentsContextValue | undefined>(undefined);

interface AgentsProviderProps {
  children: ReactNode;
}

// 🚀 CONFIGURAÇÃO: Timeout e graceful degradation
const AGENT_INIT_TIMEOUT = 10000; // 10 segundos
// Agentes críticos inicializados primeiro (removido pois não usado ainda)
// const CRITICAL_AGENTS = ['chat', 'content', 'habits'];

export function AgentsProvider({ children }: AgentsProviderProps) {
  const [initialized, setInitialized] = useState(false);
  // Agentes principais
  const [chatAgent, setChatAgent] = useState<MaternalChatAgent | null>(null);
  const [contentAgent, setContentAgent] = useState<ContentRecommendationAgent | null>(null);
  const [habitsAgent, setHabitsAnalysisAgent] = useState<HabitsAnalysisAgent | null>(null);
  // 🆕 Novos agentes especializados
  const [emotionAgent, setEmotionAgent] = useState<EmotionAnalysisAgent | null>(null);
  const [nathiaAgent, setNathiaAgent] = useState<NathiaPersonalityAgent | null>(null);
  const [sleepAgent, setSleepAgent] = useState<SleepAnalysisAgent | null>(null);
  const [designAgent, setDesignAgent] = useState<DesignQualityAgent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, boolean>>({});

  // 🚀 Helper: Inicializar agente com timeout
  const initializeAgentWithTimeout = async <T extends SupportedAgent>(
    agentName: string,
    agentInstance: T,
    setter: (agent: T) => void
  ): Promise<void> => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Timeout: ${agentName} took too long to initialize`)), AGENT_INIT_TIMEOUT);
      });

      await Promise.race([agentInstance.initialize(), timeoutPromise]);

      orchestrator.registerAgent(agentInstance);
      setter(agentInstance);
      setAgentStatus(prev => ({ ...prev, [agentName]: true }));
      logger.info(`[AgentsContext] ${agentName} initialized successfully`);
    } catch (err) {
      logger.warn(`[AgentsContext] ${agentName} initialization failed or timed out`, err);
      setAgentStatus(prev => ({ ...prev, [agentName]: false }));
      // Graceful degradation: app continua funcionando mesmo se alguns agents falharem
    }
  };

  // 🚀 Lazy initialization: Inicializar agente sob demanda
  const initializeAgent = async (agentName: string): Promise<void> => {
    if (agentStatus[agentName]) {
      return; // Já inicializado
    }

    try {
      switch (agentName) {
        case 'chat':
          if (!chatAgent) {
            await initializeAgentWithTimeout('chat', new MaternalChatAgent(), setChatAgent);
          }
          break;
        case 'content':
          if (!contentAgent) {
            await initializeAgentWithTimeout('content', new ContentRecommendationAgent(), setContentAgent);
          }
          break;
        case 'habits':
          if (!habitsAgent) {
            await initializeAgentWithTimeout('habits', new HabitsAnalysisAgent(), setHabitsAnalysisAgent);
          }
          break;
        case 'emotion':
          if (!emotionAgent) {
            await initializeAgentWithTimeout('emotion', new EmotionAnalysisAgent(), setEmotionAgent);
          }
          break;
        case 'nathia':
          if (!nathiaAgent) {
            await initializeAgentWithTimeout('nathia', new NathiaPersonalityAgent(), setNathiaAgent);
          }
          break;
        case 'sleep':
          if (!sleepAgent) {
            await initializeAgentWithTimeout('sleep', new SleepAnalysisAgent(), setSleepAgent);
          }
          break;
        case 'design':
          if (!designAgent) {
            await initializeAgentWithTimeout('design', new DesignQualityAgent(), setDesignAgent);
          }
          break;
      }
    } catch (err) {
      logger.error(`[AgentsContext] Failed to lazy initialize ${agentName}`, err);
    }
  };

  const isAgentReady = (agentName: string): boolean => {
    return agentStatus[agentName] === true;
  };

  useEffect(() => {
    async function initializeCriticalAgents() {
      try {
        logger.info('[AgentsContext] Initializing orchestrator and critical agents...');

        // 1. Inicializar Orchestrator (inicializa todos os MCPs)
        await orchestrator.initialize();
        logger.info('[AgentsContext] Orchestrator initialized');

        // 2. Inicializar apenas agentes críticos primeiro (lazy loading dos outros)
        // Inicializar agentes críticos em paralelo com timeout
        await Promise.allSettled([
          initializeAgentWithTimeout('chat', new MaternalChatAgent(), setChatAgent),
          initializeAgentWithTimeout('content', new ContentRecommendationAgent(), setContentAgent),
          initializeAgentWithTimeout('habits', new HabitsAnalysisAgent(), setHabitsAnalysisAgent),
        ]);

        setInitialized(true);
        logger.info('[AgentsContext] Critical agents initialized. Other agents will load on demand.');
      } catch (err: unknown) {
        logger.error('[AgentsContext] Critical initialization failed', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize critical agents');
        // Graceful degradation: marcar como inicializado mesmo com errors
        setInitialized(true);
      }
    }

    initializeCriticalAgents();

    // Cleanup
    return () => {
      orchestrator.shutdown().catch((err) => logger.error('[AgentsContext] Shutdown failed', err));
    };
  }, []);

  // 🚀 MEMOIZATION: Evita recriação do value object a cada render
  const value: AgentsContextValue = useMemo(() => ({
    initialized,
    orchestrator,
    // Agentes principais
    chatAgent,
    contentAgent,
    habitsAgent,
    // 🆕 Novos agentes especializados
    emotionAgent,
    nathiaAgent,
    sleepAgent,
    designAgent,
    error,
    // 🚀 Lazy loading helpers
    initializeAgent,
    isAgentReady,
  }), [initialized, chatAgent, contentAgent, habitsAgent, emotionAgent, nathiaAgent, sleepAgent, designAgent, error, agentStatus]);

  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within AgentsProvider');
  }
  return context;
}
