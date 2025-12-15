# Configuração de MCPs - Nossa Maternidade

Este documento descreve como configurar os MCPs (Model Context Protocol) recomendados para o projeto.

## MCPs Configurados

### 1. Supabase MCP (Prioridade Alta)

**Status**: ✅ Já disponível via ferramentas MCP

**Configuração Necessária**:

- Autenticação via Supabase CLI ou token de acesso
- Projeto ID do Supabase configurado

**Uso**:

- Migrations: `supabase/migrations/*`
- Diagnósticos: Security/Performance Advisors
- Logs: API, Auth, Storage, Realtime
- Geração de tipos TypeScript do banco

**Comandos Úteis**:

```bash
# Listar projetos
supabase projects list

# Linkar projeto local
supabase link --project-ref YOUR_PROJECT_REF

# Ver advisors de segurança
# (via MCP tool: mcp_Supabase_get_advisors)
```

### 2. Context7 MCP (Prioridade Alta)

**Status**: ✅ Já disponível via ferramentas MCP

**Configuração**: Automática - não requer setup adicional

**Uso**:

- Documentação atualizada de:
  - `react-navigation` v7
  - `expo-notifications`
  - `supabase-js` v2
  - `react-native-reanimated`
  - `nativewind`
  - `@shopify/flash-list`

**Exemplo de Uso**:

```typescript
// Buscar docs de react-navigation
mcp_Context7_get -
  library -
  docs({
    context7CompatibleLibraryID: "/react-navigation/react-navigation",
    mode: "code",
    topic: "navigation",
  });
```

### 3. Figma MCP (Prioridade Média - Requer Figma Desktop)

**Status**: ⚠️ Requer configuração manual

**Pré-requisitos**:

1. Figma Desktop App instalado
2. Arquivo do design aberto no Figma
3. Acesso ao fileKey do projeto

**Configuração**:

1. Abra o Figma Desktop App
2. Abra o arquivo do design "Nossa Maternidade"
3. Obtenha o fileKey da URL: `https://figma.com/design/{fileKey}/...`
4. Use as ferramentas MCP do Figma para:
   - Capturar screenshots de frames
   - Ler design variables
   - Gerar regras do design system
   - Mapear componentes (Code Connect)

**Uso**:

```typescript
// Capturar screenshot de um frame
mcp_Figma_get_screenshot({
  fileKey: "YOUR_FILE_KEY",
  nodeId: "123:456",
});

// Obter design context
mcp_Figma_get_design_context({
  fileKey: "YOUR_FILE_KEY",
  nodeId: "123:456",
});
```

### 4. Linear MCP (Prioridade Média - Requer Linear Account)

**Status**: ⚠️ Requer configuração manual

**Pré-requisitos**:

1. Conta Linear criada
2. Workspace configurado
3. API Key gerada

**Configuração**:

1. Acesse: https://linear.app/settings/api
2. Gere uma API Key pessoal
3. Configure no Cursor MCP settings (se necessário)

**Uso**:

- Criar issues do plano de melhorias
- Rastrear progresso por fase
- Comentários e status updates
- Integração com o plano de desenvolvimento

**Exemplo**:

```typescript
// Criar issue
mcp_Linear_create_issue({
  title: "Implementar dark mode completo",
  team: "Engineering",
  description: "Aplicar dark mode em todas as telas usando useTheme",
});
```

### 5. Playwright MCP (Prioridade Baixa - Para Web Testing)

**Status**: ✅ Já disponível via ferramentas MCP

**Uso**:

- Testes visuais no Expo Web (`http://localhost:8081/`)
- Snapshots de telas para regressão
- Validação de layout responsivo
- Debug de problemas de renderização

**Exemplo**:

```typescript
// Navegar e capturar snapshot
mcp_Playwright_browser_navigate({ url: "http://localhost:8081/" });
mcp_Playwright_browser_snapshot();
mcp_Playwright_browser_take_screenshot({ fullPage: true });
```

## Ordem de Implementação Recomendada

1. **Supabase MCP** - Já configurado, usar imediatamente
2. **Context7** - Já disponível, usar para documentação
3. **Playwright** - Para validação visual durante desenvolvimento
4. **Figma** - Se você tem acesso ao design file
5. **Linear** - Se você usa Linear para gerenciamento de projetos

## Verificação de Configuração

Para verificar quais MCPs estão disponíveis, use:

```bash
# No Cursor, os MCPs aparecem automaticamente nas ferramentas disponíveis
# Verifique as ferramentas que começam com "mcp_"
```

## Troubleshooting

### Supabase MCP não funciona

- Verifique se o Supabase CLI está instalado: `supabase --version`
- Verifique se está autenticado: `supabase login`
- Verifique se o projeto está linkado: `supabase link`

### Figma MCP não funciona

- Certifique-se de que o Figma Desktop App está aberto
- Verifique se o arquivo está aberto no Figma
- Confirme que o fileKey está correto

### Linear MCP não funciona

- Verifique se a API Key está configurada corretamente
- Confirme que você tem permissões no workspace Linear
