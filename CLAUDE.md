# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎯 Project Overview

**Nossa Maternidade** is a mobile-first maternal wellness app with advanced AI integration (NathIA assistant). Built with Expo + React Native + Supabase + multi-model AI routing (Gemini/GPT-4o/Claude).

**Status:** Production-ready app for iOS App Store and Google Play Store
**Branch Strategy:** `feature/*` → `dev` → `main` (production)
**Deployment:** EAS Build + Supabase Edge Functions

---

## 🚀 Development Commands

### Daily Development

```bash
# Start development server (Expo Go compatible)
npm start

# Run on specific platforms
npm run ios              # iOS Simulator
npm run android          # Android Emulator
npm run web              # Web browser (port 8082)

# Type checking & linting
npm run type-check       # TypeScript strict mode validation
npm run lint             # ESLint (must pass before commit)
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Prettier formatting

# Validation (run before committing)
npm run validate         # Runs type-check + lint + validate:design
npm run validate:design  # Validates design tokens usage
npm run validate:env     # Checks .env configuration
npm run precommit        # Full pre-commit validation
```

### Testing

```bash
# Run tests with increased memory (handles large codebase)
npm test                 # All tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report (min 40% MVP, 60% Phase 2, 80% final)
npm run test:ci          # CI mode (used by GitHub Actions)
```

### Build & Deploy

```bash
# Development builds
npm run build:dev:android    # Android APK (development profile)
npm run build:dev:ios        # iOS (development profile)

# Production builds
npm run validate:android     # Pre-build validation for Android
npm run build:android        # Android App Bundle (production)
npm run build:ios            # iOS IPA (production)
npm run build:production     # Both platforms

# Submit to stores
npm run submit:android       # Submit to Google Play
npm run submit:ios           # Submit to App Store
npm run submit:all          # Submit to both stores

# Over-the-air updates
npm run update:prod         # Push OTA update to production
```

### Diagnostics & Automation

```bash
# Project health
npm run health-check         # Comprehensive project diagnostics
npm run diagnose:production  # Production readiness report (score 0-100)
npm run validate:production  # Final pre-deploy validation (uses diagnose-production-readiness.ts)

# Automated commit
npm run commit              # Auto-commit with validation
npm run commit:push         # Commit + push
npm run commit:skip         # Skip validation (use sparingly)

# Utilities
npm run keep-all            # Force sync recent changes
npm run list:todos          # List all TODO comments
npm run list:deprecated     # Find deprecated code
npm run fix:console-logs    # Remove console.log statements
npm run lint:analyze        # Analyze ESLint warnings
```

### Supabase Integration

```bash
# Generate TypeScript types from Supabase schema
npm run generate:types       # From remote project
npm run generate:types:local # From local Supabase instance

# Test connections
npm run test:connection      # Test Supabase connection
npm run test:gemini-edge     # Test Gemini Edge Function
npm run validate:gemini-secret # Validate Gemini API key setup
```

---

## 🏗️ Architecture Overview

### Core Stack

- **Frontend:** Expo SDK ~54.0.25 + React Native 0.81.5 + React 19.1.0
- **Language:** TypeScript 5.9.2 (strict mode, zero `any`)
- **Styling:** NativeWind (Tailwind for React Native) + Design Tokens
- **Navigation:** React Navigation 7 (Stack + Bottom Tabs)
- **State:** Zustand + TanStack Query (React Query)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **AI:** Multi-provider routing (Gemini 2.5 Flash → GPT-4o → Claude)

### Unique Architectural Patterns

#### 1. **AI Multi-Provider Routing with Circuit Breaker**

```
User Message → AIRouter (decides provider) → Edge Function → Model
                    │
                    ├─ Default: Gemini 2.5 Flash (economical)
                    ├─ Crisis: GPT-4o (safety-focused)
                    ├─ Deep Analysis: Gemini 2.5 Flash Thinking
                    └─ Fallback: Claude Opus (if others fail)
```

**Location:** `src/services/ai/aiRouter.ts`
**Key Feature:** Circuit breaker prevents cascading failures (5 failures → 5min cooldown)

**Why:** Balances cost (Gemini Flash cheapest) with safety (GPT-4o for crisis) and reliability (automatic fallback).

#### 2. **MCP (Model Context Protocol) with Lazy Loading**

The app implements Anthropic's Advanced Tool Use patterns with 85% token savings through lazy-loaded MCP servers.

```typescript
// Essential servers (loaded on init)
Priority 100: SupabaseMCP      // Database, auth, storage
Priority 80:  AnalyticsMCP     // Event tracking

// Optional servers (lazy-loaded on demand)
Priority 60: SentryMCP         // Crash monitoring
Priority 55: AppStoreConnectMCP // iOS releases
Priority 50: OpenAIMCP         // GPT-4o fallback
Priority 40: AnthropicMCP      // Claude fallback
```

**Location:** `src/agents/core/AgentOrchestrator.ts`, `src/mcp/servers/`
**Key Feature:** Dynamic MCP Gateway (Docker catalog integration) + parallel tool execution

**Why:** Reduces token costs by only loading tools when needed, while maintaining full capability.

#### 3. **Edge Function Architecture for Security**

All AI API keys are protected server-side. The app NEVER stores API keys locally.

```
Mobile App → Supabase Edge Function (Deno) → AI Provider API
                     ↓
              API key stored as Supabase Secret
              (not in .env or app code)
```

**Edge Functions:**
- `chat-gemini`: Gemini chat via server (primary)
- `chat-ai-openai`: GPT-4o fallback
- `chat-ai-claude`: Claude fallback
- `audio-ai`: Audio transcription + analysis
- `analyze-diary`: Diary sentiment analysis

**Location:** `supabase/functions/`

**Why:** Prevents API key exposure in mobile app bundles (security requirement for App Store/Play Store).

#### 4. **Service Layer Pattern with RLS**

All business logic lives in `src/services/`, NOT in components.

```typescript
// ✅ CORRECT: Component calls service
const { todayEmotion } = useEmotionTracking(); // Hook wraps service

// ❌ WRONG: Component has business logic
useEffect(() => {
  supabase.from('emotions').select().then(setData); // Direct DB call
}, []);
```

**Pattern:**
1. **Components** (`src/components/`) → Presentational only
2. **Hooks** (`src/hooks/`) → Bridge between UI and services
3. **Services** (`src/services/`) → All business logic + Supabase calls
4. **Validation** (`src/schemas/`) → Zod schemas for all inputs

**Why:** Testability (mock services), reusability (multiple components use same service), security (RLS policies enforced consistently).

#### 5. **Atomic Design System with Platform Adapters**

```
src/components/
├── atoms/           # Primitives: Button, Text, Badge, Box
├── molecules/       # Compositions: Card, Input, Modal
├── organisms/       # Complex: Chat, Dashboard, Profile
└── features/        # Feature-specific components

src/theme/
├── tokens.ts        # Design tokens (SINGLE SOURCE OF TRUTH)
├── cottonCandyTheme.ts  # Default theme (Pink + Purple)
├── floColors.ts     # Partner theme (Blue + Pink)
└── adapters/
    ├── ios.ts       # iOS-specific styles (blur, haptics)
    └── android.ts   # Android-specific styles (elevation, ripple)
```

**CRITICAL RULES:**
- ✅ Use `useThemeColors()` hook (supports dark mode)
- ✅ Import from `@/theme/tokens` (NOT legacy `@/design-system`)
- ❌ NEVER hardcode colors (`#FFFFFF`, `rgba(...)`)
- ❌ NEVER use `StyleSheet.create` (use NativeWind + tokens)

**Why:** Ensures WCAG AAA accessibility (7:1 contrast), dark mode support, and multi-brand capability.

---

## 📁 Key Directory Structure

```
src/
├── agents/                   # AI Agent System
│   ├── core/
│   │   ├── BaseAgent.ts              # Abstract base class
│   │   ├── AgentOrchestrator.ts      # Singleton orchestrator
│   │   ├── MCPLoader.ts              # Lazy-loading MCP servers
│   │   └── ToolExecutor.ts           # Parallel tool execution
│   └── maternal/
│       └── MaternalChatAgent.ts      # NathIA chat agent
│
├── mcp/                      # Model Context Protocol
│   ├── servers/              # 11 MCP servers
│   │   ├── SupabaseMCPServer.ts
│   │   ├── AnalyticsMCPServer.ts
│   │   ├── SentryMCPServer.ts
│   │   └── [+ 8 others]
│   ├── dynamic/              # Docker Dynamic MCP integration
│   └── types/                # Protocol definitions
│
├── services/                 # Business Logic Layer
│   ├── ai/
│   │   ├── aiRouter.ts               # Multi-model routing
│   │   ├── geminiService.ts          # Gemini via Edge Function
│   │   └── contentRecommendationService.ts
│   ├── supabase/             # Domain services (15+)
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   ├── diaryService.ts
│   │   └── habitService.ts
│   └── analytics/
│       ├── trackingService.ts
│       └── sentimentAnalysisService.ts
│
├── components/               # UI Components (Atomic Design)
│   ├── atoms/                # Primitives: Button, Text, Badge
│   ├── molecules/            # Card, Input, Modal
│   ├── organisms/            # Chat, Dashboard, Profile
│   └── features/             # Feature-specific components
│
├── screens/                  # Screen Components
│   ├── onboarding/
│   │   └── OnboardingFlowNew.tsx
│   ├── ChatScreen.tsx
│   ├── HomeScreen.tsx
│   ├── HabitsScreen.tsx
│   └── MundoNathScreen.tsx
│
├── theme/                    # Design System
│   ├── tokens.ts             # ⭐ SINGLE SOURCE OF TRUTH
│   ├── cottonCandyTheme.ts   # Default theme
│   ├── ThemeContext.tsx      # useTheme() hook
│   └── adapters/             # Platform-specific styles
│
├── hooks/                    # Custom React Hooks
├── types/                    # TypeScript Types
├── utils/                    # Utilities
│   ├── logger.ts             # ⚠️ Use instead of console.log
│   └── supabase.ts           # Supabase client setup
└── constants/                # App Constants

supabase/
├── functions/                # Edge Functions (Deno)
│   ├── chat-gemini/          # Primary chat function
│   ├── chat-ai-openai/       # GPT-4o fallback
│   ├── chat-ai-claude/       # Claude fallback
│   ├── audio-ai/             # Audio transcription
│   └── analyze-diary/        # Sentiment analysis
└── migrations/               # Database Schemas (8 migrations)
    ├── 20251208000001_core_tables.sql
    ├── 20251208000005_rls_policies.sql
    └── [+ 6 others]

scripts/                      # Automation Scripts
├── auto-commit.ts            # Automated commits with validation
├── validate-android.js       # Pre-build Android checks
├── diagnose-production-readiness.ts
└── [+ 20 others]
```

---

## 🔧 Critical Development Patterns

### TypeScript Strict Mode

```typescript
// ✅ CORRECT
export function saveEmotion(emotion: EmotionValue): Promise<void> {
  // Explicit types always
}

// ❌ WRONG
export function saveEmotion(emotion: any) {  // Never use 'any'
  // ...
}

// ✅ Use 'unknown' for truly unknown types
function processData(data: unknown) {
  if (typeof data === 'string') {
    // Type guard before using
  }
}
```

### Component Architecture

```typescript
// ✅ CORRECT: Presentational component
import { useEmotionTracking } from '@/hooks/useEmotionTracking';

export const MaternalCard = ({ variant }: Props) => {
  const { todayEmotion } = useEmotionTracking(); // Hook uses service

  return <Box><Text>{todayEmotion?.label}</Text></Box>;
};

// ❌ WRONG: Component with business logic
export const MaternalCard = () => {
  useEffect(() => {
    // Direct Supabase call in component - NEVER do this
    supabase.from('emotions').select().then(setData);
  }, []);
};
```

### Service Pattern

```typescript
// ✅ CORRECT: Service with validation and RLS
export const emotionService = {
  async saveEmotion(emotion: EmotionValue): Promise<void> {
    // 1. Validate with Zod
    const validated = emotionSchema.parse(emotion);

    // 2. Call Supabase (RLS enforces user filtering)
    const { error } = await supabase
      .from('emotion_logs')
      .insert(validated);

    // 3. Handle errors
    if (error) throw new Error(`Failed to save emotion: ${error.message}`);

    // 4. Track analytics
    await trackingService.track('emotion_logged', { emotion: validated.value });
  }
};
```

### Design Tokens Usage

```typescript
// ❌ WRONG: Hardcoded colors and spacing
<View style={{ backgroundColor: '#FFFFFF', padding: 16 }}>

// ❌ WRONG: Legacy design system
import { COLORS, SPACING } from '@/design-system';

// ✅ CORRECT: Modern tokens + theme-aware
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/theme';

const colors = useThemeColors();
<View className="p-4" style={{ backgroundColor: colors.background.card }}>
```

### Logging

```typescript
// ❌ WRONG: console.log
console.log('User logged in');

// ✅ CORRECT: Use logger utility
import { logger } from '@/utils/logger';
logger.info('User logged in', { userId: user.id });
logger.error('Failed to save', { error });
```

---

## 🚨 Critical Rules

### Security & Privacy

1. **NEVER store API keys in app code or .env**
   - ✅ Use Supabase Secrets for production
   - ✅ Call Edge Functions from mobile app
   - ❌ Don't use `EXPO_PUBLIC_GEMINI_API_KEY` (removed for security)

2. **ALWAYS enable RLS (Row Level Security) on Supabase tables**
   - Every table must have RLS policies
   - Policies must filter by `auth.uid()`
   - Test with different users to verify isolation

3. **NEVER commit secrets**
   - `.env` is in `.gitignore`
   - Use `.env.example` as template
   - API keys go in Supabase dashboard (Settings → Secrets)

### Code Quality

1. **TypeScript strict mode - zero `any`**
   - Use `unknown` + type guards if truly unknown
   - Run `npm run type-check` before every commit
   - 0 errors required for PR approval

2. **Components are presentational only**
   - No Supabase calls in components
   - No business logic in components
   - Use hooks to connect components to services

3. **All functions need tests**
   - Minimum 40% coverage for MVP
   - Test services with mocks (don't hit real DB)
   - Use `__tests__/` directory next to code

4. **No console.log in production**
   - Use `logger.info()`, `logger.error()`
   - Run `npm run fix:console-logs` before commit

### Design System

1. **ONLY use `@/theme/tokens` (NOT `@/design-system`)**
   - Legacy system is deprecated
   - Use `useThemeColors()` for theme-aware colors

2. **Validate design tokens before commit**
   ```bash
   npm run validate:design
   ```

3. **WCAG AAA compliance required**
   - 7:1 contrast ratio for text
   - Touch targets ≥ 44pt (iOS) / 48dp (Android)
   - All interactive elements need `accessibilityLabel`

4. **Test dark mode**
   - Use `isDark` from `useTheme()` hook
   - All colors must support dark mode variants

### Git Workflow

1. **Branch protection on `main`**
   - NEVER push directly to `main`
   - Feature branches → PR → `dev` → PR → `main`

2. **Conventional Commits (Portuguese)**
   ```bash
   feat: adiciona funcionalidade X
   fix: corrige bug Y
   refactor: refatora serviço Z
   docs: atualiza documentação
   test: adiciona testes para W
   chore: atualiza dependências
   ```

3. **Pre-commit validation**
   ```bash
   npm run precommit  # Runs type-check + lint + validate:design
   ```

---

## 🧪 Testing Patterns

### Service Tests

```typescript
// __tests__/services/emotionService.test.ts
import { emotionService } from '@/services/supabase/emotionService';
import { supabase } from '@/utils/supabase';

jest.mock('@/utils/supabase');

describe('emotionService', () => {
  it('should save emotion to Supabase', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    });

    await emotionService.saveEmotion({ value: 5, label: 'Feliz' });

    expect(mockInsert).toHaveBeenCalledWith({ value: 5, label: 'Feliz' });
  });
});
```

### Component Tests

```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/atoms/Button';

describe('Button', () => {
  it('should call onClick when pressed', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onPress={handleClick}>Click Me</Button>);

    fireEvent.press(getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🎨 Design System Reference

### Color Tokens

```typescript
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/theme';

const colors = useThemeColors();

// Background colors
colors.background.primary    // Main background
colors.background.card       // Card background (supports dark mode)
colors.background.elevated   // Elevated surfaces

// Text colors
colors.text.primary          // Primary text
colors.text.secondary        // Secondary text
colors.text.disabled         // Disabled text

// Brand colors
colors.brand.primary         // Primary brand (#EC4899 pink)
colors.brand.secondary       // Secondary brand
```

### Spacing

```typescript
import { Tokens } from '@/theme/tokens';

// Use multiples of 4px
Tokens.spacing['1']   // 4px
Tokens.spacing['2']   // 8px
Tokens.spacing['4']   // 16px
Tokens.spacing['8']   // 32px
```

### Typography

```typescript
import { Tokens } from '@/theme/tokens';

// Font sizes
Tokens.fontSize.xs    // 12px
Tokens.fontSize.sm    // 14px
Tokens.fontSize.base  // 16px
Tokens.fontSize.lg    // 18px
Tokens.fontSize.xl    // 20px
```

---

## 🔍 Common Tasks

### Adding a New Feature

1. **Create feature branch**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/nome-da-funcionalidade
   ```

2. **Create service layer**
   ```bash
   # Create service
   touch src/services/supabase/newFeatureService.ts

   # Create hook
   touch src/hooks/useNewFeature.ts

   # Create types
   touch src/types/newFeature.ts
   ```

3. **Implement with validation**
   - Add Zod schema in `src/schemas/`
   - Create service with RLS-ready queries
   - Create hook that wraps service
   - Create component that uses hook

4. **Add tests**
   ```bash
   touch __tests__/services/newFeatureService.test.ts
   touch __tests__/hooks/useNewFeature.test.ts
   ```

5. **Validate before commit**
   ```bash
   npm run type-check
   npm run lint
   npm run validate:design
   npm test
   ```

### Updating Supabase Schema

1. **Create migration locally**
   ```bash
   # If using local Supabase
   supabase migration new feature_name

   # Edit migration SQL
   code supabase/migrations/[timestamp]_feature_name.sql
   ```

2. **Apply migration**
   ```bash
   # Local
   supabase db reset

   # Remote (production)
   supabase db push
   ```

3. **Generate TypeScript types**
   ```bash
   npm run generate:types
   ```

### Debugging AI Chat Issues

1. **Check Edge Function logs**
   ```bash
   # In Supabase dashboard: Edge Functions → chat-gemini → Logs
   ```

2. **Test Edge Function directly**
   ```bash
   npm run test:gemini-edge
   ```

3. **Verify circuit breaker status**
   ```typescript
   import { aiRouter } from '@/services/ai/aiRouter';
   const stats = aiRouter.getStats();
   console.log('Circuit breaker:', stats.circuitBreaker);
   ```

4. **Check fallback chain**
   - Primary: Gemini (via `chat-gemini` Edge Function)
   - Fallback 1: GPT-4o (via `chat-ai-openai` Edge Function)
   - Fallback 2: Claude (via `chat-ai-claude` Edge Function)

---

## 📚 Important Documentation

- **Definitive Document:** `docs/DOCUMENTO_DEFINITIVO_NOSSA_MATERNIDADE.md` - Complete project documentation
- **Design System:** `docs/design/` - Design principles, tokens, component patterns
- **AI Architecture:** `docs/NATHIA_ARCHITECTURE.md` - AI system, routing, MCP details
- **Deploy Guide:** `DEPLOY_STORES.md` - Complete guide for App Store and Google Play
- **Android Deploy:** `docs/DEPLOY_ANDROID.md` - Android-specific deployment
- **Backend Setup:** `docs/SETUP_BACKEND.md` - Supabase + Edge Functions setup

---

## ⚠️ Known Issues & Workarounds

### Expo Go Compatibility

- **New Architecture disabled** (`newArchEnabled: false` in `app.config.js`)
- **Why:** Expo Go doesn't support new architecture yet
- **For production:** Use `npm run build:dev:android` to create development build with new architecture

### Memory Issues in Tests

- Tests run with increased memory: `node --max-old-space-size=4096`
- **Why:** Large codebase + multiple AI integrations
- **If tests crash:** Run `npm run test:ci` (optimized for CI)

### RLS Policy Testing

- **Always test RLS with multiple users**
- **Common mistake:** Forgetting to filter by `auth.uid()`
- **Solution:** Create test users and verify data isolation

---

## 🆘 Troubleshooting

### TypeScript Errors

```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run type-check
```

### Build Failures

```bash
# Clear Expo cache
npx expo start -c

# For Android
npm run validate:android
```

### Supabase Connection Issues

```bash
# Test connection
npm run test:connection

# Verify .env variables
npm run validate:env
```

---

**Last Updated:** December 11, 2024
**Version:** 1.0.0
**Author:** LionGab (optimized for Claude Code)
