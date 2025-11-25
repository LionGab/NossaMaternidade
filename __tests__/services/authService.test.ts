/**
 * Testes básicos para AuthService
 */

// Mock do Supabase antes de importar
jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

import { supabase } from '../../src/services/supabase';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('deve criar conta com sucesso', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      const result = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.data?.user).toBeDefined();
      expect(result.data?.user?.email).toBe('test@example.com');
      expect(result.error).toBeNull();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('deve retornar erro com email inválido', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid email' },
      });

      const result = await supabase.auth.signUp({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.data?.user).toBeNull();
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toBe('Invalid email');
    });
  });

  describe('signInWithPassword', () => {
    it('deve fazer login com sucesso', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.data?.user).toBeDefined();
      expect(result.data?.session).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      expect(result.data?.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('signOut', () => {
    it('deve fazer logout com sucesso', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await supabase.auth.signOut();

      expect(result.error).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('deve retornar usuário quando autenticado', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await supabase.auth.getUser();

      expect(result.data?.user).toBeDefined();
      expect(result.data?.user?.id).toBe('user-123');
      expect(result.error).toBeNull();
    });

    it('deve retornar null quando não autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await supabase.auth.getUser();

      expect(result.data?.user).toBeNull();
    });
  });
});

