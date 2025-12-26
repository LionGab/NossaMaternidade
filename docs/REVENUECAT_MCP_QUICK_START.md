# RevenueCat MCP - Quick Start

## ✅ Configuração Inicial (Já Feita!)

O RevenueCat MCP Server já está configurado em `.cursor/mcp.json`. 

**Você só precisa fazer uma coisa:**

## 🔑 Passo Único: Obter API v2 Secret Key

### 1. Acesse o Dashboard
https://app.revenuecat.com/

### 2. Navegue até API Keys
- Selecione seu projeto **Nossa Maternidade**
- Vá em **Project Settings** → **API Keys**
- Clique em **Create API Key**

### 3. Configure a Key
- **Type**: `API v2 Secret Key`
- **Name**: `MCP Server` (ou qualquer nome)
- **Permissions**: 
  - ✅ **Read-only** (se só quiser consultar)
  - ✅ **Read + Write** (se quiser criar/modificar recursos)
- Clique em **Create**

### 4. Copie a Key
- ⚠️ **Importante**: Copie imediatamente (só aparece uma vez!)
- Formato: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 5. Substitua no Arquivo

Abra `.cursor/mcp.json` e substitua:

```json
"Authorization": "Bearer YOUR_REVENUECAT_API_V2_SECRET_KEY_HERE"
```

Por:

```json
"Authorization": "Bearer sk_sua_chave_real_aqui"
```

### 6. Reinicie o Cursor
- Feche e abra o Cursor novamente
- O MCP Server será carregado automaticamente

## ✅ Teste

No chat do Cursor, teste:

```
@revenuecat List subscribers from last 7 days
```

Ou:

```
@revenuecat Get offering "default"
```

Se funcionar, você verá dados do RevenueCat! 🎉

---

## 🔒 Segurança

✅ O arquivo `.cursor/mcp.json` já está protegido no `.gitignore` (`.cursor/` está ignorado)

⚠️ **NUNCA** commite a API key no código ou compartilhe publicamente.

---

## 📚 Mais Informações

- **Setup Completo**: `docs/REVENUECAT_MCP_SETUP.md`
- **Config MCP**: `.claude/mcp-config.json`
- **Webhook Setup**: `docs/VERIFICACAO_WEBHOOK_REVENUECAT.md`

---

**Status Atual**: ⏳ Aguardando API v2 Secret Key do Dashboard

