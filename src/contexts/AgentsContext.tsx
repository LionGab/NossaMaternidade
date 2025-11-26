/**
 * Agents Context
 * Context global para gerenciar agentes IA e orquestração
 * Mobile-First para iOS/Android
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { orchestrator } from '../agents';
import {
  MaternalChatAgent,
  ContentRecommendationAgent,
  HabitsAnalysisAgent,
  EmotionAnalysisAgent,
  NathiaPersonalityAgent,
  SleepAnalysisAgent,
} from '../agents';
import { logger } from '../utils/logger';

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
  error: string | null;
}

const AgentsContext = createContext<AgentsContextValue | undefined>(undefined);

interface AgentsProviderProps {
  children: ReactNode;
}

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeAgents() {
      try {
        logger.info('[AgentsContext] Initializing EXPANDED agent system...');
        logger.info('[AgentsContext] Creating 6 specialized agents...');

        // 1. Inicializar Orchestrator (inicializa todos os MCPs)
        await orchestrator.initialize();
        logger.info('[AgentsContext] Orchestrator initialized');

        // 2. Criar TODOS os agentes (3 principais + 3 novos especializados)
        const maternal = new MaternalChatAgent();
        const content = new ContentRecommendationAgent();
        const habits = new HabitsAnalysisAgent();
        const emotion = new EmotionAnalysisAgent();
        const nathia = new NathiaPersonalityAgent();
        const sleep = new SleepAnalysisAgent();

        logger.info('[AgentsContext] 6 agents created, initializing...');

        // 3. Inicializar TODOS os agentes em paralelo
        await Promise.all([
          maternal.initialize(),
          content.initialize(),
          habits.initialize(),
          emotion.initialize(),
          nathia.initialize(),
          sleep.initialize(),
        ]);

        logger.info('[AgentsContext] All agents initialized');

        // 4. Registrar TODOS no orchestrator
        orchestrator.registerAgent(maternal);
        orchestrator.registerAgent(content);
        orchestrator.registerAgent(habits);
        orchestrator.registerAgent(emotion);
        orchestrator.registerAgent(nathia);
        orchestrator.registerAgent(sleep);

        logger.info('[AgentsContext] All agents registered in orchestrator');

        // 5. Atualizar estado com TODOS os agentes
        setChatAgent(maternal);
        setContentAgent(content);
        setHabitsAnalysisAgent(habits);
        setEmotionAgent(emotion);
        setNathiaAgent(nathia);
        setSleepAgent(sleep);
        setInitialized(true);

        logger.info('[AgentsContext] 6 AGENTES ATIVOS! Sistema expandido pronto!');
        logger.debug('[AgentsContext] Agents: MaternalChat, Content, Habits, Emotion, Nathia, Sleep');
      } catch (err: unknown) {
        logger.error('[AgentsContext] Initialization failed', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize agents');
      }
    }

    initializeAgents();

    // Cleanup
    return () => {
      orchestrator.shutdown().catch((err) => logger.error('[AgentsContext] Shutdown failed', err));
    };
  }, []);

  const value: AgentsContextValue = {
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
    error,
  };

  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within AgentsProvider');
  }
  return context;
}
