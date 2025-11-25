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
  MCPServer,
} from '../../mcp/servers';
import { logger } from '../../utils/logger';
import {
  MCPMethod,
  MCPMethodParams,
  MCPResponse,
  JsonValue,
} from '../../mcp/types';

/**
 * Options for task execution
 */
export interface TaskExecutionOptions {
  timeout?: number;
  retries?: number;
  metadata?: Record<string, JsonValue>;
  [key: string]: unknown;
}

/**
 * Input for agent processing
 */
export interface AgentInput {
  query?: string;
  data?: Record<string, JsonValue>;
  context?: Partial<AgentContext>;
}

/**
 * Result from agent task execution
 */
export interface AgentTaskResult<T = JsonValue> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private agents: Map<string, BaseAgent> = new Map();
  private mcpServers: Map<string, MCPServer> = new Map();
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
  async initialize(_context?: AgentContext): Promise<void> {
    try {
      logger.debug('[AgentOrchestrator] Initializing...');

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
      logger.info('[AgentOrchestrator] Initialized successfully');

      // Track initialization
      const request = createMCPRequest('event.track', {
        name: 'orchestrator_initialized',
        properties: { timestamp: Date.now() },
      });
      await analyticsMCP.handleRequest(request);
    } catch (error) {
      logger.error('[AgentOrchestrator] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Registra um agente
   */
  registerAgent(agent: BaseAgent): void {
    const info = agent.getInfo();
    this.agents.set(info.name, agent);
    logger.debug(`[AgentOrchestrator] Registered agent: ${info.name}`);
  }

  /**
   * Remove um agente
   */
  unregisterAgent(name: string): void {
    this.agents.delete(name);
    logger.debug(`[AgentOrchestrator] Unregistered agent: ${name}`);
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
  async executeTask<T = JsonValue>(
    agentName: string,
    input: AgentInput,
    options?: TaskExecutionOptions
  ): Promise<AgentTaskResult<T>> {
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

      return {
        success: true,
        data: result as T,
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Track error
      const errorRequest = createMCPRequest('event.track', {
        name: 'agent_task_failed',
        properties: {
          agentName,
          error: errorMessage,
          timestamp: Date.now(),
        },
      });
      await analyticsMCP.handleRequest(errorRequest);

      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Permite que agentes façam chamadas MCP
   */
  async callMCP<T extends MCPMethod>(
    server: string,
    method: T,
    params: MCPMethodParams<T> | Record<string, unknown>
  ): Promise<MCPResponse<JsonValue>> {
    const mcpServer = this.mcpServers.get(server);
    if (!mcpServer) {
      throw new Error(`MCP Server not found: ${server}`);
    }

    const request = createMCPRequest(method, params as Record<string, JsonValue>);
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

    logger.info('[AgentOrchestrator] Shutdown complete');
  }
}

// Export singleton instance
export const orchestrator = AgentOrchestrator.getInstance();
