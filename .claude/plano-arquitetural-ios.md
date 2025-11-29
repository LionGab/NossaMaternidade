# 📋 PLANO ARQUITETURAL COMPLETO - Nossa Maternidade iOS
**Data:** 2025-11-29
**Objetivo:** Implementar arquitetura offline-first com React Query + Zustand + Real-time

---

## 🎯 ANÁLISE ATUAL

### ✅ O QUE JÁ EXISTE
1. **Autenticação Supabase completa**
   - Email/senha
   - Google OAuth
   - Apple OAuth
   - Magic Link
   - Reset de senha
   - `authService.ts` robusto
   - `AuthContext` com session manager

2. **Database Schema Completo**
   - 13 tabelas principais
   - RLS configurado em todas as tabelas
   - Triggers automáticos (updated_at)
   - Índices otimizados
   - Storage buckets (avatars, content, community)
   - Função de criação automática de perfil

3. **TypeScript Strict Mode**
   - `strict: true`
   - `noImplicitAny: true`
   - Path aliases configurados
   - Types bem definidos em `src/types/`

4. **NativeWind v4.2.1**
   - Tailwind configurado
   - Design System tokens completos
   - Theme system (light/dark)

5. **Services Layer**
   - 21 services implementados
   - Pattern consistente
   - Logger integrado
   - Error handling

6. **Hooks Customizados**
   - `useTheme`
   - `useSession`
   - `useStorage`
   - `useHaptics`

### ❌ O QUE FALTA

1. **React Query (TanStack Query)**
   - Data fetching
   - Cache management
   - Optimistic updates
   - Retry logic

2. **Zustand**
   - State management global
   - Persistência
   - Slices

3. **Real-time Subscriptions**
   - Chat messages
   - Community posts
   - Habit updates
   - Profile changes

4. **Offline-first Architecture**
   - Queue de operações
   - Sync manager
   - Conflict resolution

5. **Migrations Estruturadas**
   - Migrations incrementais
   - Versioning
   - Rollback capability

---

## 🏗️ ARQUITETURA FINAL

```
src/
├── app/                        # 🆕 App entry
│   └── _layout.tsx             # Root layout
│
├── screens/                    # ✅ Já existe (33 screens)
│   ├── HomeScreen.tsx
│   ├── ChatScreen.tsx
│   └── ...
│
├── components/                 # ✅ Já existe
│   ├── primitives/             # Design System base
│   ├── ChatBubble.tsx
│   └── ...
│
├── navigation/                 # ✅ Já existe
│   └── RootNavigator.tsx
│
├── services/                   # ✅ Já existe (21 services)
│   ├── authService.ts          # ✅ Completo
│   ├── chatService.ts          # 🔄 Adicionar React Query
│   ├── profileService.ts       # 🔄 Adicionar React Query
│   ├── habitsService.ts        # 🔄 Adicionar React Query
│   ├── feedService.ts          # 🔄 Adicionar React Query
│   ├── communityService.ts     # 🔄 Adicionar React Query
│   ├── milestonesService.ts    # 🔄 Adicionar React Query
│   │
│   ├── realtime/               # 🆕 Real-time layer
│   │   ├── chatRealtime.ts
│   │   ├── communityRealtime.ts
│   │   └── habitsRealtime.ts
│   │
│   └── offline/                # 🆕 Offline layer
│       ├── queueManager.ts
│       ├── syncManager.ts
│       └── conflictResolver.ts
│
├── store/                      # 🆕 Zustand stores
│   ├── index.ts                # Root store
│   ├── slices/
│   │   ├── authSlice.ts        # Auth state
│   │   ├── chatSlice.ts        # Chat state
│   │   ├── profileSlice.ts     # Profile state
│   │   ├── habitsSlice.ts      # Habits state
│   │   ├── feedSlice.ts        # Feed state
│   │   ├── communitySlice.ts   # Community state
│   │   └── offlineSlice.ts     # Offline queue
│   │
│   └── middleware/
│       └── persistMiddleware.ts
│
├── hooks/                      # ✅ Já existe (4 hooks)
│   ├── useTheme.ts             # ✅ Completo
│   ├── useSession.ts           # ✅ Completo
│   ├── useStorage.ts           # ✅ Completo
│   ├── useHaptics.ts           # ✅ Completo
│   │
│   ├── queries/                # 🆕 React Query hooks
│   │   ├── useAuthQuery.ts
│   │   ├── useChatQuery.ts
│   │   ├── useProfileQuery.ts
│   │   ├── useHabitsQuery.ts
│   │   ├── useFeedQuery.ts
│   │   ├── useCommunityQuery.ts
│   │   └── useMilestonesQuery.ts
│   │
│   ├── mutations/              # 🆕 React Query mutations
│   │   ├── useAuthMutation.ts
│   │   ├── useChatMutation.ts
│   │   ├── useProfileMutation.ts
│   │   ├── useHabitsMutation.ts
│   │   ├── useFeedMutation.ts
│   │   └── useCommunityMutation.ts
│   │
│   └── realtime/               # 🆕 Real-time hooks
│       ├── useChatRealtime.ts
│       ├── useCommunityRealtime.ts
│       └── useHabitsRealtime.ts
│
├── contexts/                   # ✅ Já existe
│   ├── AuthContext.tsx         # ✅ Completo
│   ├── AgentsContext.tsx       # ✅ Completo
│   └── QueryProvider.tsx       # 🆕 React Query provider
│
├── types/                      # ✅ Já existe (10 arquivos)
│   ├── user.ts
│   ├── chat.ts
│   ├── community.ts
│   └── ...
│
├── theme/                      # ✅ Já existe
│   └── tokens.ts
│
└── utils/                      # ✅ Já existe
    ├── logger.ts               # ✅ Completo
    └── ...

supabase/
├── migrations/                 # 🔄 Reestruturar
│   ├── 00000000000000_initial_schema.sql       # 🆕 Schema base
│   ├── 00000000000001_add_rls_policies.sql     # 🆕 RLS policies
│   ├── 00000000000002_add_indexes.sql          # 🆕 Índices
│   ├── 00000000000003_add_storage_buckets.sql  # 🆕 Storage
│   ├── 00000000000004_add_triggers.sql         # 🆕 Triggers
│   ├── 20250126000000_add_onboarding_fields.sql # ✅ Já existe
│   └── 20250126_check_in_logs.sql              # ✅ Já existe
│
├── functions/                  # ✅ Já existe
│   ├── chat-ai/
│   ├── analyze-emotion/
│   └── moderate-content/
│
└── seed.sql                    # ✅ Já existe
```

---

## 📦 DEPENDÊNCIAS A ADICIONAR

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.62.3",
    "zustand": "^5.0.2",
    "immer": "^10.1.1"
  },
  "devDependencies": {
    "@tanstack/eslint-plugin-query": "^5.62.0"
  }
}
```

---

## 🗄️ MIGRATIONS ESTRUTURADAS

### Migration 1: Initial Schema
**Arquivo:** `supabase/migrations/00000000000000_initial_schema.sql`

```sql
-- Tables básicas
CREATE TABLE IF NOT EXISTS public.profiles (...);
CREATE TABLE IF NOT EXISTS public.chat_conversations (...);
CREATE TABLE IF NOT EXISTS public.chat_messages (...);
CREATE TABLE IF NOT EXISTS public.content_items (...);
CREATE TABLE IF NOT EXISTS public.user_content_interactions (...);
CREATE TABLE IF NOT EXISTS public.habits (...);
CREATE TABLE IF NOT EXISTS public.user_habits (...);
CREATE TABLE IF NOT EXISTS public.habit_logs (...);
CREATE TABLE IF NOT EXISTS public.community_posts (...);
CREATE TABLE IF NOT EXISTS public.community_comments (...);
CREATE TABLE IF NOT EXISTS public.community_likes (...);
CREATE TABLE IF NOT EXISTS public.baby_milestones (...);
CREATE TABLE IF NOT EXISTS public.user_baby_milestones (...);
CREATE TABLE IF NOT EXISTS public.check_in_logs (...);
```

### Migration 2: RLS Policies
**Arquivo:** `supabase/migrations/00000000000001_add_rls_policies.sql`

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ... todas as policies
```

### Migration 3: Indexes
**Arquivo:** `supabase/migrations/00000000000002_add_indexes.sql`

```sql
-- Performance indexes
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
-- ... todos os índices
```

### Migration 4: Storage Buckets
**Arquivo:** `supabase/migrations/00000000000003_add_storage_buckets.sql`

```sql
-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- ... storage policies
```

### Migration 5: Triggers & Functions
**Arquivo:** `supabase/migrations/00000000000004_add_triggers.sql`

```sql
-- Trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column() ...;
CREATE OR REPLACE FUNCTION public.handle_new_user() ...;
```

---

## 🎛️ ZUSTAND STORE STRUCTURE

### Root Store
**Arquivo:** `src/store/index.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { immer } from 'zustand/middleware/immer';

import { AuthSlice, createAuthSlice } from './slices/authSlice';
import { ChatSlice, createChatSlice } from './slices/chatSlice';
import { ProfileSlice, createProfileSlice } from './slices/profileSlice';
import { HabitsSlice, createHabitsSlice } from './slices/habitsSlice';
import { FeedSlice, createFeedSlice } from './slices/feedSlice';
import { CommunitySlice, createCommunitySlice } from './slices/communitySlice';
import { OfflineSlice, createOfflineSlice } from './slices/offlineSlice';

export type RootStore =
  & AuthSlice
  & ChatSlice
  & ProfileSlice
  & HabitsSlice
  & FeedSlice
  & CommunitySlice
  & OfflineSlice;

export const useStore = create<RootStore>()(
  persist(
    immer((...a) => ({
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
      ...createProfileSlice(...a),
      ...createHabitsSlice(...a),
      ...createFeedSlice(...a),
      ...createCommunitySlice(...a),
      ...createOfflineSlice(...a),
    })),
    {
      name: 'nossa-maternidade-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persistir apenas o necessário
        auth: state.auth,
        profile: state.profile,
        offlineQueue: state.offlineQueue,
      }),
    }
  )
);
```

### Auth Slice
**Arquivo:** `src/store/slices/authSlice.ts`

```typescript
import type { StateCreator } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { RootStore } from '../index';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export type AuthSlice = {
  auth: AuthState;
} & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
};

export const createAuthSlice: StateCreator<
  RootStore,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set) => ({
  auth: initialState,

  setUser: (user) => set((state) => {
    state.auth.user = user;
    state.auth.isAuthenticated = !!user;
  }),

  setSession: (session) => set((state) => {
    state.auth.session = session;
    state.auth.isAuthenticated = !!session;
  }),

  setLoading: (loading) => set((state) => {
    state.auth.isLoading = loading;
  }),

  logout: () => set((state) => {
    state.auth = initialState;
  }),
});
```

### Offline Slice
**Arquivo:** `src/store/slices/offlineSlice.ts`

```typescript
import type { StateCreator } from 'zustand';
import type { RootStore } from '../index';

export interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
  error?: string;
}

export interface OfflineState {
  isOnline: boolean;
  queue: OfflineOperation[];
  isSyncing: boolean;
}

export interface OfflineActions {
  setOnline: (online: boolean) => void;
  addToQueue: (operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'retries'>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setSyncing: (syncing: boolean) => void;
  incrementRetries: (id: string) => void;
}

export type OfflineSlice = {
  offline: OfflineState;
} & OfflineActions;

export const createOfflineSlice: StateCreator<
  RootStore,
  [['zustand/immer', never]],
  [],
  OfflineSlice
> = (set) => ({
  offline: {
    isOnline: true,
    queue: [],
    isSyncing: false,
  },

  setOnline: (online) => set((state) => {
    state.offline.isOnline = online;
  }),

  addToQueue: (operation) => set((state) => {
    state.offline.queue.push({
      ...operation,
      id: `op_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    });
  }),

  removeFromQueue: (id) => set((state) => {
    state.offline.queue = state.offline.queue.filter(op => op.id !== id);
  }),

  clearQueue: () => set((state) => {
    state.offline.queue = [];
  }),

  setSyncing: (syncing) => set((state) => {
    state.offline.isSyncing = syncing;
  }),

  incrementRetries: (id) => set((state) => {
    const op = state.offline.queue.find(o => o.id === id);
    if (op) {
      op.retries += 1;
    }
  }),
});
```

---

## ⚡ REACT QUERY SETUP

### Query Provider
**Arquivo:** `src/contexts/QueryProvider.tsx`

```typescript
import React from 'react';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useStore } from '@/store';

// Query Client com configuração otimizada
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 1000 * 60 * 5,
      // Garbage collection após 10 minutos
      gcTime: 1000 * 60 * 10,
      // Retry 3 vezes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch em foco
      refetchOnWindowFocus: true,
      // Refetch em reconnect
      refetchOnReconnect: true,
      // Network mode: offlineFirst
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setOnline = useStore((state) => state.setOnline);

  React.useEffect(() => {
    // Setup app state focus manager
    const subscription = AppState.addEventListener('change', (status) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    // Setup network state listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected ?? false);
      queryClient.setOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, [setOnline]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Profile Query Hook
**Arquivo:** `src/hooks/queries/useProfileQuery.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import type { UserProfile, UpdateProfileData } from '@/services/profileService';
import { useStore } from '@/store';

// Query keys
export const profileKeys = {
  all: ['profiles'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  byId: (id: string) => [...profileKeys.all, id] as const,
};

// Query: Get current profile
export const useCurrentProfile = () => {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => profileService.getCurrentProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Query: Get profile by ID
export const useProfileById = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.byId(userId),
    queryFn: () => profileService.getProfileById(userId),
    enabled: !!userId,
  });
};

// Mutation: Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const addToQueue = useStore((state) => state.addToQueue);
  const isOnline = useStore((state) => state.offline.isOnline);

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      // Se offline, adiciona à fila
      if (!isOnline) {
        addToQueue({
          type: 'update',
          table: 'profiles',
          data,
        });
        throw new Error('Offline - operação adicionada à fila');
      }

      return profileService.updateProfile(data);
    },

    // Optimistic update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.current() });

      const previous = queryClient.getQueryData<UserProfile>(profileKeys.current());

      queryClient.setQueryData<UserProfile>(profileKeys.current(), (old) => {
        if (!old) return old;
        return { ...old, ...newData };
      });

      return { previous };
    },

    // Rollback em erro
    onError: (err, newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(profileKeys.current(), context.previous);
      }
    },

    // Invalidar cache em sucesso
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
};
```

### Chat Query Hook
**Arquivo:** `src/hooks/queries/useChatQuery.ts`

```typescript
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ChatConversation, ChatMessage, SendMessageData } from '@/services/chatService';

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};

// Query: Get conversations
export const useConversations = () => {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatService.getConversations(50),
  });
};

// Query: Get messages (infinite)
export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam = 0 }) =>
      chatService.getMessages(conversationId, {
        offset: pageParam,
        limit: 50
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 50) return undefined;
      return pages.length * 50;
    },
    enabled: !!conversationId,
  });
};

// Mutation: Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageData) =>
      chatService.sendMessageWithAI(data.conversation_id, data.content),

    // Optimistic update
    onMutate: async ({ conversation_id, content }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(conversation_id)
      });

      const previous = queryClient.getQueryData(chatKeys.messages(conversation_id));

      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        conversation_id,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        chatKeys.messages(conversation_id),
        (old: any) => {
          if (!old) return { pages: [[tempMessage]], pageParams: [0] };
          return {
            ...old,
            pages: [[tempMessage, ...old.pages[0]], ...old.pages.slice(1)],
          };
        }
      );

      return { previous };
    },

    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          chatKeys.messages(variables.conversation_id),
          context.previous
        );
      }
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.conversation_id)
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations()
      });
    },
  });
};
```

---

## 📡 REAL-TIME SUBSCRIPTIONS

### Chat Realtime Service
**Arquivo:** `src/services/realtime/chatRealtime.ts`

```typescript
import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { ChatMessage } from '../chatService';
import { logger } from '@/utils/logger';

export class ChatRealtimeService {
  private channel: RealtimeChannel | null = null;

  /**
   * Subscribe to chat messages
   */
  subscribeToMessages(
    conversationId: string,
    onNewMessage: (message: ChatMessage) => void,
    onError?: (error: Error) => void
  ) {
    this.channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.debug('[ChatRealtime] New message', payload);
          onNewMessage(payload.new as ChatMessage);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('[ChatRealtime] Subscribed to', conversationId);
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('[ChatRealtime] Channel error');
          onError?.(new Error('Channel error'));
        }
      });

    return () => this.unsubscribe();
  }

  /**
   * Unsubscribe from chat messages
   */
  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      logger.info('[ChatRealtime] Unsubscribed');
    }
  }
}

export const chatRealtimeService = new ChatRealtimeService();
```

### Chat Realtime Hook
**Arquivo:** `src/hooks/realtime/useChatRealtime.ts`

```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatRealtimeService } from '@/services/realtime/chatRealtime';
import { chatKeys } from '@/hooks/queries/useChatQuery';
import type { ChatMessage } from '@/services/chatService';

export const useChatRealtime = (conversationId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = (message: ChatMessage) => {
      // Atualiza cache do React Query
      queryClient.setQueryData(
        chatKeys.messages(conversationId),
        (old: any) => {
          if (!old) return { pages: [[message]], pageParams: [0] };

          // Verifica se mensagem já existe
          const exists = old.pages[0].some((m: ChatMessage) => m.id === message.id);
          if (exists) return old;

          // Adiciona nova mensagem no início
          return {
            ...old,
            pages: [[message, ...old.pages[0]], ...old.pages.slice(1)],
          };
        }
      );
    };

    const unsubscribe = chatRealtimeService.subscribeToMessages(
      conversationId,
      handleNewMessage
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, queryClient]);
};
```

---

## 🔄 OFFLINE-FIRST SYSTEM

### Queue Manager
**Arquivo:** `src/services/offline/queueManager.ts`

```typescript
import NetInfo from '@react-native-community/netinfo';
import { useStore } from '@/store';
import { logger } from '@/utils/logger';

export class QueueManager {
  private isProcessing = false;

  /**
   * Process offline queue when online
   */
  async processQueue() {
    const { offline, removeFromQueue, incrementRetries } = useStore.getState();

    if (this.isProcessing || !offline.isOnline || offline.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    logger.info('[QueueManager] Processing queue', { count: offline.queue.length });

    for (const operation of offline.queue) {
      try {
        // Max 3 tentativas
        if (operation.retries >= 3) {
          logger.warn('[QueueManager] Max retries reached', operation);
          removeFromQueue(operation.id);
          continue;
        }

        await this.processOperation(operation);
        removeFromQueue(operation.id);
        logger.info('[QueueManager] Operation processed', operation.id);
      } catch (error) {
        logger.error('[QueueManager] Operation failed', error);
        incrementRetries(operation.id);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Process single operation
   */
  private async processOperation(operation: any) {
    const { supabase } = await import('../supabase');

    switch (operation.type) {
      case 'create':
        await supabase.from(operation.table).insert(operation.data);
        break;

      case 'update':
        await supabase.from(operation.table).update(operation.data).eq('id', operation.data.id);
        break;

      case 'delete':
        await supabase.from(operation.table).delete().eq('id', operation.data.id);
        break;
    }
  }

  /**
   * Initialize queue manager
   */
  init() {
    // Process queue on reconnect
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.processQueue();
      }
    });
  }
}

export const queueManager = new QueueManager();
```

### Sync Manager
**Arquivo:** `src/services/offline/syncManager.ts`

```typescript
import { queryClient } from '@/contexts/QueryProvider';
import { queueManager } from './queueManager';
import { logger } from '@/utils/logger';

export class SyncManager {
  /**
   * Sync all data
   */
  async syncAll() {
    logger.info('[SyncManager] Starting full sync');

    try {
      // 1. Process offline queue
      await queueManager.processQueue();

      // 2. Invalidate all queries to refetch
      await queryClient.invalidateQueries();

      logger.info('[SyncManager] Sync completed');
    } catch (error) {
      logger.error('[SyncManager] Sync failed', error);
      throw error;
    }
  }

  /**
   * Sync specific entity
   */
  async syncEntity(queryKey: string[]) {
    logger.info('[SyncManager] Syncing entity', queryKey);

    try {
      await queryClient.invalidateQueries({ queryKey });
      logger.info('[SyncManager] Entity synced', queryKey);
    } catch (error) {
      logger.error('[SyncManager] Entity sync failed', error);
      throw error;
    }
  }
}

export const syncManager = new SyncManager();
```

---

## 🎯 IMPLEMENTAÇÃO STEP-BY-STEP

### FASE 1: Setup Base (30min)
1. ✅ Instalar dependências
   ```bash
   npm install @tanstack/react-query zustand immer
   npm install --save-dev @tanstack/eslint-plugin-query
   ```

2. ✅ Criar estrutura de pastas
   ```bash
   mkdir -p src/store/slices src/store/middleware
   mkdir -p src/hooks/queries src/hooks/mutations src/hooks/realtime
   mkdir -p src/services/realtime src/services/offline
   ```

### FASE 2: Zustand Store (1h)
1. ✅ Criar slices
   - authSlice.ts
   - chatSlice.ts
   - profileSlice.ts
   - habitsSlice.ts
   - feedSlice.ts
   - communitySlice.ts
   - offlineSlice.ts

2. ✅ Criar root store
   - store/index.ts

3. ✅ Configurar persistência
   - middleware/persistMiddleware.ts

### FASE 3: React Query Setup (1h)
1. ✅ Criar QueryProvider
   - contexts/QueryProvider.tsx

2. ✅ Integrar no App.tsx
   ```tsx
   <QueryProvider>
     <AuthProvider>
       {/* ... */}
     </AuthProvider>
   </QueryProvider>
   ```

3. ✅ Criar query hooks base
   - useProfileQuery.ts
   - useChatQuery.ts
   - useHabitsQuery.ts

### FASE 4: Real-time (1.5h)
1. ✅ Criar realtime services
   - chatRealtime.ts
   - communityRealtime.ts
   - habitsRealtime.ts

2. ✅ Criar realtime hooks
   - useChatRealtime.ts
   - useCommunityRealtime.ts
   - useHabitsRealtime.ts

3. ✅ Integrar nos screens

### FASE 5: Offline-first (2h)
1. ✅ Criar offline services
   - queueManager.ts
   - syncManager.ts
   - conflictResolver.ts

2. ✅ Integrar com mutations
3. ✅ Adicionar network listener
4. ✅ Testar queue processing

### FASE 6: Migrations (1h)
1. ✅ Reestruturar migrations
   - Criar migrations incrementais
   - Mover schema.sql para migrations/00000000000000_initial_schema.sql

2. ✅ Criar migration script
   ```bash
   supabase db reset
   ```

### FASE 7: Otimizações (1h)
1. ✅ Adicionar error boundaries
2. ✅ Melhorar loading states
3. ✅ Implementar retry logic
4. ✅ Adicionar analytics

### FASE 8: Testes (1h)
1. ✅ Testar offline mode
2. ✅ Testar queue processing
3. ✅ Testar real-time sync
4. ✅ Testar optimistic updates

---

## ✅ CHECKLIST FINAL

- [ ] React Query instalado e configurado
- [ ] Zustand instalado e configurado
- [ ] Store slices criados
- [ ] Query hooks criados
- [ ] Mutation hooks criados
- [ ] Real-time subscriptions implementadas
- [ ] Offline queue implementado
- [ ] Sync manager implementado
- [ ] Migrations reestruturadas
- [ ] Network listener configurado
- [ ] Optimistic updates funcionando
- [ ] Error handling robusto
- [ ] Testes de offline/online
- [ ] Documentação atualizada

---

## 📊 ESTIMATIVA TOTAL
**Tempo estimado:** 8-10 horas
**Complexidade:** Média-Alta
**Impacto:** Alto (arquitetura completa)

---

## 🚀 PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. **Performance Monitoring**
   - Adicionar analytics
   - Monitorar cache hits
   - Otimizar queries lentas

2. **UX Improvements**
   - Skeleton screens
   - Better error states
   - Retry UI

3. **Advanced Features**
   - Background sync
   - Push notifications
   - Conflict resolution UI

---

**Fim do Plano Arquitetural** 🎉
