# Relatório Consolidado – 08/12/2025

## 1. Contexto Rápido
- Projeto: App maternal NathIA (Expo 54, React Native 0.81, TypeScript estrito).
- UX: Home com desafios, chat NathIA, Vibe Check, comunidade moderada, badges.
- Stack: Supabase (auth, storage, RLS), IA multi-provider (Gemini ➜ GPT-4o ➜ Claude), NativeWind + tokens, TanStack Query disponível (subutilizado).
- Arquetipo de voz: Nathália Valente (tom direto, humor ácido, empatia verdadeira).

## 2. Diagnóstico Brutal
1. **Roteador de IA parado** – `chatService` ignora `aiRouter` e finge streaming com `setTimeout`. Sem fallback real e sem métricas de custo; guardrails de crise não acionam os modelos corretos.
2. **CI complacente** – `lint`, `type-check` e `test` usam `continue-on-error`. Qualquer build quebrado chega ao PR. `jest.config.js` ainda impede execução de testes (`.test.(ts|tsx|js)` não casa com nada).
3. **Home/Chat monolíticos** – ~1k linhas cada, `useEffect` chamando services direto, zero React Query. Regras de negócio e UI misturadas, difícil de testar.
4. **Assets externos + timezone** – Imagens críticas no Imgur e data de sono/check-in em UTC; basta estar no Brasil pós-meia-noite para quebrar metas.
5. **Wellness/offline** – Contexto salva tudo apenas no AsyncStorage, sem sync com Supabase. Usuária troca de celular e perde histórico.

## 3. Plano de Ataque (prioridade máxima ➜ mínima)
### 3.1 Estabilizar IA e Pipeline
- Integrar `chatService.sendMessageWithAI` ao `aiRouter.route` + `aiClient.call` (Gemini 2.5 Flash padrão, GPT-4o crise, Claude fallback). Registrar custos e circuit breaker.
- Garantir guardrails: detecção de crise ➜ modo GPT-4o + respostas seguras + disclaimers automáticos.
- Remover `continue-on-error` do workflow `ci.yml`; ajustar `jest.config.js` para `testMatch: ['**/__tests__/**/*.test.[jt]s?(x)']`. CI deve falhar se algo quebrar.

### 3.2 Refatorar Home e Chat
- Criar hooks com React Query (`useGuiltStatsQuery`, `useBookmarkQuery`, `useHomeDashboardQuery`). Componentes devem somente renderizar.
- Dividir `ChatScreen` em: `useChatSession`, `useCrisisMode`, `useDisclaimerConsent`, `useVoiceChat`. UI vira orquestrador leve.

### 3.3 Confiabilidade de Dados e Assets
- Mover imagens de `HomeScreen.constants.ts` para `assets/` ou Supabase Storage versão 2025.
- Ajustar `checkInService` e `sleepService` para usar timezone da usuária (helper `getStartOfDayLocal`).
- Sincronizar Wellness/Onboarding com Supabase (AsyncStorage apenas como cache offline).

## 4. Guia de Produção
- `docs/GUIA_PRODUCAO_BRUTAL_2025.md`: comparação Expo Go x Dev Build x Production, cronograma 4 semanas, modelos de IA recomendados e custos.
- `docs/CHECKLIST_LANCAMENTO_RAPIDO.md`: checklists semanais (contas, assets, builds, beta, stores).
- Script de verificação: `npm run validate:production` → roda `scripts/validate-production-readiness.js` (env, assets, docs, backend).

## 5. Modelos e Custos (Dez/2025)
| Caso | Modelo | Motivo |
|------|--------|--------|
| Conversa padrão | Gemini 2.5 Flash | Rápido, barato (US$0.10/M tokens)
| Crise emocional | GPT-4o | Segurança e qualidade (US$5/M tokens)
| Análise profunda / fallback | Claude 3.5 Sonnet | Coerência em longos contextos

Estimativa para 100k usuárias/mês com mix atual: **US$350–600**.

## 6. Próximos Passos (resumo executivo)
1. **Semana 0-1** – Corrigir CI + Jest, ligar `aiRouter`, revisar guardrails de crise e disclaimers.
2. **Semana 1-2** – Refatorar Home/Chat em hooks React Query, migrar assets críticos, ajustar timezone.
3. **Semana 2-3** – Sincronizar Wellness com Supabase, completar testes faltantes, gerar builds EAS preview.
4. **Semana 3-4** – Beta fechado (50–100 mães), screenshots finais, submissão App Store / Play Store.

Relatório criado em 08/12/2025. Atualize este documento sempre que completar uma fase ou descobrir novos riscos.
