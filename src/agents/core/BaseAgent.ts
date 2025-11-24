/**
 * Base Agent
 * Classe base para todos os agentes IA do sistema
 */

import { MCPRequest, MCPResponse } from '../../mcp/types';

export interface AgentConfig {
  name: string;
  version: string;
  description: string;
  capabilities: string[];
}

export interface AgentContext {
  userId?: string;
  sessionId?: string;
  userProfile?: any;
  metadata?: Record<string, any>;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected context: AgentContext;
  protected initialized = false;

  constructor(config: AgentConfig) {
    this.config = config;
    this.context = {};
  }

  /**
   * Inicializa o agente
   */
  async initialize(context?: AgentContext): Promise<void> {
    if (context) {
      this.context = { ...this.context, ...context };
    }
    this.initialized = true;
    console.log(`[${this.config.name}] Initialized`);
  }

  /**
   * Atualiza o contexto do agente
   */
  updateContext(context: Partial<AgentContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Verifica se o agente possui uma capacidade específica
   */
  hasCapability(capability: string): boolean {
    return this.config.capabilities.includes(capability);
  }

  /**
   * Obtém informações sobre o agente
   */
  getInfo(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Método abstrato para processar requisições
   */
  abstract process(input: any, options?: any): Promise<any>;

  /**
   * Método abstrato para fazer chamadas MCP
   */
  protected abstract callMCP(
    server: string,
    method: string,
    params: any
  ): Promise<MCPResponse>;

  /**
   * Cleanup e shutdown
   */
  async shutdown(): Promise<void> {
    this.initialized = false;
    console.log(`[${this.config.name}] Shutdown complete`);
  }
}
