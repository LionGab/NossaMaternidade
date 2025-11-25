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
