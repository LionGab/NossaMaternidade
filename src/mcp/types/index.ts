/**
 * MCP (Model Context Protocol) Types
 * Define interfaces para comunicação entre agentes e serviços externos
 */

export interface MCPRequest {
  id: string;
  method: string;
  params: Record<string, any>;
  timestamp: number;
}

export interface MCPResponse<T = any> {
  id: string;
  success: boolean;
  data?: T;
  error?: MCPError;
  timestamp: number;
}

export interface MCPError {
  code: string;
  message: string;
  details?: any;
}

export interface MCPServer {
  name: string;
  version: string;
  initialize(): Promise<void>;
  handleRequest(request: MCPRequest): Promise<MCPResponse>;
  shutdown(): Promise<void>;
}

// Tipos específicos para Supabase MCP
export interface SupabaseMCPMethods {
  'auth.signIn': { email: string; password: string };
  'auth.signUp': { email: string; password: string; metadata?: any };
  'auth.signOut': {};
  'db.query': { table: string; query: any };
  'db.insert': { table: string; data: any };
  'db.update': { table: string; id: string; data: any };
  'db.delete': { table: string; id: string };
  'storage.upload': { bucket: string; path: string; file: any };
  'storage.download': { bucket: string; path: string };
  'storage.delete': { bucket: string; path: string };
}

// Tipos específicos para Google AI MCP
export interface GoogleAIMCPMethods {
  'chat.send': { message: string; context?: any; history?: any[] };
  'chat.stream': { message: string; context?: any };
  'analyze.emotion': { text: string };
  'analyze.sentiment': { text: string };
  'generate.content': { prompt: string; context?: any };
  'summarize.text': { text: string; maxLength?: number };
}

// Tipos específicos para Analytics MCP
export interface AnalyticsMCPMethods {
  'event.track': { name: string; properties?: any };
  'screen.view': { name: string; properties?: any };
  'user.identify': { userId: string; traits?: any };
  'user.alias': { previousId: string; userId: string };
}

// Union type de todos os métodos
export type MCPMethod =
  | keyof SupabaseMCPMethods
  | keyof GoogleAIMCPMethods
  | keyof AnalyticsMCPMethods;

// Helper para criar requests
export function createMCPRequest<T extends MCPMethod>(
  method: T,
  params: any
): MCPRequest {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    method,
    params,
    timestamp: Date.now(),
  };
}

// Helper para criar responses
export function createMCPResponse<T = any>(
  id: string,
  data?: T,
  error?: MCPError
): MCPResponse<T> {
  return {
    id,
    success: !error,
    data,
    error,
    timestamp: Date.now(),
  };
}
