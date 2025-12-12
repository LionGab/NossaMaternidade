# Sincronização do Prompt NathIA

## Visão Geral

O prompt da NathIA existe em dois locais:

- **Client**: `src/ai/prompts/nathiaSystemPrompt.ts` (fonte canônica)
- **Server**: `supabase/functions/_shared/nathiaSystemPrompt.ts` (gerado automaticamente)

O arquivo server é **gerado automaticamente** a partir do client para garantir sincronização.

## ⚠️ Importante

**NUNCA edite manualmente** o arquivo `supabase/functions/_shared/nathiaSystemPrompt.ts`.

Ele contém um aviso no topo indicando que é gerado automaticamente. Qualquer edição manual será sobrescrita na próxima sincronização.

## Comandos Disponíveis

### Sincronizar Prompt

```bash
npm run sync:nathia-prompt
```

Sincroniza o prompt do client para o server. Use sempre que modificar `src/ai/prompts/nathiaSystemPrompt.ts`.

### Validar Sincronização

```bash
npm run validate:nathia-prompt
```

Verifica se os prompts client e server estão sincronizados. Retorna erro se houver diferenças.

## Fluxo de Trabalho

### Ao Modificar o Prompt

1. Edite apenas `src/ai/prompts/nathiaSystemPrompt.ts`
2. Execute `npm run sync:nathia-prompt`
3. Verifique com `npm run validate:nathia-prompt`
4. Commit ambos os arquivos

### Validação Automática

O script `npm run validate` inclui validação de sincronização do prompt, garantindo que não haja dessincronização antes de commits importantes.

## Estrutura dos Arquivos

### Client (`src/ai/prompts/nathiaSystemPrompt.ts`)

```typescript
export const NATHIA_SYSTEM_PROMPT_VERSION = '2.0.0';
export const NATHIA_SYSTEM_PROMPT = `...`;
export const NATHIA_MANDATORY_RULES = `...`;
```

### Server (`supabase/functions/_shared/nathiaSystemPrompt.ts`)

```typescript
// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE
export const NATHIA_SYSTEM_PROMPT = `...`;
export const NATHIA_MANDATORY_RULES = `...`;
```

## Por Que Duplicar?

1. **Ambientes diferentes**: Client (TypeScript/React Native) e Server (Deno/Edge Functions)
2. **Fallback seguro**: Edge Functions podem usar o prompt mesmo se o client não enviar `systemInstruction`
3. **Compatibilidade**: Apps desatualizados ainda recebem o prompt correto

## Troubleshooting

### Erro: "Prompts não estão sincronizados"

Execute:

```bash
npm run sync:nathia-prompt
```

### Erro: "Arquivo não encontrado"

Verifique se os caminhos estão corretos:

- Client: `src/ai/prompts/nathiaSystemPrompt.ts`
- Server: `supabase/functions/_shared/nathiaSystemPrompt.ts`

### Versões diferentes

Se a validação mostrar versões diferentes mas prompts idênticos, execute a sincronização para atualizar os comentários.

## CI/CD

Recomenda-se adicionar validação no CI/CD:

```yaml
# .github/workflows/ci.yml
- name: Validate NathIA Prompt Sync
  run: npm run validate:nathia-prompt
```

## Histórico de Versões

- **2.0.0** (Dezembro 2025): Versão consolidada final baseada em 3 dossiês completos
