# Plano de Execucao para Claude Code

**Copie e cole estes comandos no Claude Code (terminal /ide)**

---

## TAREFA 1: Corrigir MCP Config Global (~/.claude.json)

Cole isso no Claude Code:

```
Corrija o arquivo C:\Users\User\.claude.json para adicionar o wrapper "cmd /c" em todos os MCPs que usam npx.

O formato atual:
{
  "command": "npx",
  "args": ["-y", "pacote"]
}

Deve ser alterado para:
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "pacote"]
}

Aplique isso para: github, sequential-thinking, brave-search, filesystem

Mantenha o resto do arquivo intacto.
```

---

## TAREFA 2: Verificar Correcoes dos Agents

Cole isso no Claude Code:

```
Execute /doctor para verificar se os erros dos agents foram corrigidos.

Os arquivos .claude/agents/*.md ja foram corrigidos com frontmatter YAML (name + description).

Se ainda houver erros, liste quais sao.
```

---

## TAREFA 3: Design System Quick Wins (1h)

Cole isso no Claude Code:

```
Execute as seguintes migracoes de cores hardcoded para Tokens:

1. src/components/community/CommunityPostCard.tsx linha 191:
   - DE: backgroundColor: "black"
   - PARA: backgroundColor: Tokens.neutral[900]

2. src/components/community/NewPostModal.tsx linha 361:
   - DE: backgroundColor: "rgba(0,0,0,0.6)"
   - PARA: backgroundColor: Tokens.overlay.dark

3. src/components/chat/AIConsentModal.tsx linha 95:
   - DE: backgroundColor: "rgba(0, 0, 0, 0.5)"
   - PARA: backgroundColor: Tokens.overlay.medium

4. src/components/chat/ChatHistorySidebar.tsx linha 147:
   - DE: backgroundColor: "rgba(0, 0, 0, 0.5)"
   - PARA: backgroundColor: Tokens.overlay.medium

5. src/components/CommunityComposer.tsx linha 338:
   - DE: backgroundColor: "rgba(0, 0, 0, 0.5)"
   - PARA: backgroundColor: Tokens.overlay.medium

6. src/screens/PaywallScreenRedesign.tsx linha 246:
   - DE: "#F59E0B"
   - PARA: Tokens.semantic.light.warning

7. src/screens/PaywallScreenRedesign.tsx linha 251:
   - DE: "#FFFBEB"
   - PARA: Tokens.neutral[50]

8. src/screens/LoginScreenRedesign.tsx linha 756:
   - DE: "#FFFFFF"
   - PARA: Tokens.neutral[0]

Adicione o import { Tokens } from '@/theme/tokens' onde necessario.
Depois rode: npm run quality-gate
```

---

## TAREFA 4: Adicionar Semantic Alpha Tokens

Cole isso no Claude Code:

```
Adicione alpha variants em src/theme/tokens.ts dentro do objeto semantic:

semantic: {
  light: {
    // ... existentes ...

    // ADD THESE:
    successAlpha: "rgba(16, 185, 129, 0.15)",
    warningAlpha: "rgba(245, 158, 11, 0.15)",
    errorAlpha: "rgba(239, 68, 68, 0.15)",
    infoAlpha: "rgba(59, 130, 246, 0.15)",
  },
  dark: {
    // ... existentes ...

    // ADD THESE (same values):
    successAlpha: "rgba(16, 185, 129, 0.15)",
    warningAlpha: "rgba(245, 158, 11, 0.15)",
    errorAlpha: "rgba(239, 68, 68, 0.15)",
    infoAlpha: "rgba(59, 130, 246, 0.15)",
  },
}
```

---

## TAREFA 5: Lancamento - Legal Docs

Cole isso no Claude Code:

```
Deploy os legal docs em legal-pages/ usando Vercel:

1. Leia o conteudo de legal-pages/
2. Verifique se vercel.json esta configurado
3. Instrua como fazer deploy:
   - cd legal-pages
   - npx vercel --prod

URLs esperadas:
- /privacidade.html
- /termos.html
- /ai-disclaimer.html
```

---

## TAREFA 6: RevenueCat Checklist

Cole isso no Claude Code:

```
Gere um checklist interativo para configurar RevenueCat:

Valores EXATOS que devem ser usados (hardcoded no codigo):
- iOS Bundle: br.com.nossamaternidade.app
- Android Package: com.nossamaternidade.app
- Monthly Product: com.nossamaternidade.subscription.monthly
- Annual Product: com.nossamaternidade.subscription.annual
- Entitlement: "premium" (CASE-SENSITIVE)
- Offering: "default" (CASE-SENSITIVE)
- Webhook URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
- Webhook Secret: 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525

Gere um checklist markdown que eu possa seguir passo a passo.
```

---

## TAREFA 7: Quality Gate Final

Cole isso no Claude Code:

```
Execute a validacao completa do projeto:

1. npm run quality-gate
2. npm run typecheck
3. npm run lint

Se houver erros, corrija-os.
Depois liste o status: quantos erros restam, quais arquivos.
```

---

## Ordem de Execucao Recomendada

1. **TAREFA 1** - MCP Config (5 min)
2. **TAREFA 2** - Verificar Agents (2 min)
3. **TAREFA 3** - Design Quick Wins (30 min)
4. **TAREFA 4** - Semantic Tokens (10 min)
5. **TAREFA 7** - Quality Gate (5 min)
6. **TAREFA 5** - Legal Docs (30 min) - quando tiver tempo
7. **TAREFA 6** - RevenueCat (1h) - quando tiver tempo

---

## Comandos Uteis

```bash
# Validacao rapida
npm run validate

# Validacao completa
npm run quality-gate

# Verificar design system
npm run audit-design

# Iniciar app
npm start
```

---

**Gerado em:** 27/12/2025
**Para usar no:** Claude Code (/ide) com plano MAX
