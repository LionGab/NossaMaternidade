# 🛠️ Melhores Práticas de Desenvolvimento

> Guia de boas práticas para o projeto Nossa Maternidade

---

## 1. Estrutura de Código

### Organização de Pastas

```
src/
├── agents/          # Agentes de IA especializados
├── ai/              # Configurações de IA, prompts
├── components/      # Componentes React Native
│   ├── atoms/       # Componentes básicos (Button, Text)
│   ├── molecules/   # Composições simples
│   ├── organisms/   # Composições complexas
│   └── primitives/  # Primitivos do design system
├── contexts/        # React Contexts
├── core/            # Funcionalidades core (AI Gateway)
├── hooks/           # Custom hooks
├── navigation/      # Configuração de navegação
├── screens/         # Telas do app
├── services/        # Serviços (Supabase, API)
├── theme/           # Design system, tokens
├── types/           # Tipos TypeScript
└── utils/           # Utilitários gerais
```

### Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Screens** | `*Screen.tsx` | `HomeScreen.tsx` |
| **Components** | `PascalCase.tsx` | `MaternalCard.tsx` |
| **Hooks** | `use*.ts` | `useSession.ts` |
| **Services** | `*Service.ts` | `chatService.ts` |
| **Types** | `*.types.ts` ou `types/*.ts` | `ai.types.ts` |
| **Utils** | `camelCase.ts` | `logger.ts` |

---

## 2. TypeScript

### Regras Obrigatórias

```typescript
// ✅ CORRETO: Tipagem explícita
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: string): Promise<UserProfile> {
  // ...
}

// ❌ ERRADO: Uso de any
function getUser(id: any): any {
  // ...
}
```

### Configuração (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Guards

```typescript
// ✅ CORRETO: Use type guards em vez de any
function isUserProfile(obj: unknown): obj is UserProfile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// Uso
if (isUserProfile(data)) {
  console.log(data.name); // TypeScript sabe que é UserProfile
}
```

---

## 3. React Native / Expo

### Componentes Funcionais

```typescript
// ✅ CORRETO: Functional component com tipagem
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

// ❌ ERRADO: Class component
class Button extends React.Component {
  // ...
}
```

### Hooks Customizados

```typescript
// ✅ CORRETO: Hook com tipagem e loading/error states
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await profileService.getProfile(userId);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [userId]);

  return { profile, isLoading, error };
}
```

### Performance

```typescript
// ✅ CORRETO: Memoização quando necessário
const MemoizedComponent = React.memo(function ExpensiveComponent({ data }) {
  // Renderização cara
});

// ✅ CORRETO: useCallback para funções passadas como props
const handlePress = useCallback(() => {
  // handler
}, [dependency]);

// ✅ CORRETO: useMemo para cálculos caros
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
```

### Listas Virtualizadas

```typescript
// ✅ CORRETO: Use FlashList para listas grandes
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={posts}
  renderItem={({ item }) => <PostCard post={item} />}
  estimatedItemSize={200}
  keyExtractor={(item) => item.id}
/>

// ❌ EVITAR: FlatList para listas muito grandes
// FlatList é ok para listas pequenas (<100 items)
```

---

## 4. Estilização (NativeWind)

### Tokens do Design System

```typescript
// ✅ CORRETO: Usar tokens
import { Tokens, useThemeColors } from '@/theme';

function Card() {
  const colors = useThemeColors();
  
  return (
    <View 
      style={{
        backgroundColor: colors.background.card,
        padding: Tokens.spacing[4],
        borderRadius: Tokens.radius.lg,
      }}
    >
      <Text style={{ color: colors.text.primary }}>
        Conteúdo
      </Text>
    </View>
  );
}

// ❌ ERRADO: Valores hardcoded
<View style={{ backgroundColor: '#FFFFFF', padding: 16 }}>
```

### NativeWind Classes

```typescript
// ✅ CORRETO: Classes Tailwind via NativeWind
<View className="bg-white p-4 rounded-lg shadow-md">
  <Text className="text-gray-900 font-semibold">
    Título
  </Text>
</View>

// ❌ ERRADO: StyleSheet.create misturado com NativeWind
// Escolha um padrão e seja consistente
```

---

## 5. Serviços e API

### Estrutura de Service

```typescript
// src/services/profileService.ts

import { supabase } from './supabase';
import { logger } from '@/utils/logger';
import type { UserProfile } from '@/types';

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('[ProfileService] getProfile failed', { userId, error });
      throw error;
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // ...
  },
};
```

### React Query (TanStack Query)

```typescript
// ✅ CORRETO: Usar React Query para data fetching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }) => profileService.updateProfile(userId, updates),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
```

---

## 6. Logging

### Usar Logger Centralizado

```typescript
// ✅ CORRETO: Usar logger
import { logger } from '@/utils/logger';

logger.info('[ChatService] Mensagem enviada', { messageId, userId });
logger.warn('[AIRouter] Fallback ativado', { from: 'gemini', to: 'gpt4o' });
logger.error('[AuthService] Login falhou', { error, email });

// ❌ ERRADO: console.log
console.log('mensagem enviada');
```

### Níveis de Log

| Nível | Quando Usar |
|-------|-------------|
| `debug` | Detalhes de desenvolvimento |
| `info` | Eventos normais do sistema |
| `warn` | Situações inesperadas não-críticas |
| `error` | Erros que precisam atenção |

---

## 7. Validação

### Zod para Schemas

```typescript
import { z } from 'zod';

// Schema de validação
const UserInputSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().datetime().optional(),
});

type UserInput = z.infer<typeof UserInputSchema>;

// Uso
function validateUserInput(input: unknown): UserInput {
  return UserInputSchema.parse(input);
}
```

---

## 8. Testes

### Estrutura de Testes

```
__tests__/
├── services/
│   ├── authService.test.ts
│   └── chatService.test.ts
├── hooks/
│   └── useSession.test.ts
├── components/
│   └── Button.test.tsx
└── utils/
    └── validation.test.ts
```

### Exemplo de Teste

```typescript
// __tests__/services/chatService.test.ts
import { chatService } from '@/services/chatService';

// Mock do Supabase
jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: mockMessage, error: null }),
    })),
  },
}));

describe('chatService', () => {
  describe('sendMessage', () => {
    it('deve enviar mensagem com sucesso', async () => {
      const result = await chatService.sendMessage({
        sessionId: 'session-123',
        content: 'Olá',
        role: 'user',
      });

      expect(result).toBeDefined();
      expect(result.content).toBe('Olá');
    });

    it('deve lançar erro se Supabase falhar', async () => {
      // ...
    });
  });
});
```

### Coverage Mínimo

| Fase | Cobertura |
|------|-----------|
| MVP | 40% |
| Phase 2 | 60% |
| Final | 80% |

---

## 9. Git e Commits

### Formato de Commit

```bash
# Padrão: type(scope): description

feat(chat): adiciona suporte a áudio
fix(auth): corrige refresh de token
refactor(home): extrai componente HeroCard
docs(readme): atualiza instruções de setup
test(chat): adiciona testes para sendMessage
chore(deps): atualiza expo para 54.0.26
```

### Tipos de Commit

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `docs` | Documentação |
| `test` | Testes |
| `chore` | Tarefas de manutenção |
| `style` | Formatação, espaços em branco |
| `perf` | Otimização de performance |

---

## 10. Segurança

### API Keys

```typescript
// ✅ CORRETO: Usar variáveis de ambiente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

// ❌ ERRADO: Hardcoded
const supabaseUrl = 'https://xxx.supabase.co';
```

### Dados Sensíveis

```typescript
// ✅ CORRETO: Usar SecureStore para dados sensíveis
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('auth_token', token);

// ❌ ERRADO: AsyncStorage para tokens
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('auth_token', token); // NÃO SEGURO
```

### RLS (Row Level Security)

```sql
-- ✅ CORRETO: Sempre usar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- ❌ ERRADO: Tabela sem RLS
-- Qualquer um com a anon key pode acessar tudo
```

---

## 11. Acessibilidade

### Labels e Roles

```typescript
// ✅ CORRETO: Sempre adicionar accessibility props
<TouchableOpacity
  onPress={handlePress}
  accessibilityLabel="Enviar mensagem"
  accessibilityRole="button"
  accessibilityHint="Toque para enviar sua mensagem"
>
  <Icon name="send" />
</TouchableOpacity>

// ❌ ERRADO: Sem acessibilidade
<TouchableOpacity onPress={handlePress}>
  <Icon name="send" />
</TouchableOpacity>
```

### Touch Targets

```typescript
// ✅ CORRETO: Mínimo 44pt para iOS, 48dp para Android
<TouchableOpacity
  style={{ minWidth: 44, minHeight: 44 }}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
```

---

## 12. Performance Checklist

- [ ] Usar `FlashList` em vez de `FlatList` para listas grandes
- [ ] Memoizar componentes pesados com `React.memo`
- [ ] Usar `useCallback` para handlers passados como props
- [ ] Usar `useMemo` para cálculos caros
- [ ] Lazy load de telas com React Navigation
- [ ] Otimizar imagens (compressão, dimensões corretas)
- [ ] Evitar re-renders desnecessários
- [ ] Profile com React DevTools

---

*Documento criado em Dezembro 2025 para o projeto Nossa Maternidade / NathIA*
