/**
 * Testes para CheckInService
 * Gerenciamento de check-ins emocionais
 */

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

import { supabase } from '../../src/services/supabase';
import { checkInService, type EmotionValue } from '../../src/services/checkInService';

describe('CheckInService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logEmotion', () => {
    it('deve retornar false quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await checkInService.logEmotion('bem');

      expect(result).toBe(false);
    });

    it('deve criar novo check-in quando nao existe para hoje', async () => {
      const mockUser = { id: 'user-123' };
      const mockEmotion: EmotionValue = 'bem';
      const mockNotes = 'Me sinto bem hoje';

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      }));

      const mockInsert = jest.fn(() => Promise.resolve({ error: null }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
            insert: mockInsert,
          };
        }
        return {};
      });

      const result = await checkInService.logEmotion(mockEmotion, mockNotes);

      expect(result).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        emotion: mockEmotion,
        notes: mockNotes,
        created_at: expect.any(String),
      });
    });

    it('deve atualizar check-in existente quando ja existe para hoje', async () => {
      const mockUser = { id: 'user-123' };
      const mockEmotion: EmotionValue = 'triste';
      const existingCheckIn = { id: 'check-in-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: existingCheckIn, error: null })),
          })),
        })),
      }));

      const mockUpdate = jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
        return {};
      });

      const result = await checkInService.logEmotion(mockEmotion);

      expect(result).toBe(true);
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('deve retornar false quando ocorre erro ao inserir', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      }));

      const mockInsert = jest.fn(() =>
        Promise.resolve({ error: { message: 'Database error' } })
      );

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
            insert: mockInsert,
          };
        }
        return {};
      });

      const result = await checkInService.logEmotion('bem');

      expect(result).toBe(false);
    });
  });

  describe('getTodayEmotion', () => {
    it('deve retornar null quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await checkInService.getTodayEmotion();

      expect(result).toBeNull();
    });

    it('deve retornar emoção de hoje quando existe', async () => {
      const mockUser = { id: 'user-123' };
      const mockEmotion: EmotionValue = 'calma';

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({ data: { emotion: mockEmotion }, error: null })
                ),
              })),
            })),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await checkInService.getTodayEmotion();

      expect(result).toBe(mockEmotion);
    });

    it('deve retornar null quando nao existe check-in para hoje', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
              })),
            })),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await checkInService.getTodayEmotion();

      expect(result).toBeNull();
    });
  });

  describe('getCheckInHistory', () => {
    it('deve retornar array vazio quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await checkInService.getCheckInHistory(7);

      expect(result).toEqual([]);
    });

    it('deve retornar historico de check-ins', async () => {
      const mockUser = { id: 'user-123' };
      const mockHistory = [
        {
          id: 'check-1',
          user_id: mockUser.id,
          emotion: 'bem',
          notes: 'Nota 1',
          created_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'check-2',
          user_id: mockUser.id,
          emotion: 'calma',
          notes: 'Nota 2',
          created_at: '2025-01-02T00:00:00Z',
        },
      ];

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: mockHistory, error: null })),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await checkInService.getCheckInHistory(7);

      expect(result).toEqual(mockHistory);
    });
  });

  describe('getEmotionStats', () => {
    it('deve retornar stats zerados quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await checkInService.getEmotionStats();

      expect(result).toEqual({
        bem: 0,
        triste: 0,
        ansiosa: 0,
        cansada: 0,
        calma: 0,
      });
    });

    it('deve calcular estatisticas de emoções corretamente', async () => {
      const mockUser = { id: 'user-123' };
      const mockData = [
        { emotion: 'bem' },
        { emotion: 'bem' },
        { emotion: 'calma' },
        { emotion: 'triste' },
        { emotion: 'ansiosa' },
      ];

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockData, error: null })),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'check_in_logs') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await checkInService.getEmotionStats();

      expect(result.bem).toBe(2);
      expect(result.calma).toBe(1);
      expect(result.triste).toBe(1);
      expect(result.ansiosa).toBe(1);
      expect(result.cansada).toBe(0);
    });
  });
});

