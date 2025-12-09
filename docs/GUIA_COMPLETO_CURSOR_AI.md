# 🎓 Guia Completo e Didático: Cursor AI para Desenvolvedores

> **Para quem é:** Desenvolvedores que querem dominar o Cursor AI e multiplicar sua produtividade
> **Tempo de leitura:** 15 minutos
> **Nível:** Iniciante ao Avançado

---

## 📚 Índice

1. [O que é o Cursor AI](#o-que-é-o-cursor-ai)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [4 Modos de Interação](#4-modos-de-interação)
4. [Sistema de Símbolos @ e #](#sistema-de-símbolos)
5. [Composer: A Arma Secreta](#composer-a-arma-secreta)
6. [Prompts Eficientes](#prompts-eficientes)
7. [Workflows Práticos](#workflows-práticos)
8. [Recursos Avançados](#recursos-avançados)
9. [Dicas e Truques](#dicas-e-truques)
10. [Troubleshooting](#troubleshooting)

---

## 🤖 O que é o Cursor AI

### Definição

Cursor é um **editor de código baseado em VS Code** com IA integrada nativamente. Não é apenas uma extensão - é um editor completamente refeito para desenvolvimento assistido por IA.

### VS Code vs Cursor

| Aspecto                | VS Code + Copilot         | Cursor AI             |
| ---------------------- | ------------------------- | --------------------- |
| **Base**               | Editor oficial Microsoft  | Fork do VS Code       |
| **IA**                 | Extensão (GitHub Copilot) | Nativa e integrada    |
| **Múltiplos arquivos** | Sequencial, manual        | Automático (Composer) |
| **Contexto**           | Limitado ao arquivo       | Todo o projeto        |
| **Busca semântica**    | Não                       | Sim (@Codebase)       |
| **Pesquisa web**       | Não                       | Sim (@Web)            |
| **Edição em lote**     | Manual                    | Automática            |
| **Preço**              | $10/mês (Copilot)         | $20/mês (Pro)         |

### Modelos Disponíveis

- **Claude 3.5 Sonnet** (padrão, melhor) ⭐
- GPT-4o (OpenAI)
- Claude 3 Opus (projetos longos)
- Gemini 1.5 Pro (Google)
- Modelos locais (Ollama)

---

## ⚙️ Instalação e Configuração

### 1. Instalação Básica

```bash
# Windows
# Baixe de: https://cursor.sh
# Instale normalmente

# macOS
brew install --cask cursor

# Linux
# Download .AppImage ou .deb de cursor.sh
```

### 2. Migração do VS Code

Cursor importa automaticamente:

- ✅ Todas suas extensões
- ✅ Configurações (settings.json)
- ✅ Atalhos de teclado
- ✅ Temas
- ✅ Snippets

```
Cursor > File > Preferences > Import from VS Code
```

### 3. Configuração Inicial

**Settings (Ctrl+,)**

```json
{
  // IA
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.temperature": 0.3,
  "cursor.cmdk.useTheNewCMDK": true,

  // Composer
  "cursor.composer.enabled": true,
  "cursor.composer.autoApply": false, // Revisar antes de aplicar

  // Privacy
  "cursor.privacy.enableTelemetry": false,
  "cursor.aiCode": "enabled", // ou "disabled" para trabalho sensível

  // Context
  "cursor.contextWindow.maxTokens": 100000,
  "cursor.alwaysInclude": ["tsconfig.json", "package.json", "tailwind.config.js"]
}
```

### 4. Atalhos Essenciais

| Atalho                     | Ação             | Descrição                |
| -------------------------- | ---------------- | ------------------------ |
| `Ctrl+L`                   | **Cursor Chat**  | Abre chat lateral        |
| `Ctrl+K`                   | **Inline Edit**  | Edita código selecionado |
| `Ctrl+I` ou `Ctrl+Shift+I` | **Composer**     | Multi-arquivo poderoso   |
| `Tab`                      | Aceitar sugestão | Autocomplete             |
| `Alt+]`                    | Próxima sugestão | Navega sugestões         |
| `Esc`                      | Rejeitar         | Cancela IA               |
| `Ctrl+/`                   | Toggle comment   | Com contexto IA          |

---

## 💬 4 Modos de Interação

### 1. 🗣️ Cursor Chat (`Ctrl+L`)

**Para que serve:**

- Perguntas sobre o projeto
- Planejamento de features
- Debugging
- Explicações de código
- Comandos únicos

**Quando usar:**

- ✅ "Onde fica a função de autenticação?"
- ✅ "Explique o fluxo de dados desta tela"
- ✅ "Como implementar dark mode aqui?"
- ✅ "Rode os testes"

**Exemplo prático:**

```
Você: @codebase onde definimos as cores do tema?

Cursor: Encontrei em src/theme/colors.ts:
[mostra o arquivo]

Você: adicione uma cor 'success' verde

Cursor: [edita o arquivo automaticamente]
```

**Dica:** Use para **planejar** antes de implementar.

---

### 2. ✏️ Inline Edit (`Ctrl+K`)

**Para que serve:**

- Editar função específica
- Refatorar código selecionado
- Adicionar funcionalidade pontual
- Corrigir bugs localizados

**Quando usar:**

- ✅ Selecione uma função → `Ctrl+K` → "adicione validação de email"
- ✅ Selecione JSX → `Ctrl+K` → "adicione loading state"
- ✅ Selecione loop → `Ctrl+K` → "otimize para performance"

**Exemplo passo a passo:**

```typescript
// 1. Você tem este código
const handleLogin = (email, password) => {
  login(email, password);
};

// 2. Selecione a função inteira
// 3. Pressione Ctrl+K
// 4. Digite: "adicione try-catch, validação e loading state"
// 5. Cursor gera:

const handleLogin = async (email: string, password: string) => {
  if (!email || !password) {
    Alert.alert('Erro', 'Preencha todos os campos');
    return;
  }

  setLoading(true);
  try {
    await login(email, password);
  } catch (error) {
    Alert.alert('Erro', error.message);
  } finally {
    setLoading(false);
  }
};
```

**Dica:** Seja específico no que quer mudar.

---

### 3. 🎼 Composer (`Ctrl+Shift+I` ou `Ctrl+I`)

**🔥 O MODO MAIS PODEROSO DO CURSOR**

**Para que serve:**

- Criar features completas (múltiplos arquivos)
- Refatorações massivas
- Implementar arquiteturas
- Mudanças que afetam vários arquivos

**Quando usar:**

- ✅ "Crie sistema de notificações completo"
- ✅ "Implemente autenticação com Supabase (service, context, screens)"
- ✅ "Refatore todos os componentes para TypeScript strict"
- ✅ "Adicione dark mode em todo o app"

**Como funciona:**

1. **Você descreve** a feature completa
2. **Cursor analisa** o projeto inteiro
3. **Cursor lista** os arquivos que vai criar/editar
4. **Você revisa** antes de aplicar
5. **Cursor aplica** tudo de uma vez

**Exemplo completo:**

```
Você no Composer (Ctrl+Shift+I):

"Crie sistema completo de favoritos:

1. Backend:
   - Adicione tabela 'favorites' no Supabase com user_id e article_id
   - Crie índices e RLS policies

2. Service:
   - Crie src/services/FavoritesService.ts
   - Métodos: addFavorite, removeFavorite, getFavorites, isFavorite

3. Hook:
   - Crie src/hooks/useFavorites.ts
   - Gerencie estado local e sync com Supabase

4. UI:
   - Adicione botão de coração nos ArticleCards
   - Crie tela FavoritesScreen em src/screens/
   - Adicione rota no navigation

5. Estilo:
   - Use Tailwind/NativeWind
   - Animação no toggle do favorito

Siga os padrões do projeto @codebase"
```

**Cursor responderá:**

```
Vou criar os seguintes arquivos:
✓ supabase/migrations/20241209_favorites.sql
✓ src/services/FavoritesService.ts
✓ src/hooks/useFavorites.ts
✓ src/components/FavoriteButton.tsx
✓ src/screens/FavoritesScreen.tsx

E modificar:
✓ src/navigation/AppNavigator.tsx
✓ src/components/ArticleCard.tsx

[Mostra preview das mudanças]

Aplicar? [Sim] [Não] [Revisar]
```

**Dica:** Composer é como ter um desenvolvedor júnior fazendo o trabalho braçal.

---

### 4. 🤖 Autocomplete (Tab)

**Para que serve:**

- Completar código enquanto digita
- Gerar boilerplate
- Prever próximas linhas

**Quando usar:**

- ✅ Sempre! Está sempre ativo
- ✅ Escreva comentário, ele gera código
- ✅ Comece a digitar, ele completa

**Exemplo:**

```typescript
// Você digita:
// função para validar CPF brasileiro

// Pressiona Enter, Cursor sugere:
function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  // Valida dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  // ... resto da validação
}

// Você pressiona Tab para aceitar
```

**Dica:** Escreva comentários descritivos para guiar o autocomplete.

---

## 🏷️ Sistema de Símbolos @ e

### Símbolos @ - Adicionar Contexto

#### **@Codebase** - Busca semântica no projeto

```
@codebase onde usamos AsyncStorage?
@codebase encontre todos os componentes de botão
@codebase como funciona a navegação?
@codebase liste todas as funções de API
@codebase onde tratamos erros de autenticação?
```

**Como funciona:** IA lê todo o código e busca semanticamente (entende significado, não só palavras).

#### **@File** - Contexto de arquivo específico

```
@file:src/services/AuthService.ts explique cada método
@file:App.tsx adicione provider de tema
@file:package.json atualize dependências desatualizadas
```

**Atalho:** Digite `@` e comece a digitar o nome do arquivo.

#### **@Folder** - Contexto de pasta inteira

```
@folder:src/components/ liste todos os componentes
@folder:src/screens/ refatore para usar TypeScript strict
@folder:src/hooks/ documente todos os hooks
@folder:__tests__/ rode todos os testes
```

#### **@Web** - Pesquisa na internet

```
@web react native performance best practices 2024
@web expo notifications setup guide
@web tailwind responsive design patterns
@web supabase realtime subscriptions
@web como implementar biometria no react native
```

**Quando usar:** Para soluções atualizadas, libraries novas, best practices.

#### **@Docs** - Documentação oficial

```
@docs expo-router navigation
@docs react-native flatlist props
@docs supabase auth
@docs typescript utility types
```

**Vantagem:** Respostas baseadas na documentação oficial atualizada.

#### **@Git** - Histórico do repositório

```
@git o que mudou nos últimos 3 commits?
@git diff entre main e minha branch
@git quem escreveu esta função?
@git mudanças não commitadas
@git histórico do arquivo AuthService.ts
```

#### **@Definitions** - Vai para definição

```
@definitions UserType
@definitions navegação
@definitions API endpoints
```

### Símbolos # - Referenciar

#### **#File** - Referenciar arquivo

```
Refatore #UserScreen.tsx para usar o padrão de #HomeScreen.tsx
Copie o estilo de #Button.tsx para #Card.tsx
#package.json adicione script de build
```

#### **#Selection** - Código selecionado

```
[Selecione código] → Chat → "otimize #selection"
[Selecione função] → "adicione testes para #selection"
[Selecione componente] → "converta #selection para TypeScript"
```

### Combinando Símbolos

```
"Seguindo o padrão de @folder:src/services/,
crie PushNotificationService.ts e integre em @file:App.tsx.
Consulte @docs expo-notifications e @web best practices"
```

---

## 🎼 Composer: A Arma Secreta

### O que torna o Composer especial?

1. **Multi-arquivo simultâneo** - Edita 10+ arquivos de uma vez
2. **Context-aware** - Entende relações entre arquivos
3. **Preview antes de aplicar** - Você revisa tudo
4. **Desfazer fácil** - `Ctrl+Z` funciona em tudo
5. **Iterativo** - Pode refinar após aplicar

### Anatomia de um bom prompt para Composer

```
[CONTEXTO]
Estamos criando um app de maternidade com React Native + Expo

[OBJETIVO]
Implementar sistema de agendamento de consultas

[REQUISITOS DETALHADOS]
1. Backend (Supabase):
   - Tabela 'appointments' com campos: id, user_id, doctor_id, date, time, type, status
   - RLS policies para usuários verem só suas consultas
   - Função para verificar conflitos de horário

2. Service Layer:
   - AppointmentService.ts com CRUD completo
   - Validação de datas futuras
   - Integração com Supabase

3. State Management:
   - Hook useAppointments com cache local
   - Estados: loading, error, appointments
   - Refresh automático

4. UI Components:
   - AppointmentCard (mostra consulta)
   - DateTimePicker (escolher data/hora)
   - DoctorSelector (lista médicos)

5. Screens:
   - AppointmentsListScreen (lista consultas)
   - CreateAppointmentScreen (criar nova)
   - AppointmentDetailScreen (detalhes + cancelar)

6. Navigation:
   - Adicionar rotas no AppNavigator
   - Deep links para notificações

7. Styling:
   - Tailwind/NativeWind
   - Tema do projeto @codebase
   - Responsivo

[PADRÕES]
- TypeScript strict mode
- Seguir estrutura de @folder:src/
- Error handling completo
- Loading states
- Comentários JSDoc

[REFERÊNCIAS]
Seguir padrão de @file:src/features/articles/
```

### Exemplos Práticos de Prompts

#### 1. Feature do Zero

```
"Crie sistema de chat em tempo real:
- Supabase realtime para mensagens
- ChatService.ts com send, receive, markAsRead
- Hook useChat com subscription
- ChatScreen com FlatList e input
- Notificações de mensagem nova
Siga padrão @codebase e use @docs supabase realtime"
```

#### 2. Refatoração Grande

```
"@folder:src/components/ refatore todos os componentes:
- Adicione TypeScript interfaces para props
- Extraia estilos inline para const
- Adicione displayName
- Melhore acessibilidade (testID, accessibilityLabel)
- Documente com JSDoc"
```

#### 3. Integração Nova

```
"Integre Sentry para error tracking:
- Instale dependências
- Configure em App.tsx
- Crie ErrorBoundary component
- Adicione user context
- Capture erros de navegação
- Adicione breadcrumbs customizados
Consulte @web sentry react native setup"
```

#### 4. Otimização

```
"Otimize performance do app:
- @folder:src/screens/ adicione React.memo onde necessário
- Implemente useMemo/useCallback estratégicos
- Otimize FlatLists com windowSize
- Lazy load de imagens
- Code splitting de rotas
Analise @codebase primeiro"
```

### Workflow com Composer

```
1. Abra Composer (Ctrl+Shift+I)
   ↓
2. Descreva feature detalhadamente
   ↓
3. Cursor analisa e lista mudanças
   ↓
4. Revise o plano:
   - Arquivos a criar ✓
   - Arquivos a modificar ✓
   - Preview das mudanças ✓
   ↓
5. Clique "Apply" ou "Reject"
   ↓
6. Se aplicou:
   - Teste manualmente
   - Se precisa ajustes, use Composer de novo
   - "Ajuste X no arquivo Y"
   ↓
7. Commit quando satisfeito
```

---

## 💡 Prompts Eficientes

### Anatomia de um Bom Prompt

```
[CONTEXTO] + [AÇÃO] + [DETALHES] + [RESTRIÇÕES] + [REFERÊNCIAS]
```

### ❌ Prompts Ruins vs ✅ Bons

| ❌ Ruim            | ✅ Bom                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------- |
| "arruma isso"      | "corrija o erro de tipo na linha 45 em UserService.ts"                                      |
| "adiciona botão"   | "adicione botão primary com ícone de salvar, handler onSave e loading state"                |
| "melhora o código" | "refatore esta função para usar async/await, adicione error handling e tipos estritos"      |
| "faz login"        | "implemente autenticação com Supabase: email/senha, forgot password, e session persistence" |
| "tem erro"         | [cola erro completo] "este erro aparece ao fazer login com email inválido"                  |

### Templates Prontos

#### Para Criar Componentes

```
"Crie componente [NOME]:

Props:
- [prop1]: [tipo] - [descrição]
- [prop2]: [tipo] - [descrição]

Funcionalidades:
- [funcionalidade 1]
- [funcionalidade 2]

Estilo:
- Tailwind/NativeWind
- [cores, tamanhos, etc]

Exemplo de uso:
<[NOME] prop1="valor" prop2={123} />

Seguir padrão de @file:src/components/Button.tsx"
```

#### Para Criar Screens

```
"Crie [NOME]Screen:

Layout:
- Header com título e botão voltar
- [seção 1]
- [seção 2]
- Footer/Actions

Dados:
- Buscar de [fonte]
- Estados: loading, error, data

Interações:
- [ação 1] → [resultado]
- [ação 2] → [resultado]

Navegação:
- Vem de: [screen anterior]
- Vai para: [próxima screen]
- Parâmetros: [params]

Adicionar em @file:src/navigation/AppNavigator.tsx"
```

#### Para Criar Services

```
"Crie [NOME]Service.ts:

Responsabilidade: [descrição]

Métodos:
- [método1]([params]): Promise<[retorno]> - [descrição]
- [método2]([params]): Promise<[retorno]> - [descrição]

Integração:
- Supabase/API: [endpoint]
- Error handling: [estratégia]
- Cache: [sim/não, como]

Seguir padrão de @folder:src/services/"
```

#### Para Debugging

```
"Erro ao [ação]:

Erro completo:
[cola erro do terminal]

Contexto:
- Acontece quando [situação]
- Arquivos envolvidos: [lista]
- Tentei [o que já tentou]

@codebase encontre a causa e corrija"
```

#### Para Refatoração

```
"Refatore [arquivo/função/componente]:

Problemas atuais:
- [problema 1]
- [problema 2]

Objetivos:
- [objetivo 1]
- [objetivo 2]

Restrições:
- Manter compatibilidade com [X]
- Não quebrar [Y]
- Performance igual ou melhor

Padrão: @file:[referência]"
```

---

## 🔄 Workflows Práticos

### Workflow 1: Feature do Zero

```
1. PLANEJAR (Chat - Ctrl+L)
   "Preciso implementar sistema de favoritos. Como estruturar?"

   ↓ Cursor sugere arquitetura

2. IMPLEMENTAR (Composer - Ctrl+Shift+I)
   "Implemente o plano de favoritos completo com os arquivos sugeridos"

   ↓ Cursor cria todos os arquivos

3. TESTAR
   "rode o app em modo dev"

   ↓ Testa manualmente

4. AJUSTAR (Inline Edit - Ctrl+K)
   [Seleciona função específica]
   "adicione debounce no toggle de favorito"

5. DOCUMENTAR (Chat)
   "@folder:src/features/favorites/ gere README.md explicando a feature"

6. COMMIT (Chat)
   "faça commit semântico das mudanças de favoritos"
```

### Workflow 2: Bug Fix Rápido

```
1. REPRODUZIR
   [Copia erro do terminal]

2. DIAGNOSTICAR (Chat - Ctrl+L)
   [Cola erro]
   "@codebase encontre onde este erro acontece"

   ↓ Cursor localiza arquivo e linha

3. CORRIGIR (Inline Edit - Ctrl+K)
   [Seleciona função problemática]
   "corrija o erro de null pointer, adicione validação"

4. VERIFICAR
   "rode os testes relacionados"

5. COMMIT
   "commit com mensagem: fix: corrige erro X quando Y"
```

### Workflow 3: Refatoração Grande

```
1. ANALISAR (Chat)
   "@folder:src/components/ liste problemas de código"

   ↓ Cursor aponta melhorias

2. PLANEJAR
   "sugira plano de refatoração priorizando impacto"

3. EXECUTAR (Composer)
   "execute o plano de refatoração, arquivo por arquivo,
   começando pelos de maior prioridade"

4. TESTAR
   "rode todos os testes: npm test"

5. REVISAR
   "@git diff mostre o resumo das mudanças"
```

### Workflow 4: Aprendendo Código Novo

```
1. VISÃO GERAL (Chat)
   "@codebase explique a arquitetura do projeto"

2. EXPLORAR FEATURE
   "@folder:src/features/articles/ como funciona esta feature?"

3. ENTENDER ARQUIVO
   "@file:ArticleService.ts explique linha por linha"

4. BUSCAR USOS
   "@codebase onde ArticleService é usado?"

5. DOCUMENTAR APRENDIZADO
   "crie docs/ARTIGOS_FEATURE.md documentando o fluxo"
```

### Workflow 5: Adicionar Biblioteca

```
1. PESQUISAR (Chat)
   "@web melhores libraries de animação para react native 2024"

2. ESCOLHER
   "comparar react-native-reanimated vs moti"

3. INSTALAR
   "instale react-native-reanimated e configure para expo"

4. EXEMPLO (Composer)
   "crie AnimatedButton.tsx usando reanimated:
   - Bounce ao pressionar
   - Fade in ao aparecer
   - Scale hover (web)
   Exemplo em @file:Button.tsx"

5. INTEGRAR
   "substitua Button.tsx por AnimatedButton em @folder:src/screens/"
```

### Workflow 6: Preparar para Produção

```
1. AUDIT (Chat)
   "@codebase analise problemas de segurança e performance"

2. OTIMIZAR (Composer)
   "implemente as otimizações sugeridas"

3. TESTAR
   "rode npm run test:coverage"

4. DOCUMENTAR
   "atualize README.md com setup de produção"

5. BUILD
   "npm run build:production"
```

---

## 🚀 Recursos Avançados

### 1. Rules for AI (.cursorrules)

Crie arquivo `.cursorrules` na raiz do projeto:

```yaml
# .cursorrules - Regras para o Cursor AI

## Linguagem e Estilo
- Sempre use TypeScript com strict mode
- Use functional components com hooks (React Native)
- Prefira arrow functions
- Use async/await ao invés de .then()

## Arquitetura
- Siga arquitetura em camadas: screens → hooks → services → api
- Componentes em src/components/
- Screens em src/screens/
- Services em src/services/
- Hooks customizados em src/hooks/

## Estilos
- Use exclusivamente Tailwind/NativeWind para estilos
- Não use StyleSheet.create()
- Classes: className="bg-primary text-white rounded-lg p-4"
- Temas: use cores do tailwind.config.js

## Nomenclatura
- Componentes: PascalCase (UserCard.tsx)
- Hooks: use + camelCase (useAuth.ts)
- Services: PascalCase + Service (AuthService.ts)
- Funções: camelCase (getUserData)
- Constantes: UPPER_SNAKE_CASE (API_BASE_URL)

## Imports
- Imports absolutos: import { Button } from '@/components/Button'
- Agrupe: React → Libraries → Local → Tipos
- Não use default exports (exceto screens)

## Error Handling
- Sempre use try-catch em async functions
- Log erros: console.error('[ContextoERRO]', error)
- Mostre feedback ao usuário (Alert ou Toast)
- Tipos de erro customizados quando apropriado

## Performance
- Use React.memo para componentes pesados
- useMemo para cálculos complexos
- useCallback para callbacks em listas
- FlatList ao invés de ScrollView para listas

## Testes
- Teste unitário para services e utils
- Teste de integração para hooks
- Teste de snapshot para componentes
- Coverage mínimo: 70%

## Documentação
- JSDoc para funções públicas
- Comentários para lógica complexa
- README.md em cada feature folder
- Exemplos de uso em componentes

## Segurança
- Nunca commite .env
- Valide inputs do usuário
- Sanitize dados de API
- Use RLS policies no Supabase

## Commits
- Conventional commits: feat:, fix:, docs:, refactor:
- Mensagens descritivas em português
- Commits atômicos (uma mudança = um commit)

## Especificidades React Native
- Use Platform.OS para código específico
- Trate permissões (câmera, localização)
- Teste em Android E iOS
- Use expo-constants para configurações

## Supabase
- Queries otimizadas (select apenas campos necessários)
- Use RLS sempre
- Transactions para operações múltiplas
- Cache local quando possível

## Accessibility
- testID em todos os componentes (para testes)
- accessibilityLabel em elementos interativos
- accessibilityHint quando necessário
- Suporte a screen readers
```

**Como usar:**
O Cursor lê automaticamente este arquivo e segue as regras em todas as respostas!

### 2. .cursorignore

Arquivos que a IA deve ignorar:

```
# .cursorignore

# Dependencies
node_modules/
.expo/
.expo-shared/

# Builds
dist/
build/
*.apk
*.ipa

# Cache
.cache/
*.log

# Env
.env
.env.local

# IDE
.vscode/
.idea/

# Tests
coverage/
*.test.ts.snap

# Arquivos grandes
*.mp4
*.mov
assets/videos/

# Documentação auto-gerada
docs/api/
```

### 3. Context Keys (Configurações)

```json
// .vscode/settings.json ou Cursor settings

{
  // Contexto customizado
  "cursor.alwaysInclude": [
    "tsconfig.json",
    "tailwind.config.js",
    "src/types/index.ts",
    ".cursorrules"
  ],

  // Ignore patterns
  "cursor.ignore": ["**/*.test.ts", "**/__snapshots__/**"],

  // Max context
  "cursor.contextWindow.maxTokens": 100000,

  // Privacy
  "cursor.privacy.enableTelemetry": false,

  // Composer
  "cursor.composer.enabled": true,
  "cursor.composer.autoApply": false
}
```

### 4. Cursor Tab (Autocomplete Avançado)

**Modo Normal:**

```typescript
// Você digita:
const handleSubmit =

// Tab sugere:
const handleSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
  } catch (error) {
    console.error(error);
  }
};
```

**Modo Partial Accept:**

```typescript
// Você digita:
function calculateAge(

// Tab sugere:
function calculateAge(birthDate: Date): number {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  // ...
}

// Ctrl+→ aceita palavra por palavra
// Tab aceita tudo
```

### 5. Cursor Directory (Multi-repo)

Para trabalhar com múltiplos repositórios:

```
1. File > Open Folder
2. Adicione múltiplos folders
3. Cursor mantém contexto de todos

Use:
@folder:repo1/src/ ...
@folder:repo2/api/ ...
```

### 6. Custom Snippets + IA

```json
// .vscode/react-native.code-snippets

{
  "React Native Screen": {
    "prefix": "rnscreen",
    "body": [
      "import React from 'react';",
      "import { View, Text } from 'react-native';",
      "",
      "interface ${1:ScreenName}Props {",
      "  // Cursor: adicione props aqui",
      "}",
      "",
      "export default function ${1:ScreenName}({ }: ${1:ScreenName}Props) {",
      "  // Cursor: implemente a screen",
      "  return (",
      "    <View className=\"flex-1 bg-white\">",
      "      <Text className=\"text-xl font-bold\">${1:ScreenName}</Text>",
      "    </View>",
      "  );",
      "}"
    ]
  }
}
```

Digita `rnscreen` + Tab → Cursor completa com lógica real!

### 7. Terminal Integration

```bash
# No terminal do Cursor:

# Cursor entende comandos em linguagem natural
"instale react-native-svg"
→ npm install react-native-svg

"rode os testes"
→ npm test

"commit das mudanças"
→ git add . && git commit -m "..."
```

### 8. AI Code Review

```
# Antes de commit:

1. @git diff
2. "revise estas mudanças e aponte problemas"
3. Cursor analisa:
   - Bugs potenciais
   - Performance issues
   - Code smell
   - Inconsistências de estilo
4. Corrige antes de commitar
```

---

## 💎 Dicas e Truques

### 1. Accelerate Desenvolvimento

**Técnica: Chain Prompting**

```
1. "planeje sistema de notificações"
2. [revise resposta]
3. "implemente o passo 1 do plano"
4. "agora o passo 2"
5. ...
```

**Técnica: Incremental Building**

```
1. "crie versão básica de NotificationService"
2. [teste]
3. "adicione retry logic"
4. [teste]
5. "adicione rate limiting"
```

### 2. Debugging Eficiente

```
# Cola stack trace completo
"Este erro:
[stack trace]

Acontece quando:
1. [passos para reproduzir]

@codebase encontre e corrija"
```

### 3. Aprendendo Biblioteca Nova

```
"@web tutorial completo de [biblioteca]

Depois crie exemplo funcional em @file:examples/[Nome]Example.tsx
seguindo padrão de @folder:src/examples/"
```

### 4. Refatoração Segura

```
1. "@file:OldComponent.tsx explique o que faz"
2. "crie NewComponent.tsx com mesma funcionalidade mas usando [nova abordagem]"
3. "crie testes para ambos comparando output"
4. "se testes passarem, substitua todos os usos"
```

### 5. Code Review Automated

```
"@git diff da branch feature/X

Revise:
- Bugs potenciais
- Performance issues
- Segurança
- Testes faltando
- Documentação faltando

Gere checklist de melhorias"
```

### 6. Documentação Automática

```
"@folder:src/services/ gere documentação:

Para cada service:
- Propósito
- Métodos públicos com exemplos
- Errors que podem lançar
- Dependências

Salve em docs/SERVICES.md"
```

### 7. Migração de Tecnologia

```
"Migre @file:OldStyles.ts de StyleSheet para Tailwind:

1. Analise estilos atuais
2. Mapeie para classes Tailwind equivalentes
3. Crie tabela de equivalência
4. Aplique em todos os componentes que usam
5. Delete OldStyles.ts

Mantenha resultado visual idêntico"
```

### 8. Pair Programming com IA

```
Você: "quero implementar X, como começar?"
Cursor: [sugere abordagem]
Você: "prefiro abordagem Y porque Z"
Cursor: [ajusta plano]
Você: "implemente"
Cursor: [implementa]
Você: "adicione testes"
Cursor: [adiciona testes]
```

### 9. Batch Operations

```
"Para cada arquivo em @folder:src/components/:
1. Adicione TypeScript interfaces para props
2. Adicione displayName
3. Adicione JSDoc
4. Formate com Prettier

Mostre progresso e erros se houver"
```

### 10. Context Stacking

```
"Considerando:
- @file:design-system.md
- @file:tailwind.config.js
- @folder:src/components/

Crie ButtonGroup component que:
- Aceita array de buttons
- Respeita design system
- Suporta orientação horizontal/vertical
- Acessível (ARIA)"
```

---

## 🔧 Troubleshooting

### Problema 1: Cursor está lento

**Causas:**

- Projeto muito grande
- Muitos arquivos no context
- Internet lenta

**Soluções:**

```
1. Adicione .cursorignore com node_modules, build/, etc
2. Reduza contextWindow: "cursor.contextWindow.maxTokens": 50000
3. Use @file específico ao invés de @codebase
4. Feche outros apps pesados
```

### Problema 2: Respostas imprecisas

**Causas:**

- Contexto insuficiente
- Prompt vago
- Arquivo errado no contexto

**Soluções:**

```
1. Seja mais específico: "corrija linha 45" ao invés de "tem erro"
2. Adicione contexto: @file, @folder, @codebase
3. Use .cursorrules para guiar comportamento
4. Referencie exemplos: "como em @file:Example.tsx"
```

### Problema 3: Composer não aplica mudanças

**Causas:**

- Conflitos de merge
- Arquivo aberto em outro editor
- Sintaxe inválida gerada

**Soluções:**

```
1. Feche arquivos afetados antes de aplicar
2. Revise preview antes de "Apply"
3. Use "Apply Partial" se só parte está certa
4. Ctrl+Z funciona! Desfaça e tente de novo
```

### Problema 4: Autocomplete não aparece

**Causas:**

- Desabilitado nas configurações
- Limite de tokens atingido
- Cursor não entende contexto

**Soluções:**

```
1. Verifique: Cursor > Settings > Features > Tab enabled
2. Reinicie Cursor
3. Escreva comentário mais descritivo antes
4. Verifique conexão com internet
```

### Problema 5: Ignora .cursorrules

**Causas:**

- Arquivo mal formatado
- Caminho errado
- Conflito com settings.json

**Soluções:**

```
1. .cursorrules deve estar na raiz do projeto
2. Use YAML ou Markdown válido
3. Reinicie Cursor após criar/editar
4. Teste: "resuma as regras do projeto"
```

### Problema 6: Consumo de tokens alto

**Causas:**

- Context muito grande
- Muitas chamadas desnecessárias
- Composer em projetos gigantes

**Soluções:**

```
1. Use .cursorignore agressivamente
2. Prefira @file a @codebase quando possível
3. Chat para planejar, Composer para executar (não o contrário)
4. Revise antes de "Apply" para evitar refazer
```

### Problema 7: Gera código desatualizado

**Causas:**

- Modelo antigo
- Não usa @web ou @docs
- Biblioteca mudou recentemente

**Soluções:**

```
1. "@web [biblioteca] latest version 2024"
2. "@docs [biblioteca]" para documentação oficial
3. Especifique versão: "usando React Native 0.76"
4. Atualize Cursor regularmente
```

---

## 📊 Comparação: Quando Usar Cada Modo

| Tarefa             | Chat        | Inline    | Composer  | Autocomplete |
| ------------------ | ----------- | --------- | --------- | ------------ |
| Pergunta rápida    | ✅ Melhor   | ❌        | ❌        | ❌           |
| Editar 1 função    | 🟡 Ok       | ✅ Melhor | 🟡 Ok     | ❌           |
| Feature completa   | 🟡 Planejar | ❌        | ✅ Melhor | ❌           |
| Refatorar arquivo  | 🟡 Ok       | ✅ Bom    | ✅ Melhor | ❌           |
| Múltiplos arquivos | ❌          | ❌        | ✅ Melhor | ❌           |
| Completar código   | ❌          | ❌        | ❌        | ✅ Melhor    |
| Debugging          | ✅ Melhor   | 🟡 Ok     | ❌        | ❌           |
| Aprender código    | ✅ Melhor   | ❌        | ❌        | ❌           |
| Explicação         | ✅ Melhor   | ❌        | ❌        | ❌           |
| Comandos terminal  | ✅ Melhor   | ❌        | ❌        | ❌           |

**Legenda:**

- ✅ Melhor escolha
- 🟡 Funciona mas não é ideal
- ❌ Não recomendado

---

## 🎓 Exercícios Práticos

### Exercício 1: Básico - Criar Componente

```
Objetivo: Criar um componente Card usando Cursor

1. Abra Cursor Chat (Ctrl+L)
2. Digite:
   "Crie componente Card.tsx em src/components/:
   - Props: title, description, imageUrl, onPress
   - Estilo: Tailwind/NativeWind, shadow, rounded
   - Acessível com testID"
3. Revise o código gerado
4. Use Inline Edit (Ctrl+K) para ajustar estilo
5. Teste importando em uma screen
```

### Exercício 2: Intermediário - Feature Completa

```
Objetivo: Implementar sistema de busca

1. Planeje no Chat:
   "Quero adicionar busca de artigos. Sugira arquitetura"
2. Abra Composer (Ctrl+Shift+I)
3. Digite:
   "Implemente busca de artigos:
   - SearchBar component
   - useSearch hook com debounce
   - SearchScreen
   - Integre com ArticleService
   - Adicione rota na navegação"
4. Revise preview
5. Apply
6. Teste e ajuste
```

### Exercício 3: Avançado - Refatoração

```
Objetivo: Migrar estilos para Tailwind

1. Análise:
   "@folder:src/components/ encontre uso de StyleSheet"
2. Plano:
   "Crie plano de migração de StyleSheet para Tailwind"
3. Execução (Composer):
   "Execute plano de migração, preservando resultado visual"
4. Validação:
   "Compare screenshots antes/depois"
5. Commit:
   "@git commit: refactor: migra estilos para Tailwind"
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Cursor Docs](https://docs.cursor.com)
- [Cursor Forum](https://forum.cursor.com)
- [Cursor Changelog](https://changelog.cursor.com)

### Comunidade

- Discord do Cursor
- Reddit: r/cursor
- Twitter: @cursor_ai

### Tutoriais Video

- YouTube: "Cursor AI Tutorial"
- Twitch: Streams de live coding com Cursor

### Cheat Sheets

```
# Atalhos Essenciais
Ctrl+L          Chat
Ctrl+K          Inline Edit
Ctrl+Shift+I    Composer
Tab             Accept Suggestion
Ctrl+→          Partial Accept
Esc             Reject

# Símbolos
@codebase       Busca projeto
@file           Arquivo específico
@folder         Pasta inteira
@web            Pesquisa internet
@docs           Documentação oficial
@git            Histórico Git
#file           Referencia arquivo
#selection      Código selecionado
```

---

## 🎯 Resumo Executivo

### Para Iniciantes

1. **Comece com Chat** (`Ctrl+L`) para perguntas
2. **Use Autocomplete** (`Tab`) para completar código
3. **Experimente Inline** (`Ctrl+K`) para editar funções
4. **Adicione @file** para dar contexto

### Para Intermediários

1. **Domine Composer** (`Ctrl+Shift+I`) para features
2. **Use @codebase** para buscar no projeto
3. **Crie .cursorrules** para consistência
4. **Combine símbolos** (@folder + @file)

### Para Avançados

1. **Workflows customizados** (chain prompting)
2. **Batch operations** (múltiplos arquivos)
3. **AI code review** automático
4. **Context stacking** avançado

---

## 💡 Filosofia de Uso

### Princípios

1. **IA como Co-piloto, não Piloto**
   - Você dirige, IA acelera
   - Sempre revise código gerado
   - Entenda o que a IA faz

2. **Iterativo > Perfeito**
   - Gere versão básica rápido
   - Refine incrementalmente
   - Teste frequentemente

3. **Contexto é Tudo**
   - Mais contexto = melhor resultado
   - Use @símbolos generosamente
   - .cursorrules é seu amigo

4. **Aprenda com a IA**
   - Peça explicações
   - Compare abordagens
   - Questione decisões

5. **Segurança Primeiro**
   - Nunca compartilhe secrets
   - Revise código de segurança
   - Use privacy mode quando necessário

---

## 🚀 Próximos Passos

1. ✅ Instale Cursor
2. ✅ Configure .cursorrules
3. ✅ Pratique cada modo (Chat, Inline, Composer)
4. ✅ Crie feature completa com Composer
5. ✅ Personalize workflows
6. ✅ Compartilhe aprendizados!

---

**Criado para:** Projeto NossaMaternidade
**Última atualização:** Dezembro 2024
**Versão do Cursor:** 0.42+

💬 **Dúvidas?** Pergunte diretamente no Cursor Chat: `@file:GUIA_COMPLETO_CURSOR_AI.md como faço X?`
