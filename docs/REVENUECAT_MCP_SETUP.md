# RevenueCat MCP Server Setup

Configuração do RevenueCat MCP Server para integração com Cursor/Claude.

## 📋 Visão Geral

O RevenueCat MCP Server permite:

- ✅ Consultar subscribers e assinaturas
- ✅ Gerenciar produtos e offerings
- ✅ Criar entitlements
- ✅ Debug de pagamentos e subscriptions

## 🔑 Autenticação

### Diferença Importante

⚠️ **Webhook Secret ≠ API v2 Secret Key**

- **Webhook Secret** (`925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525`):
  - Usado para autenticar webhooks **DO RevenueCat PARA o Supabase**
  - Já configurado em `supabase/functions/webhook/index.ts`
  - Não serve para o MCP Server

- **API v2 Secret Key**:
  - Usado para o MCP Server fazer chamadas **À API do RevenueCat**
  - Necessário criar no RevenueCat Dashboard
  - Permite ler/criar recursos (subscribers, products, offerings)

### Como Obter a API v2 Secret Key

1. Acesse [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Selecione seu projeto **Nossa Maternidade**
3. Vá em **Project Settings → API Keys**
4. Clique em **Create API Key**
5. Escolha:
   - **Type**: API v2 Secret Key
   - **Name**: `MCP Server` (ou qualquer nome descritivo)
   - **Permissions**:
     - ✅ **Read-only** (se só quiser consultar dados)
     - ✅ **Read + Write** (se quiser criar/modificar recursos)
6. Clique em **Create**
7. **Copie a chave imediatamente** (ela só aparece uma vez!)
   - Formato: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🔧 Configuração para Cursor

### Opção 1: OAuth (Recomendado - Mais Fácil)

Se você usa Cursor, pode usar OAuth automático:

1. **Instalar Extension (se disponível)**:
   - Cursor → Extensions → Buscar "RevenueCat MCP"
   - Instalar se disponível

2. **OAuth será automático** quando você usar o MCP Server pela primeira vez

### Opção 2: API v2 Secret Key Manual

Se OAuth não estiver disponível ou preferir configurar manualmente:

#### 1. Adicionar ao Cursor Settings

Cursor → Settings → MCP → Adicionar servidor:

```json
{
  "revenuecat": {
    "url": "https://mcp.revenuecat.ai/mcp",
    "headers": {
      "Authorization": "Bearer sk_SUA_API_V2_SECRET_KEY_AQUI"
    }
  }
}
```

#### 2. Via mcp.json (Já configurado! ✅)

O arquivo `.cursor/mcp.json` já foi atualizado. Você só precisa:

1. Obter sua API v2 Secret Key no RevenueCat Dashboard
2. Substituir `YOUR_REVENUECAT_API_V2_SECRET_KEY_HERE` pela chave real

O arquivo já está configurado assim:

```json
{
  "mcpServers": {
    "revenuecat": {
      "url": "https://mcp.revenuecat.ai/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_REVENUECAT_API_V2_SECRET_KEY_HERE"
      }
    }
  }
}
```

#### 3. Via CLI (Claude Code)

Se você usa Claude Code CLI:

```bash
claude mcp add --transport http revenuecat https://mcp.revenuecat.ai/mcp --header "Authorization: Bearer sk_SUA_API_V2_SECRET_KEY_AQUI"
```

## 🔒 Segurança

⚠️ **NUNCA commite a API v2 Secret Key no código!**

1. Adicione ao `.gitignore`:

   ```
   .cursor/mcp.json
   .vscode/mcp.json
   *mcp.json
   ```

2. Use variáveis de ambiente (se possível):

   ```json
   {
     "headers": {
       "Authorization": "Bearer ${REVENUECAT_API_V2_KEY}"
     }
   }
   ```

3. Para compartilhar com time:
   - Use um gerenciador de secrets (1Password, LastPass, etc)
   - Ou crie uma chave separada para cada desenvolvedor

## ✅ Verificação

Após configurar, teste no Cursor:

```
@revenuecat List subscribers from last 7 days
```

Ou:

```
@revenuecat Get offering "default"
```

Se funcionar, você verá dados do RevenueCat no chat.

## 📚 Recursos

- **Documentação Oficial**: https://docs.revenuecat.com/mcp/setup
- **RevenueCat Dashboard**: https://app.revenuecat.com/
- **API v2 Docs**: https://docs.revenuecat.com/reference/api-v2

## 🔗 Links Úteis

- Webhook Secret: Ver `docs/VERIFICACAO_WEBHOOK_REVENUECAT.md`
- RevenueCat Setup Completo: Ver `docs/REVENUECAT_SETUP.md`
- Planos e Produtos: Ver `docs/PLANO_LANCAMENTO_10_DIAS.md`

---

**Status**: ⏳ Pendente (precisa criar API v2 Secret Key no Dashboard)
