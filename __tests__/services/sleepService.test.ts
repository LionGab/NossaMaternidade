/**
 * Testes para SleepService
 * Gerencia logs de sono das usuárias
 */

import { supabase } from '../../src/services/supabase';
import { sleepService } from '../../src/services/sleepService';

// Mock do Supabase
jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// Mock do logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('SleepService', () => {
  const mockUserId = 'user-123';
  const mockSleepLog = {
    id: 'sleep-1',
    user_id: mockUserId,
    duration_hours: 7.5,
    logged_at: '2025-12-09T08:00:00Z',
    notes: 'Dormi bem',
    created_at: '2025-12-09T08:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logSleep', () => {
    it('deve registrar sono com sucesso', async () => {
      // Mock: usuário autenticado
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      // Mock: insert com sucesso
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await sleepService.logSleep(7.5, 'Dormi bem');

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('sleep_logs');
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUserId,
          duration_hours: 7.5,
          notes: 'Dormi bem',
        })
      );
    });

    it('deve retornar false quando usuário não autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await sleepService.logSleep(7.5);

      expect(result).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('deve retornar false quando insert falha', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockInsert = jest.fn().mockResolvedValue({
        error: { message: 'Database error' },
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await sleepService.logSleep(7.5);

      expect(result).toBe(false);
    });

    it('deve registrar sono sem notas', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await sleepService.logSleep(6);

      expect(result).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUserId,
          duration_hours: 6,
          notes: undefined,
        })
      );
    });
  });

  describe('getTodaySleep', () => {
    it('deve retornar sono de hoje', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockSleepLog,
        error: null,
      });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockLt = jest.fn().mockReturnValue({ order: mockOrder });
      const mockGte = jest.fn().mockReturnValue({ lt: mockLt });
      const mockEq = jest.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await sleepService.getTodaySleep();

      expect(result).toEqual(mockSleepLog);
      expect(supabase.from).toHaveBeenCalledWith('sleep_logs');
    });

    it('deve retornar null quando usuário não autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await sleepService.getTodaySleep();

      expect(result).toBeNull();
    });

    it('deve retornar null quando não há registro de hoje (PGRST116)', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows returned' },
      });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockLt = jest.fn().mockReturnValue({ order: mockOrder });
      const mockGte = jest.fn().mockReturnValue({ lt: mockLt });
      const mockEq = jest.fn().mockReturnValue({ gte: mockGte });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await sleepService.getTodaySleep();

      expect(result).toBeNull();
    });
  });

  describe('getSleepHistory', () => {
    it('deve retornar histórico de sono', async () => {
      const mockHistory = [mockSleepLog, { ...mockSleepLog, id: 'sleep-2' }];

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockLimit = jest.fn().mockResolvedValue({
        data: mockHistory,
        error: null,
      });
      const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await sleepService.getSleepHistory(30);

      expect(result).toEqual(mockHistory);
      expect(mockLimit).toHaveBeenCalledWith(30);
    });

    it('deve retornar array vazio quando usuário não autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await sleepService.getSleepHistory();

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando erro no banco', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockLimit = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });
      const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await sleepService.getSleepHistory();

      expect(result).toEqual([]);
    });
  });
});
