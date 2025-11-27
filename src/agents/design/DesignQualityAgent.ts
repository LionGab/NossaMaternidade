/**
 * Design Quality Agent
 * Agente especializado em qualidade de design e correção de violações
 */

import { BaseAgent, AgentProcessOptions } from '../core/BaseAgent';
import { createMCPRequest, MCPResponse } from '../../mcp/servers';
// Importar diretamente dos arquivos (não do index.ts) porque estes servidores usam Node.js
// e não devem ser importados no app mobile
import { designTokensValidationMCP } from '../../mcp/servers/DesignTokensValidationMCPServer';
import { codeQualityMCP } from '../../mcp/servers/CodeQualityMCPServer';
import { accessibilityMCP } from '../../mcp/servers/AccessibilityMCPServer';
import type {
  ValidationResult,
  DesignViolation,
} from '../../mcp/servers/DesignTokensValidationMCPServer';
import type {
  DesignAnalysis,
  RefactorSuggestion,
} from '../../mcp/servers/CodeQualityMCPServer';
import type { A11yAuditResult } from '../../mcp/servers/AccessibilityMCPServer';
import { logger } from '../../utils/logger';

export interface DesignValidationInput {
  filePath?: string;
  screenPath?: string;
  validateTokens?: boolean;
  validateAccessibility?: boolean;
  suggestFixes?: boolean;
}

export interface DesignValidationOutput {
  violations: DesignViolation[];
  analysis?: DesignAnalysis;
  accessibility?: A11yAuditResult;
  suggestions: RefactorSuggestion[];
  score: number; // 0-100
  summary: {
    totalViolations: number;
    criticalIssues: number;
    warnings: number;
    accessibilityIssues: number;
  };
}

export class DesignQualityAgent extends BaseAgent<DesignValidationInput, DesignValidationOutput> {
  constructor() {
    super({
      name: 'design-quality-agent',
      version: '1.0.0',
      description: 'Agente especializado em qualidade de design e design tokens',
      capabilities: [
        'validate-design-tokens',
        'fix-design-violations',
        'suggest-design-improvements',
        'audit-accessibility',
        'check-dark-mode',
        'analyze-code-quality',
      ],
    });
  }

  async process(input: DesignValidationInput, _options?: AgentProcessOptions): Promise<DesignValidationOutput> {
    if (!this.initialized) {
      await this.initialize();
    }

    logger.info('[DesignQualityAgent] Processing design validation', { input });

    const violations: DesignViolation[] = [];
    let analysis: DesignAnalysis | undefined;
    let accessibility: A11yAuditResult | undefined;
    const suggestions: RefactorSuggestion[] = [];

    try {
      // 1. Validar design tokens
      if (input.validateTokens !== false) {
        const validationResult = await this.validateDesignTokens(input);
        violations.push(...validationResult.violations);
      }

      // 2. Analisar qualidade do código
      if (input.filePath || input.screenPath) {
        const filePath = input.filePath || input.screenPath;
        if (filePath) {
          const analysisResult = await this.analyzeCodeQuality(filePath);
          analysis = analysisResult;
        }
      }

      // 3. Validar acessibilidade
      if (input.validateAccessibility && input.screenPath) {
        const a11yResult = await this.auditAccessibility(input.screenPath);
        accessibility = a11yResult;
      }

      // 4. Sugerir correções
      if (input.suggestFixes !== false && violations.length > 0) {
        const fixSuggestions = await this.suggestFixes(input.filePath || input.screenPath || '', violations);
        suggestions.push(...fixSuggestions);
      }

      // Calcular score e summary
      const criticalIssues = violations.filter(v => v.severity === 'critical').length;
      const warnings = violations.filter(v => v.severity === 'warning').length;
      const accessibilityIssues = accessibility?.issues
        ? Object.values(accessibility.issues).reduce((sum: number, count: unknown) => sum + (count as number), 0)
        : 0;

      const totalIssues = violations.length + accessibilityIssues;
      const score = Math.max(0, 100 - totalIssues * 2); // Cada issue reduz 2 pontos

      const output: DesignValidationOutput = {
        violations,
        analysis,
        accessibility,
        suggestions,
        score,
        summary: {
          totalViolations: violations.length,
          criticalIssues,
          warnings,
          accessibilityIssues,
        },
      };

      logger.info('[DesignQualityAgent] Validation complete', {
        score,
        violations: violations.length,
        suggestions: suggestions.length,
      });

      return output;
    } catch (error) {
      logger.error('[DesignQualityAgent] Error processing validation', error);
      throw error;
    }
  }

  protected async callMCP(server: string, method: string, params: Record<string, unknown>): Promise<MCPResponse> {
    const request = createMCPRequest(method as any, params as any);

    switch (server) {
      case 'design-validation':
        return await designTokensValidationMCP.handleRequest(request);
      case 'code-quality':
        return await codeQualityMCP.handleRequest(request);
      case 'accessibility':
        return await accessibilityMCP.handleRequest(request);
      default:
        throw new Error(`Unknown MCP server: ${server}`);
    }
  }

  private async validateDesignTokens(input: DesignValidationInput): Promise<ValidationResult> {
    let method: string;
    let params: Record<string, unknown>;

    if (input.filePath) {
      method = 'design.validate.tokens';
      params = { filePath: input.filePath };
    } else if (input.screenPath) {
      method = 'design.validate.screen';
      params = { screenPath: input.screenPath };
    } else {
      method = 'design.validate.tokens';
      params = {}; // Validar todo o projeto
    }

    const response = await this.callMCP('design-validation', method, params);
    if (!response.success || !response.data) {
      throw new Error(`Design tokens validation failed: ${response.error?.message || 'Unknown error'}`);
    }

    return response.data as unknown as ValidationResult;
  }

  private async analyzeCodeQuality(filePath: string): Promise<DesignAnalysis> {
    const response = await this.callMCP('code-quality', 'code.analyze.design', { filePath });
    if (!response.success || !response.data) {
      throw new Error(`Code quality analysis failed: ${response.error?.message || 'Unknown error'}`);
    }

    return response.data as unknown as DesignAnalysis;
  }

  private async auditAccessibility(screenPath: string): Promise<A11yAuditResult> {
    const response = await this.callMCP('accessibility', 'a11y.audit.screen', { screenPath });
    if (!response.success || !response.data) {
      throw new Error(`Accessibility audit failed: ${response.error?.message || 'Unknown error'}`);
    }

    return response.data as unknown as A11yAuditResult;
  }

  private async suggestFixes(filePath: string, violations: DesignViolation[]): Promise<RefactorSuggestion[]> {
    const response = await this.callMCP('code-quality', 'code.refactor.suggest', {
      filePath,
      violations: violations.map(v => ({
        type: v.type,
        line: v.line,
        content: v.content,
      })),
    });

    if (!response.success || !response.data) {
      logger.warn('[DesignQualityAgent] Failed to get refactor suggestions', response.error);
      return [];
    }

    return (response.data as unknown as RefactorSuggestion[]) || [];
  }

  /**
   * Método auxiliar para validar um arquivo específico
   */
  async validateFile(filePath: string): Promise<DesignValidationOutput> {
    return this.process({
      filePath,
      validateTokens: true,
      validateAccessibility: true,
      suggestFixes: true,
    });
  }

  /**
   * Método auxiliar para validar uma tela específica
   */
  async validateScreen(screenPath: string): Promise<DesignValidationOutput> {
    return this.process({
      screenPath,
      validateTokens: true,
      validateAccessibility: true,
      suggestFixes: true,
    });
  }

  /**
   * Método auxiliar para verificar dark mode
   */
  async checkDarkMode(filePath: string): Promise<unknown> {
    const response = await this.callMCP('design-validation', 'design.check.darkmode', { filePath });
    if (!response.success || !response.data) {
      throw new Error(`Dark mode check failed: ${response.error?.message || 'Unknown error'}`);
    }

    return response.data;
  }
}

// Singleton instance
export const designQualityAgent = new DesignQualityAgent();

