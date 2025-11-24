# 📚 Referência da API

Documentação completa das APIs, serviços e hooks do projeto Nossa Maternidade.

## 🎯 Índice

- [Services](#services)
- [Hooks](#hooks)
- [Utils](#utils)
- [Contexts](#contexts)
- [Types](#types)

---

## Services

### `services/geminiService.ts`

Serviço principal para integração com Google Gemini API.

#### `startChat(message: string, conversationId?: string, thinkingMode?: boolean): Promise<Message>`

Inicia ou continua uma conversa com a NathIA.

**Parâmetros**:
- `message` (string): Mensagem do usuário
- `conversationId` (string, opcional): ID da conversa existente
- `thinkingMode` (boolean, opcional): Usa modo reflexão (Pro) se true

**Retorna**: `Promise<Message>` - Resposta da IA

**Exemplo**:
```typescript
const response = await startChat("Como estou me sentindo?", undefined, true);
```

#### `validateResponse(response: string): boolean`

Valida resposta da API Gemini.

**Parâmetros**:
- `response` (string): Resposta a validar

**Retorna**: `boolean` - true se válida

---

### `services/analytics.ts`

Serviço de analytics e tracking de eventos.

#### `initAnalytics(firebaseConfig?: { measurementId?: string }): Promise<void>`

Inicializa analytics (Firebase opcional).

**Parâmetros**:
- `firebaseConfig` (opcional): Configuração do Firebase

**Exemplo**:
```typescript
await initAnalytics({ measurementId: 'G-XXXXXXXXXX' });
```

#### `trackEvent(event: AnalyticsEvent, properties?: EventProperties): void`

Registra um evento de analytics.

**Parâmetros**:
- `event`: Tipo de evento (enum `AnalyticsEvent`)
- `properties`: Propriedades adicionais do evento

**Exemplo**:
```typescript
trackEvent(AnalyticsEvent.MESSAGE_SENT, { mode: 'fast' });
```

#### `trackView(viewName: string, properties?: EventProperties): void`

Registra abertura de view.

**Parâmetros**:
- `viewName`: Nome da view
- `properties`: Propriedades adicionais

**Exemplo**:
```typescript
trackView('HomeView', { source: 'onboarding' });
```

#### `AnalyticsEvent` (enum)

Eventos disponíveis:
- `ONBOARDING_STARTED`, `ONBOARDING_COMPLETED`
- `LOGIN_STARTED`, `LOGIN_COMPLETED`
- `MESSAGE_SENT`, `MESSAGE_RECEIVED`
- `POST_CREATED`, `POST_APPROVED`
- `HABIT_CREATED`, `HABIT_COMPLETED`
- E mais...

---

### `services/monitoring.ts`

Serviço de monitoramento de performance.

#### `startViewLoad(viewName: string): () => void`

Inicia medição de tempo de carregamento de view.

**Parâmetros**:
- `viewName`: Nome da view

**Retorna**: Função para finalizar medição

**Exemplo**:
```typescript
const endLoad = startViewLoad('HomeView');
// ... carregar view ...
endLoad();
```

#### `startRender(componentName: string): () => void`

Inicia medição de tempo de renderização.

**Parâmetros**:
- `componentName`: Nome do componente

**Retorna**: Função para finalizar medição

**Exemplo**:
```typescript
const endRender = startRender('PostCard');
// ... renderizar ...
endRender();
```

#### `measureFunction<T>(fn: () => Promise<T>, functionName: string): Promise<T>`

Mede tempo de execução de função assíncrona.

**Parâmetros**:
- `fn`: Função a medir
- `functionName`: Nome da função

**Retorna**: Resultado da função

**Exemplo**:
```typescript
const result = await measureFunction(
  () => fetchData(),
  'fetchData'
);
```

#### `startMemoryMonitoring(intervalMs?: number): () => void`

Inicia monitoramento periódico de memória.

**Parâmetros**:
- `intervalMs`: Intervalo em milissegundos (padrão: 30000)

**Retorna**: Função para parar monitoramento

**Exemplo**:
```typescript
const stopMonitoring = startMemoryMonitoring(60000);
// ... mais tarde ...
stopMonitoring();
```

---

## Hooks

### `hooks/useAppState.ts`

Hook principal para gerenciar estado da aplicação.

#### `useAppState(options: { isAuthenticated: boolean; onboardingComplete: boolean })`

Gerencia conversas, mensagens e navegação.

**Parâmetros**:
- `isAuthenticated`: Se usuário está autenticado
- `onboardingComplete`: Se onboarding foi completado

**Retorna**:
```typescript
{
  currentView: View;
  setCurrentView: (view: View) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  handleSendMessage: (message: string) => Promise<void>;
  handleToggleThinkingMode: () => void;
  handleCreateNewConversation: () => void;
  activeConversation: Conversation | null;
  sortedConversations: Conversation[];
}
```

**Exemplo**:
```typescript
const {
  currentView,
  setCurrentView,
  handleSendMessage,
} = useAppState({ isAuthenticated, onboardingComplete });
```

---

### `hooks/useAnalytics.ts`

Hooks para facilitar uso de analytics.

#### `useViewTracking(viewName: string, properties?: Record<string, string | number | boolean>): void`

Hook para tracking automático de view.

**Parâmetros**:
- `viewName`: Nome da view
- `properties`: Propriedades adicionais

**Exemplo**:
```typescript
function HomeView() {
  useViewTracking('HomeView', { source: 'login' });
  // ...
}
```

#### `useAnalytics()`

Hook que retorna funções de tracking.

**Retorna**:
```typescript
{
  track: (event: AnalyticsEvent, properties?: EventProperties) => void;
  trackView: (viewName: string, properties?: EventProperties) => void;
  analytics: AnalyticsService; // Acesso direto ao serviço
}
```

**Exemplo**:
```typescript
function MyComponent() {
  const { track } = useAnalytics();
  
  const handleClick = () => {
    track(AnalyticsEvent.BUTTON_CLICKED, { button: 'submit' });
  };
}
```

#### `usePerformanceTracking(componentName: string): void`

Hook para medir performance de renderização.

**Parâmetros**:
- `componentName`: Nome do componente

**Exemplo**:
```typescript
function ExpensiveComponent() {
  usePerformanceTracking('ExpensiveComponent');
  // ...
}
```

---

### `hooks/useTheme.ts`

Hook para gerenciar tema.

#### `useTheme()`

Retorna tema atual e funções para alterar.

**Retorna**:
```typescript
{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: ThemeColors;
}
```

**Exemplo**:
```typescript
const { theme, toggleTheme, colors } = useTheme();
```

---

### `hooks/useDebounce.ts`

Hook para debounce de valores.

#### `useDebounce<T>(value: T, delay: number): T`

Retorna valor com debounce.

**Parâmetros**:
- `value`: Valor a debounce
- `delay`: Delay em milissegundos

**Exemplo**:
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
```

---

## Utils

### `utils/storage.ts`

Wrapper unificado para storage (AsyncStorage/LocalStorage).

#### `storage.getItem<T>(key: string): Promise<T | null>`

Obtém item do storage.

**Parâmetros**:
- `key`: Chave do item

**Retorna**: Valor ou null

**Exemplo**:
```typescript
const user = await storage.getItem<User>('user');
```

#### `storage.setItem<T>(key: string, value: T): Promise<void>`

Salva item no storage.

**Parâmetros**:
- `key`: Chave do item
- `value`: Valor a salvar

**Exemplo**:
```typescript
await storage.setItem('user', { id: '123', name: 'João' });
```

#### `storage.removeItem(key: string): Promise<void>`

Remove item do storage.

**Parâmetros**:
- `key`: Chave do item

**Exemplo**:
```typescript
await storage.removeItem('user');
```

---

### `utils/logger.ts`

Serviço de logging.

#### `logger.debug(message: string, context?: Record<string, unknown>): void`

Log de debug (apenas em desenvolvimento).

#### `logger.info(message: string, context?: Record<string, unknown>): void`

Log informativo.

#### `logger.warn(message: string, context?: Record<string, unknown>): void`

Log de aviso.

#### `logger.error(message: string, error?: Error, context?: Record<string, unknown>): void`

Log de erro.

**Exemplo**:
```typescript
logger.info('Usuário logado', { userId: '123' });
logger.error('Erro ao carregar dados', error, { context: 'api' });
```

---

### `utils/errorHandler.ts`

Tratamento de erros.

#### `handleError(error: unknown): string`

Trata erro e retorna mensagem amigável.

**Parâmetros**:
- `error`: Erro a tratar

**Retorna**: Mensagem amigável

**Exemplo**:
```typescript
try {
  await apiCall();
} catch (error) {
  const message = handleError(error);
  Alert.alert('Erro', message);
}
```

#### `createAppError(code: ErrorCode, message: string, userMessage: string, context?: Record<string, unknown>, originalError?: Error): AppError`

Cria erro da aplicação.

#### `withErrorHandling<T>(fn: () => Promise<T>, errorMessage: string, context?: Record<string, unknown>): Promise<T | null>`

Wrapper para funções assíncronas com tratamento de erro.

**Exemplo**:
```typescript
const result = await withErrorHandling(
  () => fetchData(),
  'Erro ao carregar dados',
  { userId: '123' }
);
```

---

### `utils/errorTracking.ts`

Error tracking (Sentry opcional).

#### `initErrorTracking(config?: SentryConfig): Promise<void>`

Inicializa error tracking.

**Parâmetros**:
- `config`: Configuração do Sentry (opcional)

**Exemplo**:
```typescript
await initErrorTracking({
  dsn: 'https://...@sentry.io/...',
  environment: 'production'
});
```

#### `trackError(error: Error, context?: Record<string, unknown>): void`

Captura erro.

**Exemplo**:
```typescript
try {
  await apiCall();
} catch (error) {
  trackError(error, { userId: '123' });
}
```

#### `addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): void`

Adiciona breadcrumb (rastro de ações).

**Exemplo**:
```typescript
addBreadcrumb('Usuário clicou em botão', 'user_action', 'info');
```

---

## Contexts

### `contexts/AuthContext.tsx`

Context de autenticação.

#### `useAuth()`

Hook para acessar contexto de autenticação.

**Retorna**:
```typescript
{
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}
```

---

### `contexts/ThemeContext.tsx`

Context de tema.

#### `useThemeContext()`

Hook para acessar contexto de tema.

**Retorna**:
```typescript
{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: ThemeColors;
}
```

---

## Types

### `types.ts`

Definições de tipos principais.

#### `View` (enum)

Views disponíveis:
- `Login`, `SignUp`, `Home`, `Onboarding`
- `NathIA`, `NathIAHistory`
- `RefugioNath`, `MundoNath`
- `Habitos`, `Respirar`, `ImageEdit`

#### `Message`

```typescript
interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: number;
  thinkingMode?: boolean;
}
```

#### `Conversation`

```typescript
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  thinkingMode: boolean;
}
```

---

**Última atualização**: 2024

