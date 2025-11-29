# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nossa Maternidade** is a mobile-first maternal support app built with React Native + Expo SDK 54, targeting iOS App Store and Google Play Store. The app provides AI-powered chat, content recommendations, habit tracking, and community features for mothers.

## Development Commands

```bash
# Start development
npm start                     # Expo dev server
npm run ios                   # iOS Simulator
npm run android               # Android Emulator

# Quality checks
npm run type-check            # TypeScript validation (tsc --noEmit)
npm run lint                  # ESLint
npm test                      # Jest tests
npm run test:watch            # Jest watch mode
npm run test:coverage         # Coverage report

# Validation before build
npm run check-ready           # PowerShell validation script
npm run validate:android      # Android build validation
npm run validate:env          # Environment variables check

# Production builds (requires EAS CLI)
npm run build:android         # Production Android build
npm run build:ios             # Production iOS build
npm run build:production      # Both platforms

# Submitting to stores
npm run submit:android        # Google Play submission
npm run submit:ios            # App Store submission
```

## Running a Single Test

```bash
# Run specific test file
npx jest __tests__/services/chatService.test.ts

# Run tests matching pattern
npx jest --testNamePattern="should validate"
```

## Advanced Tool Use (NEW! 🚀)

Nossa Maternidade implementa os **patterns avançados de uso de ferramentas** da Anthropic, resultando em melhorias significativas:

- ✅ **~85% redução de tokens** com lazy loading de MCP servers
- ✅ **~37% redução de tokens** com parallel execution
- ✅ **3x mais rápido** em operações paralelas
- ✅ **Resiliência automática** com retry logic + exponential backoff
- ✅ **95% context window preservado** com result aggregation

**Documentação completa:** [docs/ADVANCED_TOOL_USE.md](../ADVANCED_TOOL_USE.md)

### Quick Examples

```typescript
// 1. Buscar dados em paralelo (3x mais rápido!)
const result = await orchestrator.callMCPParallel([
  { server: 'supabase', method: 'db.query', params: { table: 'profiles' } },
  { server: 'googleai', method: 'analyze.emotion', params: { text: message } }
]);

// 2. Com retry automático e timeout
const result = await orchestrator.callMCPParallel(calls, {
  timeout: 10000,
  retry: { maxAttempts: 3, initialDelay: 1000, backoffMultiplier: 2 }
});

// 3. Com agregação de resultados (economiza 95% do context)
const summary = await orchestrator.callMCPWithAggregation(
  calls,
  (results) => ({
    total: results.length,
    summary: processResults(results)
  })
);
```

**Arquivos principais:**
- [src/agents/core/ToolExecutor.ts](../../src/agents/core/ToolExecutor.ts) - Parallel execution, retry, aggregation
- [src/agents/core/MCPLoader.ts](../../src/agents/core/MCPLoader.ts) - Lazy loading de MCP servers
- [src/agents/examples/AdvancedToolUseExamples.ts](../../src/agents/examples/AdvancedToolUseExamples.ts) - 7 exemplos práticos
- [__tests__/agents/AdvancedToolUse.test.ts](../../__tests__/agents/AdvancedToolUse.test.ts) - Testes completos

## Architecture

### Mobile Layer (React Native + Expo 54)

```
src/
├── screens/            # App screens (HomeScreen, ChatScreen, etc.)
├── components/         # Reusable UI components
│   └── primitives/     # Base Design System components
├── navigation/         # React Navigation 7 (Stack + Tab navigators)
├── theme/              # Design System tokens and ThemeContext
├── services/           # Business logic (geminiService, chatService, etc.)
├── contexts/           # React contexts (AuthContext, AgentsContext)
├── agents/             # AI Agent system
│   ├── core/           # BaseAgent + AgentOrchestrator
│   ├── maternal/       # MaternalChatAgent
│   ├── content/        # ContentRecommendationAgent
│   └── habits/         # HabitsAnalysisAgent
├── mcp/                # Model Context Protocol servers
│   └── servers/        # SupabaseMCP, GoogleAIMCP, AnalyticsMCP
├── hooks/              # Custom hooks (useTheme, useHaptics, etc.)
├── types/              # TypeScript type definitions
└── data/               # Static/mock data
```

### Backend (Supabase)

- **Auth**: Email/password + Magic Link
- **Database**: PostgreSQL with RLS enabled
- **Edge Functions**: `chat-ai`, `analyze-emotion`, `moderate-content`
- **Storage**: avatars, audio-messages, content-media

### AI Integration

- **Gemini 2.0 Flash**: Primary AI via Supabase Edge Functions
- **Agent Pattern**: Orchestrator manages specialized agents for chat, content, habits
- **MCP Protocol**: Unified interface for Supabase, Google AI, Analytics

## Design System

All styles MUST use design tokens from `src/theme/tokens.ts`:

```typescript
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

// Access theme-aware colors
const colors = useThemeColors();

// Use tokens for spacing, typography, etc.
Tokens.spacing['4']         // 16px
Tokens.typography.sizes.md  // 16
Tokens.radius.lg            // 12
Tokens.touchTargets.min     // 44pt (WCAG AAA)
```

### Theme Hook Usage

```typescript
// Get current theme colors (light/dark aware)
const colors = useThemeColors();
colors.background.canvas    // Theme background
colors.text.primary         // Theme text color
colors.primary.main         // Primary brand color

// Raw color tokens (theme-independent)
colors.raw.primary[400]     // #4285F4
colors.raw.success          // ColorTokens.success
```

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@screens/*` → `./src/screens/*`
- `@services/*` → `./src/services/*`

## Key Patterns

### Services Architecture

Services handle business logic and external communication:
- `geminiService.ts` - AI chat via Supabase Edge Functions
- `chatService.ts` - Chat conversation management
- `profileService.ts` - User profile operations
- `habitsService.ts` - Habit tracking logic

### Component Patterns

- Use `memo` for list item components
- Use `FlatList` with `getItemLayout` for fixed-height items
- Always support both Light and Dark mode via `useThemeColors()`
- Touch targets minimum 44pt (iOS) / 48dp (Android)

### Error Handling

- Use `ErrorBoundary` component for React error catching
- Services return `{ data, error }` pattern from Supabase
- Retry logic with exponential backoff for network calls

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_GEMINI_API_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=
```

## Git Workflow

```
main          # Production (protected)
  ↑
  └── dev     # Integration branch
       ↑
       └── feature/*  # Feature branches
```

**Rules:**
- Never push directly to `main` (protected)
- PRs: `feature/*` → `dev` → `main`
- Commit messages in Portuguese: `feat: adiciona funcionalidade X`

## Store Compliance

### iOS App Store
- iOS 13+ minimum
- Privacy policy URL required
- App Tracking Transparency for tracking
- Screenshots: 6.7", 6.5", 5.5"

### Google Play Store
- Target API Level 33+ (Android 13)
- Data safety section required
- Feature graphic 1024x500px
- Adaptive icons 512x512px

## Testing Structure

```
__tests__/
├── services/       # Service unit tests
└── README.md       # Testing guidelines
```

Jest configured with:
- `ts-jest` preset
- Coverage threshold: 40% minimum
- Path alias `@/*` supported

## Cursor.AI Workflows

Cursor.AI is the primary development tool (95% of development time) with custom MCPs for validation and auto-fix.

### MCPs Available

**Custom MCPs (5):**
1. `design-tokens` - Validates design token usage
2. `code-quality` - Analyzes code quality and hardcoded values
3. `accessibility` - WCAG AAA compliance checks
4. `mobile-optimization` - React Native best practices
5. `prompt-testing` - Validates AI prompts for safety and clarity

**Native MCPs (6):**
- `supabase`, `puppeteer`, `chrome-devtools`, `filesystem`, `git`, `brave-search`

### Using MCPs in Cursor

```bash
# Design tokens validation
@design-tokens validate src/components/Checkbox.tsx

# Code quality analysis
@code-quality analyze.design src/screens/HomeScreen.tsx

# Accessibility audit
@accessibility audit.screen src/screens/HomeScreen.tsx

# Mobile optimization check
@mobile-optimization check.flatlist src/screens/HomeScreen.tsx

# Prompt testing
@prompt-testing validate.all promptPath=src/mcp/servers/OpenAIMCPServer.ts
```

### Auto-fix Engine

Automatically fixes violations with high confidence (95%+):

```bash
# Dry-run (preview changes)
node scripts/cursor-auto-fix.js --file=src/components/Checkbox.tsx --dry-run

# Apply high-confidence fixes
node scripts/cursor-auto-fix.js --file=src/components/Checkbox.tsx --confidence=high

# Batch mode (all files)
node scripts/cursor-auto-fix.js --mode=batch --confidence=high
```

### Workflow Division

| Task | Tool | Usage |
|------|------|-------|
| Daily development | Cursor | 70% |
| Individual refactoring | Cursor | 15% |
| Auto-fix violations | Cursor | 10% |
| Complex planning | Claude Code | 3% |
| PRs and documentation | Claude Code | 2% |

**Total: Cursor 95% | Claude Code 5%**

### Troubleshooting

**MCP not appearing in Cursor:**
1. Check `mcp.json` syntax: `cat mcp.json | jq .`
2. Test runner manually
3. Reload Cursor: `Cmd/Ctrl+Shift+P` → "Reload Window"
4. Check logs: `%APPDATA%\Cursor\logs` (Windows)

**Auto-fix not working:**
1. Check confidence level: `--dry-run --verbose`
2. Test manually: `--confidence=medium --force`

**CI/CD failing:**
1. Run locally: `node scripts/mcp-validate-all.js --mcp=design-tokens`
2. Test MCPs: `node scripts/mcp-health-check.js`

### Documentation

- [CURSOR_WORKFLOWS.md](docs/CURSOR_WORKFLOWS.md) - Complete workflow guide
- [MCP Health Check](scripts/mcp-health-check.js) - Validate all MCPs
- [MCP Validate All](scripts/mcp-validate-all.js) - CI/CD validation script