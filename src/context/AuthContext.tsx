import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseReady } from '../services/supabase';
import { Loading } from '../components';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseReady()) {
      // Se Supabase não está configurado, apenas define loading como false
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.warn('Erro ao obter sessão:', error.message);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn('Erro ao carregar sessão (não crítico):', error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseReady()) {
      return {
        error: {
          message: 'Supabase não configurado',
          status: 500,
        } as AuthError,
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          status: 500,
        } as AuthError,
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseReady()) {
      return {
        error: {
          message: 'Supabase não configurado',
          status: 500,
        } as AuthError,
      };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          status: 500,
        } as AuthError,
      };
    }
  };

  const signOut = async () => {
    if (!isSupabaseReady()) {
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseReady()) {
      return {
        error: {
          message: 'Supabase não configurado',
          status: 500,
        } as AuthError,
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'nossa-maternidade://reset-password',
      });
      return { error };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          status: 500,
        } as AuthError,
      };
    }
  };

  if (loading) {
    return <Loading fullScreen message="Carregando..." />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

