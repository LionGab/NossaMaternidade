/**
 * Agent Orchestrator
 * Gerencia e coordena múltiplos agentes IA
 *
 * ENHANCED com Advanced Tool Use Patterns:
 * - Parallel tool execution (Promise.all)
 * - Lazy loading de MCP servers
 * - Retry logic com exponential backoff
 * - Tool result aggregation
 *
 * Baseado em: https://www.anthropic.com/engineering/advanced-tool-use
 */

import { BaseAgent, AgentContext } from './BaseAgent';
import {
  supabaseMCP,
  googleAIMCP,
  openAIMCP,
  anthropicMCP,
  analyticsMCP,
  createMCPRequest,
  MCPServer,
} from '../../mcp/servers';
// Servidores MCP que usam Node.js (fs, path) não são importados no mobile
// designTokensValidationMCP, codeQualityMCP, accessibilityMCP devem ser usados apenas em scripts/Edge Functions
import { logger } from '../../utils/logger';
import {
  MCPMethod,
  MCPMethodParams,
  MCPResponse,
  MCPRequest,
  JsonValue,
} from '../../mcp/types';
import { toolExecutor, ToolCall, ExecutionOptions, ParallelExecutionResult } from './ToolExecutor';
import { mcpLoader, MCPServerConfig } from './MCPLoader';

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
  private useAdvancedTooling = true; // Flag para ativar/desativar features avançadas

  private constructor() {
    this.setupMCPLoader();
  }

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Configura o MCPLoader com lazy loading
   * Pattern: Dynamic Discovery Over Static Loading (85% token savings)
   */
  private setupMCPLoader(): void {
    // Servidores ESSENCIAIS (carregados imediatamente)
    // Apenas os 3-5 mais usados conforme artigo
    const essentialConfigs: MCPServerConfig[] = [
      {
        name: 'supabase',
        factory: () => supabaseMCP,
        deferLoading: false,
        priority: 100,
        tags: ['database', 'auth', 'storage', 'essential'],
        description: 'Supabase backend para database, auth e storage',
      },
      {
        name: 'googleai',
        factory: () => googleAIMCP,
        deferLoading: false,
        priority: 90,
        tags: ['ai', 'chat', 'gemini', 'essential'],
        description: 'Google AI (Gemini) para chat e análise',
      },
      {
        name: 'analytics',
        factory: () => analyticsMCP,
        deferLoading: false,
        priority: 80,
        tags: ['analytics', 'tracking', 'essential'],
        description: 'Analytics para tracking de eventos',
      },
    ];

    // Servidores OPCIONAIS (lazy loading)
    // Carregados on-demand quando necessário
    const optionalConfigs: MCPServerConfig[] = [
      {
        name: 'openai',
        factory: () => openAIMCP,
        deferLoading: true,
        priority: 50,
        tags: ['ai', 'chat', 'openai', 'fallback'],
        description: 'OpenAI como fallback para chat',
      },
      {
        name: 'anthropic',
        factory: () => anthropicMCP,
        deferLoading: true,
        priority: 40,
        tags: ['ai', 'chat', 'claude', 'fallback'],
        description: 'Anthropic Claude como fallback para chat',
      },
    ];

    [...essentialConfigs, ...optionalConfigs].forEach(config => {
      mcpLoader.register(config);
    });

    logger.debug('[AgentOrchestrator] MCPLoader configured', {
      essential: essentialConfigs.length,
      optional: optionalConfigs.length,
    });
  }

  /**
   * Inicializa o orchestrator e servidores MCP essenciais
   * Servidores opcionais são carregados on-demand
   */
  async initialize(_context?: AgentContext): Promise<void> {
    try {
      logger.debug('[AgentOrchestrator] Initializing...');

      if (this.useAdvancedTooling) {
        // NOVO: Inicializar apenas servidores essenciais via MCPLoader
        await mcpLoader.initializeEssential();

        // Popular mcpServers map com servidores carregados
        for (const { name, loaded } of mcpLoader.listAvailable()) {
          if (loaded) {
            const server = await mcpLoader.getServer(name);
            if (server) {
              this.mcpServers.set(name, server);
            }
          }
        }

        const stats = mcpLoader.getStats();
        logger.info('[AgentOrchestrator] Initialized with lazy loading', {
          loaded: stats.loaded,
          deferred: stats.deferred,
          tokenSavings: stats.tokenSavings,
        });
      } else {
        // LEGACY: Inicializar todos os servidores
        await Promise.all([
          supabaseMCP.initialize(),
          googleAIMCP.initialize(),
          openAIMCP.initialize().catch(err => logger.warn('[AgentOrchestrator] OpenAI MCP init failed (optional)', err)),
          anthropicMCP.initialize().catch(err => logger.warn('[AgentOrchestrator] Anthropic MCP init failed (optional)', err)),
          analyticsMCP.initialize(),
        ]);

        this.mcpServers.set('supabase', supabaseMCP);
        this.mcpServers.set('googleai', googleAIMCP);
        this.mcpServers.set('openai', openAIMCP);
        this.mcpServers.set('anthropic', anthropicMCP);
        this.mcpServers.set('analytics', analyticsMCP);
      }

      this.initialized = true;
      logger.info('[AgentOrchestrator] Initialized successfully');

      // Track initialization
      const request = createMCPRequest('event.track', {
        name: 'orchestrator_initialized',
        properties: {
          timestamp: Date.now(),
          advancedTooling: this.useAdvancedTooling,
        },
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
   * ENHANCED: Suporta lazy loading de servidores
   */
  async callMCP<T extends MCPMethod>(
    server: string,
    method: T,
    params: MCPMethodParams<T> | Record<string, unknown>
  ): Promise<MCPResponse<JsonValue>> {
    let mcpServer = this.mcpServers.get(server);

    // Se não está carregado e useAdvancedTooling está ativo, tenta carregar on-demand
    if (!mcpServer && this.useAdvancedTooling) {
      logger.info(`[AgentOrchestrator] Loading MCP server on-demand: ${server}`);
      const loadedServer = await mcpLoader.getServer(server);
      if (loadedServer) {
        mcpServer = loadedServer;
        this.mcpServers.set(server, loadedServer);
      }
    }

    if (!mcpServer) {
      throw new Error(`MCP Server not found: ${server}`);
    }

    const request = createMCPRequest(method, params as MCPMethodParams<T>);
    return await mcpServer.handleRequest<JsonValue>(request as MCPRequest<Record<string, JsonValue>>);
  }

  /**
   * NOVO: Executa múltiplas chamadas MCP em paralelo
   * Pattern: Parallel Tool Execution (37% token savings)
   *
   * Exemplo:
   * ```ts
   * const result = await orchestrator.callMCPParallel([
   *   { server: 'supabase', method: 'db.query', params: { table: 'profiles' } },
   *   { server: 'googleai', method: 'analyze.emotion', params: { text: 'message' } }
   * ]);
   * ```
   */
  async callMCPParallel<T = JsonValue>(
    calls: ToolCall[],
    options?: ExecutionOptions
  ): Promise<ParallelExecutionResult<T>> {
    if (!this.useAdvancedTooling) {
      // Fallback para execução sequencial
      logger.warn('[AgentOrchestrator] Advanced tooling disabled, falling back to sequential');
      return this.callMCPSequential<T>(calls, options);
    }

    // Executor para chamadas MCP
    const executor = async (request: MCPRequest): Promise<MCPResponse> => {
      // Extrair server do metadata (toolExecutor adiciona isso)
      const serverName = (request.params as Record<string, unknown>).server as string;
      const mcpServer = await this.getMCPServerWithLoading(serverName);
      return await mcpServer.handleRequest(request);
    };

    return await toolExecutor.executeParallel<T>(calls, executor, options);
  }

  /**
   * NOVO: Executa chamadas MCP em sequência com retry
   */
  async callMCPSequential<T = JsonValue>(
    calls: ToolCall[],
    options?: ExecutionOptions
  ): Promise<ParallelExecutionResult<T>> {
    const executor = async (request: MCPRequest): Promise<MCPResponse> => {
      const serverName = (request.params as Record<string, unknown>).server as string;
      const mcpServer = await this.getMCPServerWithLoading(serverName);
      return await mcpServer.handleRequest(request);
    };

    return await toolExecutor.executeSequential<T>(calls, executor, options);
  }

  /**
   * NOVO: Executa chamadas MCP com agregação customizada
   * Pattern: Result Aggregation antes de enviar ao modelo
   *
   * Reduz context window preservando 95% do espaço para reasoning
   */
  async callMCPWithAggregation<TInput = JsonValue, TOutput = JsonValue>(
    calls: ToolCall[],
    aggregator: (results: JsonValue[]) => TOutput,
    options?: ExecutionOptions
  ): Promise<TOutput | null> {
    const executor = async (request: MCPRequest): Promise<MCPResponse> => {
      const serverName = (request.params as Record<string, unknown>).server as string;
      const mcpServer = await this.getMCPServerWithLoading(serverName);
      return await mcpServer.handleRequest(request);
    };

    const result = await toolExecutor.executeWithAggregation<TInput, TOutput>(
      calls,
      executor,
      aggregator,
      options
    );

    return result.success ? result.data || null : null;
  }

  /**
   * NOVO: Busca servidores MCP por tag
   * Pattern: Tool Search Tool
   */
  searchMCPServers(tag: string): string[] {
    return mcpLoader.searchByTag(tag);
  }

  /**
   * Obtém estatísticas do loader
   */
  getMCPStats() {
    return mcpLoader.getStats();
  }

  /**
   * Helper para obter servidor com lazy loading
   */
  private async getMCPServerWithLoading(serverName: string): Promise<MCPServer> {
    let server = this.mcpServers.get(serverName);

    if (!server && this.useAdvancedTooling) {
      const loadedServer = await mcpLoader.getServer(serverName);
      if (loadedServer) {
        server = loadedServer;
        this.mcpServers.set(serverName, loadedServer);
      }
    }

    if (!server) {
      throw new Error(`MCP Server not found: ${serverName}`);
    }

    return server;
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

    if (this.useAdvancedTooling) {
      // NOVO: Shutdown via MCPLoader
      await mcpLoader.shutdown();
    } else {
      // LEGACY: Shutdown direto
      await Promise.all([
        supabaseMCP.shutdown(),
        googleAIMCP.shutdown(),
        openAIMCP.shutdown(),
        anthropicMCP.shutdown(),
        analyticsMCP.shutdown(),
      ]);
    }

    this.agents.clear();
    this.mcpServers.clear();
    this.initialized = false;

    logger.info('[AgentOrchestrator] Shutdown complete');
  }
}

// Export singleton instance
export const orchestrator = AgentOrchestrator.getInstance();
