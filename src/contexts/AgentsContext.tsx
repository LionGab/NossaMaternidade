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
} from '../agents';

interface AgentsContextValue {
  initialized: boolean;
  orchestrator: typeof orchestrator;
  chatAgent: MaternalChatAgent | null;
  contentAgent: ContentRecommendationAgent | null;
  habitsAgent: HabitsAnalysisAgent | null;
  error: string | null;
}

const AgentsContext = createContext<AgentsContextValue | undefined>(undefined);

interface AgentsProviderProps {
  children: ReactNode;
}

export function AgentsProvider({ children }: AgentsProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [chatAgent, setChatAgent] = useState<MaternalChatAgent | null>(null);
  const [contentAgent, setContentAgent] = useState<ContentRecommendationAgent | null>(null);
  const [habitsAgent, setHabitsAnalysisAgent] = useState<HabitsAnalysisAgent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeAgents() {
      try {
        console.log('[AgentsContext] Initializing system...');

        // 1. Inicializar Orchestrator (inicializa todos os MCPs)
        await orchestrator.initialize();

        // 2. Criar agentes
        const maternal = new MaternalChatAgent();
        const content = new ContentRecommendationAgent();
        const habits = new HabitsAnalysisAgent();

        // 3. Inicializar agentes
        await Promise.all([
          maternal.initialize(),
          content.initialize(),
          habits.initialize(),
        ]);

        // 4. Registrar no orchestrator
        orchestrator.registerAgent(maternal);
        orchestrator.registerAgent(content);
        orchestrator.registerAgent(habits);

        // 5. Atualizar estado
        setChatAgent(maternal);
        setContentAgent(content);
        setHabitsAnalysisAgent(habits);
        setInitialized(true);

        console.log('[AgentsContext] System initialized successfully! 🚀');
      } catch (err: any) {
        console.error('[AgentsContext] Initialization failed:', err);
        setError(err.message || 'Failed to initialize agents');
      }
    }

    initializeAgents();

    // Cleanup
    return () => {
      orchestrator.shutdown().catch(console.error);
    };
  }, []);

  const value: AgentsContextValue = {
    initialized,
    orchestrator,
    chatAgent,
    contentAgent,
    habitsAgent,
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
