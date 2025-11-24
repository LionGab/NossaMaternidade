/**
 * Agent Orchestrator
 * Gerencia e coordena múltiplos agentes IA
 */

import { BaseAgent, AgentContext } from './BaseAgent';
import {
  supabaseMCP,
  googleAIMCP,
  analyticsMCP,
  createMCPRequest,
} from '../../mcp/servers';

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private agents: Map<string, BaseAgent> = new Map();
  private mcpServers: Map<string, any> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Inicializa o orchestrator e todos os servidores MCP
   */
  async initialize(context?: AgentContext): Promise<void> {
    try {
      console.log('[AgentOrchestrator] Initializing...');

      // Inicializar servidores MCP
      await Promise.all([
        supabaseMCP.initialize(),
        googleAIMCP.initialize(),
        analyticsMCP.initialize(),
      ]);

      // Registrar servidores MCP
      this.mcpServers.set('supabase', supabaseMCP);
      this.mcpServers.set('googleai', googleAIMCP);
      this.mcpServers.set('analytics', analyticsMCP);

      this.initialized = true;
      console.log('[AgentOrchestrator] Initialized successfully');

      // Track initialization
      const request = createMCPRequest('event.track', {
        name: 'orchestrator_initialized',
        properties: { timestamp: Date.now() },
      });
      await analyticsMCP.handleRequest(request);
    } catch (error) {
      console.error('[AgentOrchestrator] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Registra um agente
   */
  registerAgent(agent: BaseAgent): void {
    const info = agent.getInfo();
    this.agents.set(info.name, agent);
    console.log(`[AgentOrchestrator] Registered agent: ${info.name}`);
  }

  /**
   * Remove um agente
   */
  unregisterAgent(name: string): void {
    this.agents.delete(name);
    console.log(`[AgentOrchestrator] Unregistered agent: ${name}`);
  }

  /**
   * Obtém um agente pelo nome
   */
  getAgent(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  /**
   * Lista todos os agentes registrados
   */
  listAgents(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Executa uma tarefa usando um agente específico
   */
  async executeTask(
    agentName: string,
    input: any,
    options?: any
  ): Promise<any> {
    if (!this.initialized) {
      throw new Error('Orchestrator not initialized');
    }

    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    try {
      // Track task execution
      const trackRequest = createMCPRequest('event.track', {
        name: 'agent_task_started',
        properties: { agentName, timestamp: Date.now() },
      });
      await analyticsMCP.handleRequest(trackRequest);

      // Execute task
      const result = await agent.process(input, options);

      // Track task completion
      const completeRequest = createMCPRequest('event.track', {
        name: 'agent_task_completed',
        properties: { agentName, timestamp: Date.now() },
      });
      await analyticsMCP.handleRequest(completeRequest);

      return result;
    } catch (error: any) {
      // Track error
      const errorRequest = createMCPRequest('event.track', {
        name: 'agent_task_failed',
        properties: {
          agentName,
          error: error.message,
          timestamp: Date.now(),
        },
      });
      await analyticsMCP.handleRequest(errorRequest);

      throw error;
    }
  }

  /**
   * Permite que agentes façam chamadas MCP
   */
  async callMCP(server: string, method: string, params: any): Promise<any> {
    const mcpServer = this.mcpServers.get(server);
    if (!mcpServer) {
      throw new Error(`MCP Server not found: ${server}`);
    }

    const request = createMCPRequest(method as any, params);
    return await mcpServer.handleRequest(request);
  }

  /**
   * Atualiza o contexto de todos os agentes
   */
  updateAllAgentsContext(context: Partial<AgentContext>): void {
    this.agents.forEach((agent) => {
      agent.updateContext(context);
    });
  }

  /**
   * Shutdown do orchestrator e todos os agentes
   */
  async shutdown(): Promise<void> {
    // Shutdown agents
    for (const agent of this.agents.values()) {
      await agent.shutdown();
    }

    // Shutdown MCP servers
    await Promise.all([
      supabaseMCP.shutdown(),
      googleAIMCP.shutdown(),
      analyticsMCP.shutdown(),
    ]);

    this.agents.clear();
    this.mcpServers.clear();
    this.initialized = false;

    console.log('[AgentOrchestrator] Shutdown complete');
  }
}

// Export singleton instance
export const orchestrator = AgentOrchestrator.getInstance();
