/**
 * Testes para DiaryService
 * Gerenciamento de entradas do diário (Refúgio)
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
import { diaryService, type DiaryEntry, type DiaryEntryInsert } from '../../src/services/diaryService';

describe('DiaryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveToRefuge', () => {
    it('deve retornar erro quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const entry: DiaryEntryInsert = {
        content: 'Meu desabafo',
      };

      const result = await diaryService.saveToRefuge(entry);

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Usuário não autenticado');
    });

    it('deve salvar entrada no Refúgio com sucesso', async () => {
      const mockUser = { id: 'user-123' };
      const entry: DiaryEntryInsert = {
        content: 'Meu desabafo',
        ai_response: 'Resposta da IA',
        emotion_detected: 'triste',
      };

      const mockEntry: DiaryEntry = {
        id: 'entry-123',
        user_id: mockUser.id,
        content: entry.content,
        ai_response: entry.ai_response || null,
        emotion_detected: entry.emotion_detected || null,
        is_favorite: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockEntry, error: null })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            insert: mockInsert,
          };
        }
        return {};
      });

      const result = await diaryService.saveToRefuge(entry);

      expect(result.data).toEqual(mockEntry);
      expect(result.error).toBeNull();
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        content: entry.content,
        ai_response: entry.ai_response || null,
        emotion_detected: entry.emotion_detected || null,
        is_favorite: true,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    it('deve retornar erro quando falha ao salvar', async () => {
      const mockUser = { id: 'user-123' };
      const entry: DiaryEntryInsert = {
        content: 'Meu desabafo',
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({ data: null, error: { message: 'Database error' } })
          ),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            insert: mockInsert,
          };
        }
        return {};
      });

      const result = await diaryService.saveToRefuge(entry);

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Database error');
    });
  });

  describe('getRefugeEntries', () => {
    it('deve retornar array vazio quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await diaryService.getRefugeEntries();

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('deve retornar entradas do Refúgio (favoritas)', async () => {
      const mockUser = { id: 'user-123' };
      const mockEntries: DiaryEntry[] = [
        {
          id: 'entry-1',
          user_id: mockUser.id,
          content: 'Desabafo 1',
          ai_response: 'Resposta 1',
          emotion_detected: 'triste',
          is_favorite: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'entry-2',
          user_id: mockUser.id,
          content: 'Desabafo 2',
          ai_response: 'Resposta 2',
          emotion_detected: 'calma',
          is_favorite: true,
          created_at: '2025-01-02T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      ];

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() =>
              Promise.resolve({ data: mockEntries, error: null })
            ),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await diaryService.getRefugeEntries(20);

      expect(result.data).toEqual(mockEntries);
      expect(result.error).toBeNull();
    });

    it('deve retornar erro quando ocorre erro ao buscar', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() =>
                Promise.resolve({ data: null, error: { message: 'Database error' } })
              ),
            })),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await diaryService.getRefugeEntries();

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('getHistory', () => {
    it('deve retornar array vazio quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await diaryService.getHistory();

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('deve retornar historico completo de entradas', async () => {
      const mockUser = { id: 'user-123' };
      const mockEntries: DiaryEntry[] = [
        {
          id: 'entry-1',
          user_id: mockUser.id,
          content: 'Entrada 1',
          ai_response: null,
          emotion_detected: null,
          is_favorite: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: mockEntries, error: null })),
          })),
        })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            select: mockSelect,
          };
        }
        return {};
      });

      const result = await diaryService.getHistory(50);

      expect(result.data).toEqual(mockEntries);
      expect(result.error).toBeNull();
    });
  });

  describe('toggleFavorite', () => {
    it('deve retornar erro quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await diaryService.toggleFavorite('entry-123');

      expect(result.data).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('deve alternar status de favorito com sucesso', async () => {
      const mockUser = { id: 'user-123' };
      const currentEntry = { is_favorite: false };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: currentEntry, error: null })),
        })),
      }));

      const mockUpdate = jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
        return {};
      });

      const result = await diaryService.toggleFavorite('entry-123');

      expect(result.data).toBe(true);
      expect(result.error).toBeNull();
      expect(mockUpdate).toHaveBeenCalledWith({
        is_favorite: true,
        updated_at: expect.any(String),
      });
    });
  });

  describe('deleteEntry', () => {
    it('deve retornar erro quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await diaryService.deleteEntry('entry-123');

      expect(result.data).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('deve deletar entrada com sucesso', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockDelete = jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            delete: mockDelete,
          };
        }
        return {};
      });

      const result = await diaryService.deleteEntry('entry-123');

      expect(result.data).toBe(true);
      expect(result.error).toBeNull();
      expect(mockDelete).toHaveBeenCalled();
    });

    it('deve retornar erro quando ocorre erro ao deletar', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockDelete = jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: { message: 'Database error' } })),
      }));

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'diary_entries') {
          return {
            delete: mockDelete,
          };
        }
        return {};
      });

      const result = await diaryService.deleteEntry('entry-123');

      expect(result.data).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });
});

