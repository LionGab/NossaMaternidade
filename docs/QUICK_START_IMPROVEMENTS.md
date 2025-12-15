# 🚀 Quick Start - Melhorias Implementadas

## Como Usar as Novas Funcionalidades

### 1. Sistema de Toasts

**Substitui**: `alert()`, `console.log()` para feedback ao usuário

```typescript
import { useToast } from "../context/ToastContext";

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess("Dados salvos com sucesso!");
    } catch (error) {
      showError("Erro ao salvar dados");
    }
  };
}
```

### 2. Estados de Loading/Empty/Error

**Substitui**: Estados inconsistentes de loading

```typescript
import { LoadingState, EmptyState, ErrorState } from "../components/ui";

function MyScreen() {
  const { data, loading, error, refetch } = useData();

  if (loading) return <LoadingState message="Carregando..." />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data.length) return <EmptyState title="Nenhum item" onAction={refetch} />;

  return <DataList data={data} />;
}
```

### 3. Skeleton Loaders

**Para**: Placeholders animados durante loading

```typescript
import { ListSkeleton } from "../components/ui";

function PostList() {
  const { posts, loading } = usePosts();

  if (loading) {
    return <ListSkeleton count={5} />;
  }

  return <PostsList posts={posts} />;
}
```

### 4. Acessibilidade

**Para**: WCAG AAA compliance

```typescript
import { buttonAccessibility } from "../utils/accessibility";

<Pressable {...buttonAccessibility("Salvar dados", "Pressione para salvar", disabled)} onPress={handleSave}>
  <Text>Salvar</Text>
</Pressable>;
```

### 5. Retry em APIs

**Para**: Requisições mais resilientes

```typescript
import { retryNetworkRequest } from "../utils/retry";

const data = await retryNetworkRequest(() => fetchPosts());
```

### 6. Hook com Retry Automático

**Para**: APIs com retry e error handling automático

```typescript
import { useApiWithRetry } from "../hooks/useApiWithRetry";
import { getPosts } from "../api/database";

function MyComponent() {
  const { execute, loading, error } = useApiWithRetry(getPosts);

  useEffect(() => {
    execute();
  }, []);
}
```

### 7. Deep Linking

**Já integrado no App.tsx**

Suporta:

- `nossamaternidade://post/123`
- `nossamaternidade://community`
- `nossamaternidade://assistant`
- `nossamaternidade://home`

### 8. Logger Centralizado

**Substitui**: `console.log`

```typescript
import { logger } from "../utils/logger";

logger.info("Operação concluída", "Contexto");
logger.error("Erro ocorreu", "Contexto", error);
```

## Exemplos Práticos

### Exemplo 1: Tela com Loading/Error/Empty

```typescript
import { LoadingState, ErrorState, EmptyState } from "../components/ui";
import { useApiWithRetry } from "../hooks/useApiWithRetry";
import { getPosts } from "../api/database";

export default function PostsScreen() {
  const { execute, loading, error } = useApiWithRetry(getPosts);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    execute().then((data) => {
      if (data) setPosts(data);
    });
  }, []);

  if (loading) return <LoadingState message="Carregando posts..." />;
  if (error) return <ErrorState onRetry={() => execute()} />;
  if (!posts.length) return <EmptyState title="Nenhum post ainda" />;

  return <PostsList posts={posts} />;
}
```

### Exemplo 2: Ação com Toast

```typescript
import { useToast } from "../context/ToastContext";

export default function SaveButton() {
  const { showSuccess, showError } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess("Salvo com sucesso!");
    } catch (error) {
      showError("Erro ao salvar");
    }
  };

  return <Button onPress={handleSave} title="Salvar" />;
}
```

### Exemplo 3: Componente Acessível

```typescript
import { buttonAccessibility } from "../utils/accessibility";

export function MyButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      {...buttonAccessibility(title, "Pressione para executar ação", disabled)}
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}
```

## Migração Rápida

### De `console.log` para `logger`

```typescript
// Antes
console.log("[Context] Message");

// Depois
import { logger } from "../utils/logger";
logger.info("Message", "Context");
```

### De `alert` para `toast`

```typescript
// Antes
alert("Erro ao salvar");

// Depois
import { useToast } from "../context/ToastContext";
const { showError } = useToast();
showError("Erro ao salvar");
```

### De loading inconsistente para LoadingState

```typescript
// Antes
{
  loading && <ActivityIndicator />;
}

// Depois
import { LoadingState } from "../components/ui";
{
  loading && <LoadingState message="Carregando..." />;
}
```

## Checklist de Migração

Para cada tela/componente:

- [ ] Substituir `console.log` por `logger`
- [ ] Substituir `alert` por `toast`
- [ ] Adicionar `LoadingState` em telas assíncronas
- [ ] Adicionar `EmptyState` em listas vazias
- [ ] Adicionar `ErrorState` com retry
- [ ] Adicionar acessibilidade em botões
- [ ] Usar `useApiWithRetry` para APIs

## Próximos Passos

1. Aplicar em todas as telas principais
2. Testar deep linking
3. Verificar acessibilidade com VoiceOver/TalkBack
4. Adicionar mais estados vazios personalizados
