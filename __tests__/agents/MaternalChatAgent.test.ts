/**
 * Testes para MaternalChatAgent
 * Agente de chat especializado em suporte maternal
 */

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

jest.mock('../../src/services/geminiService', () => ({
  geminiService: {
    sendMessage: jest.fn(),
  },
}));

jest.mock('../../src/services/sessionManager', () => ({
  sessionManager: {
    getState: jest.fn(),
    setChatSessionId: jest.fn(),
    getChatSessionId: jest.fn(),
    getCurrentUser: jest.fn(),
    getAuthSession: jest.fn(),
  },
}));

jest.mock('../../src/services/sessionPersistence', () => ({
  sessionPersistence: {
    saveChatSession: jest.fn().mockResolvedValue(true),
    loadChatSession: jest.fn().mockResolvedValue(null),
    listConversations: jest.fn().mockResolvedValue([]),
    deleteConversation: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('../../src/agents/core/AgentOrchestrator', () => ({
  orchestrator: {
    callMCP: jest.fn(),
  },
}));

jest.mock('../../src/agents/helpers/llmRouter', () => ({
  selectLlmProfile: jest.fn(() => 'CHAT_DEFAULT'),
  profileToMcpServer: jest.fn(() => 'googleai'),
  getFallbackOrder: jest.fn(() => ['googleai', 'openai', 'anthropic']),
}));

jest.mock('../../src/ai/moderation', () => ({
  CrisisDetectionService: {
    detectCrisis: jest.fn(() =>
      Promise.resolve({
        level: 'none',
        types: [],
        confidence: 0,
        shouldUseCrisisSafeModel: false,
      })
    ),
  },
  MedicalModerationService: {
    moderate: jest.fn(() => Promise.resolve({ safe: true, flags: [] })),
  },
}));

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { MaternalChatAgent, type UserContext } from '../../src/agents/maternal/MaternalChatAgent';
import { orchestrator } from '../../src/agents/core/AgentOrchestrator';
import { geminiService } from '../../src/services/geminiService';
import { CrisisDetectionService } from '../../src/ai/moderation';

describe('MaternalChatAgent', () => {
  let agent: MaternalChatAgent;

  beforeEach(() => {
    jest.clearAllMocks();
    agent = new MaternalChatAgent();
  });

  describe('startSession', () => {
    it('deve criar nova sessao com sucesso', async () => {
      const userId = 'user-123';
      const userContext: UserContext = {
        name: 'Test User',
        lifeStage: 'pregnant',
        emotion: 'anxious',
      };

      const session = await agent.startSession(userId, userContext);

      expect(session).toBeDefined();
      expect(session.userId).toBe(userId);
      expect(session.context).toEqual(userContext);
      expect(session.messages).toEqual([]);
    });

    it('deve criar sessao sem contexto quando nao fornecido', async () => {
      const userId = 'user-123';

      const session = await agent.startSession(userId);

      expect(session).toBeDefined();
      expect(session.userId).toBe(userId);
      expect(session.context).toBeUndefined();
    });
  });

  describe('process', () => {
    it('deve lancar erro quando nao ha sessao ativa', async () => {
      await expect(agent.process({ message: 'Teste' })).rejects.toThrow(
        'No active chat session'
      );
    });

    it('deve processar mensagem e retornar resposta', async () => {
      const userId = 'user-123';
      await agent.startSession(userId);

      const mockResponse = {
        success: true,
        data: {
          message: 'Resposta da IA',
        },
        id: 'response-123',
        timestamp: Date.now(),
      };

      (orchestrator.callMCP as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.process({ message: 'Olá' });

      expect(result).toBeDefined();
      expect(result.role).toBe('assistant');
      expect(result.content).toBe('Resposta da IA');
    });

    it('deve usar fallback quando MCP falha', async () => {
      const userId = 'user-123';
      await agent.startSession(userId);

      // MCP falha
      (orchestrator.callMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'MCP Error' },
      });

      // Gemini fallback funciona
      (geminiService.sendMessage as jest.Mock).mockResolvedValue({
        text: 'Resposta do Gemini',
        error: null,
      });

      const result = await agent.process({ message: 'Olá' });

      expect(result).toBeDefined();
      expect(result.content).toBe('Resposta do Gemini');
      expect(geminiService.sendMessage).toHaveBeenCalled();
    });

    it('deve detectar crise e usar modelo seguro', async () => {
      const userId = 'user-123';
      await agent.startSession(userId);

      (CrisisDetectionService.detectCrisis as jest.Mock).mockResolvedValue({
        level: 'severe',
        types: ['suicidal'],
        confidence: 0.9,
        shouldUseCrisisSafeModel: true,
      });

      const mockResponse = {
        success: true,
        data: {
          message: 'Resposta segura de crise',
        },
        id: 'response-123',
        timestamp: Date.now(),
      };

      (orchestrator.callMCP as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.process({ message: 'Estou pensando em me machucar' });

      expect(result).toBeDefined();
      expect(CrisisDetectionService.detectCrisis).toHaveBeenCalled();
    });
  });

  describe('getCurrentSession', () => {
    it('deve retornar null quando nao ha sessao', () => {
      const session = agent.getCurrentSession();
      expect(session).toBeNull();
    });

    it('deve retornar sessao ativa quando existe', async () => {
      const userId = 'user-123';
      await agent.startSession(userId);

      const session = agent.getCurrentSession();
      expect(session).toBeDefined();
      expect(session?.userId).toBe(userId);
    });
  });
});

