# 💻 Exemplos de Código: Token do Supabase

Exemplos completos de como usar o token do Supabase no código.

---

## 📦 1. Inicialização do Cliente Supabase

**Arquivo**: `src/api/supabase.ts`

```typescript
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { Database } from "@/types/database.types";

// Lê variáveis de ambiente (configuradas em .env.local)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Cliente Supabase (null se não configurado)
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // No web, detecta sessão na URL (OAuth callbacks)
      // No native, usa fluxo manual
      detectSessionInUrl: Platform.OS === "web",
    },
  });
}

export { supabase };
```

---

## 🔐 2. Autenticação (Login/Signup)

**Arquivo**: `src/api/auth.ts`

```typescript
import { supabase } from '@/api/supabase';

/**
 * Login com email e senha
 */
export async function signIn(email: string, password: string) {
  if (!supabase) {
    throw new Error(
      "Supabase não está configurado. " +
      "Adicione EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY " +
      "nas variáveis de ambiente."
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Criar conta
 */
export async function signUp(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Obter usuário atual
 */
export async function getCurrentUser() {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
}

/**
 * Logout
 */
export async function signOut() {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

---

## 📊 3. Queries no Banco de Dados

**Arquivo**: `src/api/database.ts`

```typescript
import { supabase } from '@/api/supabase';
import type { Post, PostInsert } from '@/types/database.types';

/**
 * Buscar posts da comunidade
 */
export async function getPosts(limit = 10) {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Criar novo post
 */
export async function createPost(post: PostInsert) {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualizar post
 */
export async function updatePost(id: string, updates: Partial<Post>) {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deletar post
 */
export async function deletePost(id: string) {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

---

## 🔄 4. Real-time Subscriptions

**Arquivo**: `src/hooks/useRealtimePosts.ts`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/api/supabase';
import type { Post } from '@/types/database.types';

export function useRealtimePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase não configurado');
      return;
    }

    // Buscar posts iniciais
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar posts:', error);
        return;
      }

      setPosts(data || []);
      setLoading(false);
    }

    fetchPosts();

    // Subscribe para mudanças em tempo real
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          console.log('Mudança detectada:', payload);

          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new as Post, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === payload.new.id ? (payload.new as Post) : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((post) => post.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { posts, loading };
}
```

---

## 🌐 5. Chamadas para Edge Functions

**Arquivo**: `src/api/chat-service.ts`

```typescript
import { getSupabaseFunctionsUrl } from '@/config/env';

/**
 * Chamar Edge Function do Supabase
 */
export async function callAIFunction(messages: Array<{ role: string; content: string }>) {
  const functionsUrl = getSupabaseFunctionsUrl();
  
  if (!functionsUrl) {
    throw new Error('EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL não configurado');
  }

  // Obter token de autenticação atual
  const { supabase } = await import('@/api/supabase');
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Usuário não autenticado');
  }

  // Chamar Edge Function
  const response = await fetch(`${functionsUrl}/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao chamar função');
  }

  return await response.json();
}
```

---

## 🎯 6. Usando Config Helper

**Arquivo**: `src/utils/supabase-helper.ts`

```typescript
import { getEnv, getSupabaseUrl, getSupabaseFunctionsUrl } from '@/config/env';

/**
 * Verificar se Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  return !!url && !!key;
}

/**
 * Obter URL completa de uma Edge Function
 */
export function getEdgeFunctionUrl(functionName: string): string {
  const baseUrl = getSupabaseFunctionsUrl();
  if (!baseUrl) {
    throw new Error('Supabase Functions URL não configurado');
  }
  return `${baseUrl}/${functionName}`;
}

/**
 * Debug: Mostrar configuração (sem expor token completo)
 */
export function getSupabaseConfigDebug() {
  const url = getSupabaseUrl();
  const key = getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  
  return {
    url: url || '[NÃO CONFIGURADO]',
    keyConfigured: key ? `[CONFIGURADO] (${key.substring(0, 20)}...)` : '[NÃO CONFIGURADO]',
    functionsUrl: getSupabaseFunctionsUrl() || '[NÃO CONFIGURADO]',
  };
}
```

---

## 🧪 7. Teste de Conexão

**Arquivo**: `scripts/test-supabase-connection.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Script para testar conexão com Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Teste 1: Health check básico
  console.log('1. Testando health check...');
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('   ⚠️  Conexão OK, mas tabela não existe (schema não aplicado)');
    } else if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    } else {
      console.log('   ✅ Conexão estabelecida com sucesso!');
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Teste 2: Verificar autenticação
  console.log('\n2. Testando autenticação...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`   ⚠️  ${error.message}`);
    } else if (session) {
      console.log(`   ✅ Sessão ativa: ${session.user.email}`);
    } else {
      console.log('   ℹ️  Nenhuma sessão ativa (normal se não logado)');
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
  }

  console.log('\n✅ Teste concluído!');
}

testConnection().catch(console.error);
```

---

## 📝 8. Hook Personalizado para Supabase

**Arquivo**: `src/hooks/useSupabase.ts`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/api/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Hook para gerenciar estado do Supabase
 */
export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError(new Error('Supabase não configurado'));
      setLoading(false);
      return;
    }

    // Obter usuário atual
    async function getInitialUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }

    getInitialUser();

    // Listen para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    supabase, // Expor cliente para uso direto
  };
}
```

---

## ✅ Checklist de Uso

Ao usar o token do Supabase no código:

- [ ] ✅ Verificar se `supabase` não é `null` antes de usar
- [ ] ✅ Tratar erros adequadamente
- [ ] ✅ Usar `getEnv()` do `@/config/env` para acessar variáveis
- [ ] ✅ Não hardcodear URLs ou tokens no código
- [ ] ✅ Usar TypeScript types (`Database` do `@/types/database.types`)
- [ ] ✅ Implementar loading states
- [ ] ✅ Fazer cleanup de subscriptions no `useEffect`

---

**Pronto!** Agora você tem exemplos completos de como usar o token do Supabase em diferentes cenários. 🚀
