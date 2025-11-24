/**
 * MCP Servers Export
 * Exportações centralizadas de todos os servidores MCP
 */

export { SupabaseMCPServer, supabaseMCP } from './SupabaseMCPServer';
export { GoogleAIMCPServer, googleAIMCP } from './GoogleAIMCPServer';
export { AnalyticsMCPServer, analyticsMCP } from './AnalyticsMCPServer';

// Re-export types
export type {
  MCPServer,
  MCPRequest,
  MCPResponse,
  MCPError,
  MCPMethod,
  SupabaseMCPMethods,
  GoogleAIMCPMethods,
  AnalyticsMCPMethods,
} from '../types';

export { createMCPRequest, createMCPResponse } from '../types';
