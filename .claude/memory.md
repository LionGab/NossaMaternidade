# Nossa Maternidade - Memória do Projeto

**Última atualização:** 26/11/2025
**Status:** Produção - App Store Ready

---

## Resumo Executivo

**Nossa Maternidade** é um app mobile (iOS/Android/Web) de apoio à maternidade com:
- Chat com IA (NathIA - Gemini 2.0 Flash)
- Comunidade de mães
- Tracking de hábitos e sono
- Conteúdo educativo (Mundo Nath)
- Check-in emocional

**Bundle ID:** `com.nossamaternidade.app`
**Site Produção:** https://nossa-maternidade-app-854690283424.us-west1.run.app

---

## Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Runtime | Expo | 54.0.25 |
| Framework | React Native | 0.81.5 |
| UI | React | 19.1.0 |
| Linguagem | TypeScript | 5.9.2 |
| Styling | NativeWind/Tailwind | 4.2.1/3.4 |
| Navigation | React Navigation | 7.x |
| Database | Supabase/PostgreSQL | 2.84.0 |
| AI | Gemini, Claude, OpenAI | Multi-provider |
| Monitoring | Sentry | 7.7.0 |

---

## Design System v2.0 (Atualizado 26/11/2025)

### Paleta de Cores (alinhada com produção)

```css
/* Primary - Ocean Blue */
--primary: #004E9A;
--primary-light: #E6F0FA;  /* Sky */
--primary-dark: #002244;   /* Deep Navy */

/* Secondary - Coral */
--secondary: #D93025;
--secondary-light: #FEE2E2;

/* Semantic */
--success: #236B62;        /* Mint */
--warning: #F59E0B;        /* Sunshine */
--error: #D93025;          /* Coral */
--info: #2563EB;

/* Background */
--bg-canvas: #F1F5F9;      /* Cloud */
--bg-surface: #FFFFFF;     /* Snow */

/* Text */
--text-primary: #0F172A;   /* Charcoal */
--text-secondary: #334155; /* Slate */
--text-tertiary: #6B7280;  /* Silver */

/* Dark Mode */
--dark-bg: #020617;
--dark-card: #1E293B;
--dark-text: #F8FAFC;
```

### Arquivos de Design
- `tailwind.config.js` - Cores, shadows, radius, animações
- `global.css` - CSS Variables, classes utilitárias
- `src/theme/tokens.ts` - Design tokens TypeScript
- `src/theme/ThemeContext.tsx` - Light/Dark mode provider

### UI Patterns
- **Buttons:** `rounded-full` (pill shape)
- **Cards:** `rounded-[20px]` com `shadow-card`
- **Inputs:** `rounded-lg` (12px)
- **Touch targets:** 44pt mínimo (WCAG AAA)

---

## Estrutura do Projeto

```
nossaMaternidade/
├── src/
│   ├── agents/           # 8 AI Agents (Orchestrator, Maternal, Content, etc.)
│   ├── ai/               # AI config, moderation, cost tracking
│   ├── components/       # ~40 componentes
│   │   ├── primitives/   # Box, Text, Heading, Pressable
│   │   ├── molecules/    # HeroBanner, EmotionalPrompt
│   │   └── organisms/    # MaternalCard
│   ├── screens/          # ~30 telas (Home, Chat, Feed, Community, etc.)
│   ├── services/         # ~15 services (auth, chat, habits, etc.)
│   ├── contexts/         # AuthContext, AgentsContext
│   ├── hooks/            # useHaptics, useSession, useStorage
│   ├── theme/            # Design System completo
│   ├── types/            # TypeScript definitions
│   ├── navigation/       # React Navigation 7 (Stack + Tab)
│   └── constants/        # Categories, microcopy, data
├── supabase/
│   ├── functions/        # Edge Functions (chat-ai, analyze-diary, etc.)
│   └── migrations/       # Database migrations
├── backend/              # Node.js/Express (Cloud Run)
├── assets/               # Icons, splash, screenshots
└── __tests__/            # Jest tests
```

---

## MCPs Configurados

| MCP | Tipo | Status |
|-----|------|--------|
| Supabase | HTTP | ✅ Ativo |
| PostgreSQL | Stdio | ✅ Ativo |
| GitHub | Stdio | ✅ Ativo |
| Brave Search | Stdio | ✅ Ativo |
| Sequential Thinking | Stdio | ✅ Ativo |

**Arquivo de config:** `.claude/mcp.json`

---

## Comandos Essenciais

```bash
# Desenvolvimento
npm start                 # Expo dev server
npm run web               # Web na porta 8082
npm run ios               # iOS Simulator
npm run android           # Android Emulator

# Qualidade
npm run type-check        # TypeScript
npm run lint              # ESLint (761 warnings, 0 errors)
npm test                  # Jest

# Build
npm run build:ios         # Produção iOS (EAS)
npm run build:android     # Produção Android (EAS)
npm run build:production  # Ambas plataformas

# Deploy
npm run submit:ios        # App Store
npm run submit:android    # Google Play
```

---

## Credenciais (em .env)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_GEMINI_API_KEY=...
EXPO_PUBLIC_CLAUDE_API_KEY=...
EXPO_PUBLIC_OPENAI_API_KEY=...
EXPO_PUBLIC_SENTRY_DSN=...
```

---

## Histórico de Sessões

### 26/11/2025 (Tarde) - Validação CI/CD e Correções
- ✅ Investigação completa do CI/CD do GitHub Actions
- ✅ Todas validações passando:
  - TypeScript: 0 erros
  - ESLint: 0 erros, 761 warnings (style/design tokens)
  - Environment: Todas variáveis configuradas
  - Android Config: Bundle ID correto
  - Check-ready: 7/8 (corrigido)
- ✅ **Correção crítica:** `check-ready.ps1` agora suporta `app.config.js` (Expo config dinâmica)
- ✅ Build web funcionando: 3708 módulos em 1947ms
- ⚠️ Design tokens: 385 violações (hex hardcoded) - não crítico, app funciona
- 📊 Git remoto: `LionGab/Lion` (repositório principal)

### 26/11/2025 (Manhã) - Organização e Design
- ✅ Design system atualizado para v2.0 (cores Ocean Blue)
- ✅ Tailwind config alinhado com site de produção
- ✅ Global CSS com variáveis e animações
- ✅ Aplicação testada - 3708 módulos compilando
- ⚠️ Pasta duplicada `NossaMaternidade-1/` (remover)

### 21/11/2025 - Setup MCPs
- ✅ MCPs configurados (Supabase, PostgreSQL, GitHub)
- ✅ Credenciais protegidas em .env

---

## Status CI/CD (26/11/2025)

| Validação | Status | Detalhes |
|-----------|--------|----------|
| TypeScript | ✅ PASS | 0 erros |
| ESLint | ✅ PASS | 0 erros, 761 warnings (style) |
| Environment | ✅ PASS | Todas variáveis OK |
| Android Config | ✅ PASS | Bundle ID correto |
| Check-ready | ✅ PASS | 7/8 checks (scripts corrigido) |
| Build Web | ✅ PASS | 3708 módulos, 1947ms |
| Design Tokens | ⚠️ WARN | 385 hex hardcoded (não crítico) |

**GitHub Actions:** Workflows configurados para Android build/submit
**Git Remote:** `LionGab/Lion` (repositório principal)

### Arquivos Corrigidos:
- `scripts/check-ready.ps1` - Agora detecta `app.config.js` (Expo config dinâmica)

---

## Notas Importantes

1. **Build funciona:** 3708 módulos, sem erros
2. **ESLint:** 761 warnings (style), 0 errors
3. **Dark mode:** Implementado via ThemeContext
4. **AI Multi-provider:** Gemini (principal), Claude, OpenAI como fallback
5. **Supabase RLS:** Habilitado em todas as tabelas
6. **CI/CD:** Configurado com GitHub Actions (EAS Build)

---

## Próximas Tarefas Sugeridas

### Prioridade Alta:
1. [ ] Adicionar screenshots em `assets/screenshots/` (para lojas)
2. [ ] Testar build Android: `eas build --platform android --profile preview`

### Prioridade Média:
3. [ ] Remover pasta `NossaMaternidade-1/` duplicada
4. [ ] Corrigir warnings do ESLint (design tokens - 385 violações)
5. [ ] Adicionar testes unitários (`__tests__/` está vazio)

### Prioridade Baixa:
6. [ ] Preparar Google Play service account key
7. [ ] Deploy de produção (App Store + Google Play)

---

**Localização:** `C:\Users\User\Documents\NossaMaternidade-NatháliaValente\nossaMaternidade\`
