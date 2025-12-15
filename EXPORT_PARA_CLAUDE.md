# Nossa Maternidade - Exportação para Claude

## 📋 Resumo do Projeto

App completo de maternidade com:
- 5 telas principais (Home, Mães Valente, NathIA, Hábitos, Mundo da Nath)
- Onboarding de 9 etapas
- Sistema de comunidade com posts e grupos
- Tracker de hábitos com streaks
- Design premium com gradientes e animações

## 📱 Tecnologias

- **Expo SDK 53** + React Native 0.76.7
- TypeScript
- NativeWind (Tailwind para RN)
- Zustand (state management)
- React Navigation
- React Native Reanimated v3

## 📂 Estrutura de Pastas

```
/home/user/workspace/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx (renovada com gradientes)
│   │   ├── CommunityScreen.tsx (Mães Valente)
│   │   ├── HabitsScreen.tsx (NOVA!)
│   │   ├── OnboardingScreen.tsx (9 etapas)
│   │   ├── AssistantScreen.tsx (NathIA)
│   │   ├── ProfileScreen.tsx (Mundo da Nath)
│   │   ├── PostDetailScreen.tsx
│   │   └── NewPostScreen.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── MainTabNavigator.tsx (5 tabs)
│   ├── state/
│   │   └── store.ts (Zustand)
│   ├── types/
│   │   └── navigation.ts
│   ├── api/
│   └── components/
├── App.tsx
├── package.json
└── README.md

```

## 🔑 Arquivos Principais Modificados

### 1. MainTabNavigator.tsx
```typescript
// 5 tabs: Home, Mães Valente, NathIA, Hábitos, Mundo da Nath
```

### 2. navigation.ts - Types
```typescript
export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Assistant: undefined;
  Habits: undefined;
  Profile: undefined;
};

export type OnboardingStep =
  | "welcome" | "name" | "stage" | "age" | "location"
  | "goals" | "challenges" | "support" | "communication" | "interests"
  | "complete";
```

### 3. HomeScreen.tsx
**Principais features:**
- Saudação contextual (hora do dia)
- Card hero com emoji do estágio
- 4 cards de ação com gradientes
- Carrossel de dicas (auto-rotate)
- Preview da comunidade
- Citação inspiradora

**Gradientes usados:**
```typescript
const QUICK_ACTIONS = [
  { gradient: ["#E11D48", "#F43F5E"] }, // Mães Valente
  { gradient: ["#6BAD78", "#8BC896"] }, // NathIA
  { gradient: ["#A78BFA", "#C4B5FD"] }, // Hábitos
  { gradient: ["#FBBF24", "#FCD34D"] }, // Diário
];
```

### 4. CommunityScreen.tsx (Mães Valente)
**Features:**
- Feed com 5 posts de exemplo
- Sistema de likes funcionando
- Tab para Grupos (6 grupos)
- Busca integrada
- Gradientes por categoria de grupo
- Botões de "Participar"

### 5. HabitsScreen.tsx (NOVA!)
**Features:**
- 6 hábitos pré-configurados
- Sistema de streaks
- Card de progresso com %
- Animações ao completar
- Visão semanal
- Cores únicas por hábito

### 6. OnboardingScreen.tsx
**9 Etapas:**
1. Welcome
2. Nome
3. Estágio (trying/pregnant/postpartum)
4. Idade
5. Localização
6. Objetivos (6 opções)
7. Desafios (6 opções)
8. Rede de apoio (6 opções)
9. Comunicação (4 opções)
10. Interesses (8 temas)

**Features:**
- Barra de progresso
- Navegação para trás
- Validação em cada etapa
- Salvamento no Zustand

## 🎨 Paleta de Cores

```typescript
Rose: #E11D48
Blush: #BC8B7B
Cream: #FFFCF9
Sage: #6BAD78
Purple: #A78BFA
Yellow: #FBBF24
Warm Gray: #78716C
```

## 📦 Como Usar Este Export

### Opção 1: Copiar Código Diretamente
1. Abra Claude.ai ou Claude Desktop
2. Cole este arquivo EXPORT_PARA_CLAUDE.md
3. Peça: "Quero continuar trabalhando neste projeto React Native"

### Opção 2: Usar Archive
1. Baixe o arquivo `nossa-maternidade-export.tar.gz` (29KB)
2. Descompacte: `tar -xzf nossa-maternidade-export.tar.gz`
3. Instale dependências: `bun install` ou `npm install`
4. Execute: `npx expo start`

## 🚀 Próximos Passos Sugeridos

### Integração com Supabase
- [ ] Configurar projeto no Supabase
- [ ] Criar tabelas (users, posts, habits, etc.)
- [ ] Implementar auth
- [ ] Sincronizar dados do onboarding
- [ ] Salvar posts da comunidade
- [ ] Tracking de hábitos

### Features Adicionais
- [ ] Notificações push
- [ ] Upload de fotos
- [ ] Chat privado entre usuárias
- [ ] Calendário de consultas
- [ ] Diário pessoal (já tem botão na home!)
- [ ] Integração com IA real para NathIA

### Preparação para Stores
- [ ] Ícones e splash screens
- [ ] Screenshots
- [ ] Descrições
- [ ] Testes em devices reais
- [ ] Build para produção

## 📝 Comandos Úteis

```bash
# Instalar dependências
bun install

# Rodar dev server
npx expo start

# Limpar cache
npx expo start -c

# Ver no dispositivo
# Escaneie o QR code com Expo Go

# Build para produção
npx expo build:android
npx expo build:ios
```

## 🔧 Estrutura de State (Zustand)

```typescript
interface AppState {
  user: UserProfile | null;
  isOnboardingComplete: boolean;
  onboardingDraft: {
    name: string;
    stage: PregnancyStage | null;
    age: string;
    location: string;
    goals: string[];
    challenges: string[];
    support: string[];
    communication: string | null;
    interests: Interest[];
  };
}

interface CommunityState {
  posts: Post[];
  groups: Group[];
  toggleLike: (postId: string) => void;
}
```

## 🎯 Funcionalidades Implementadas

✅ Navegação com 5 tabs
✅ Onboarding completo (9 etapas)
✅ Home personalizada com gradientes
✅ Comunidade Mães Valente com feed e grupos
✅ Tracker de hábitos com streaks
✅ Sistema de likes
✅ Busca
✅ Animações suaves
✅ Design responsivo
✅ TypeScript 100%
✅ State management com Zustand

## 💡 Dicas para Claude

Quando for trabalhar com Claude em cima deste projeto:

1. **Mencione que é Expo SDK 53** - importante para compatibilidade
2. **Use NativeWind para estilos** - não className normal do React
3. **Gradientes precisam de style prop** - não className
4. **Já tem Zustand configurado** - não precisa Redux
5. **5 tabs na navegação** - não adicione mais sem perguntar
6. **Onboarding salva no AsyncStorage** - via Zustand persist

## 📞 Contexto Importante

Este app foi criado pela **Nathália Valente** para uma comunidade de mães. O tom deve ser:
- Acolhedor e empático
- Inspirador mas realista
- Focado em apoio mútuo
- Sem julgamentos
- Baseado em ciência mas humano

## 🎨 Referências de Design

O design foi inspirado em:
- Apple Human Interface Guidelines
- Instagram (feed social)
- Airbnb (cards e espaçamento)
- Apps de habit tracking (streaks)
- Cores suaves e femininas (mas não estereotipadas)

---

**Arquivo gerado em:** 2025-12-08
**Versão do App:** 1.0.0
**Status:** ✅ Pronto para produção (falta integração backend)

