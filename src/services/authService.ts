import { supabase } from './supabase';
import type { Session, User, AuthError } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Serviço de Autenticação
 * Gerencia login, registro, logout e sessão de usuárias
 */
class AuthService {
  /**
   * Registrar nova usuária
   */
  async signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Erro ao registrar:', error);
        return { user: null, session: null, error };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('Erro inesperado ao registrar:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Login com email e senha
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao fazer login:', error);
        return { user: null, session: null, error };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('Erro inesperado ao fazer login:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Login com Google
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'nossamaternidade://auth/callback',
        },
      });

      if (error) {
        console.error('Erro ao fazer login com Google:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao fazer login com Google:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Login com Apple
   */
  async signInWithApple() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'nossamaternidade://auth/callback',
        },
      });

      if (error) {
        console.error('Erro ao fazer login com Apple:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao fazer login com Apple:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Enviar magic link para email
   */
  async signInWithMagicLink(email: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'nossamaternidade://auth/callback',
        },
      });

      if (error) {
        console.error('Erro ao enviar magic link:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao enviar magic link:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Logout
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erro ao fazer logout:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Erro inesperado ao fazer logout:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Obter sessão atual
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro ao obter sessão:', error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.error('Erro inesperado ao obter sessão:', error);
      return null;
    }
  }

  /**
   * Obter usuária atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erro ao obter usuária:', error);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error('Erro inesperado ao obter usuária:', error);
      return null;
    }
  }

  /**
   * Resetar senha
   */
  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'nossamaternidade://auth/reset-password',
      });

      if (error) {
        console.error('Erro ao resetar senha:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao resetar senha:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Atualizar senha
   */
  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao atualizar senha:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Atualizar email
   */
  async updateEmail(newEmail: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        console.error('Erro ao atualizar email:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao atualizar email:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Ouvir mudanças de autenticação
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      callback(event, session);
    });
  }

  /**
   * Verificar se o email está confirmado
   */
  async isEmailConfirmed(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.email_confirmed_at != null;
  }

  /**
   * Reenviar email de confirmação
   */
  async resendConfirmationEmail(email: string) {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.error('Erro ao reenviar confirmação:', error);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao reenviar confirmação:', error);
      return { error: error as AuthError };
    }
  }
}

export const authService = new AuthService();
export default authService;
