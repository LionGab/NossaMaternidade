/**
 * MCP Servers Export
 * Exportações centralizadas de todos os servidores MCP
 */

export { SupabaseMCPServer, supabaseMCP } from './SupabaseMCPServer';
export { GoogleAIMCPServer, googleAIMCP } from './GoogleAIMCPServer';
export { OpenAIMCPServer, openAIMCP } from './OpenAIMCPServer';
export { AnthropicMCPServer, anthropicMCP } from './AnthropicMCPServer';
export { AnalyticsMCPServer, analyticsMCP } from './AnalyticsMCPServer';
export {
  DesignTokensValidationMCPServer,
  designTokensValidationMCP,
  type DesignViolation,
  type ValidationResult,
  type DarkModeIssue,
  type FixSuggestion,
} from './DesignTokensValidationMCPServer';
export {
  CodeQualityMCPServer,
  codeQualityMCP,
  type HardcodedValue,
  type DesignAnalysis,
  type RefactorSuggestion,
} from './CodeQualityMCPServer';
export {
  AccessibilityMCPServer,
  accessibilityMCP,
  type ContrastRatio,
  type TouchTargetIssue,
  type MissingLabel,
  type A11yAuditResult,
} from './AccessibilityMCPServer';

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
  DesignTokensValidationMCPMethods,
  CodeQualityMCPMethods,
  AccessibilityMCPMethods,
} from '../types';

export { createMCPRequest, createMCPResponse } from '../types';
