# 🔐 Configuração de Secrets no EAS

Este guia explica como configurar variáveis de ambiente (secrets) no EAS Build para builds de produção.

## 📋 Secrets Necessários

### Obrigatórios para Produção

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL

# APIs de IA
EXPO_PUBLIC_OPENAI_API_KEY
EXPO_PUBLIC_GROK_API_KEY
```

### Opcionais

```bash
# Upload de imagens
EXPO_PUBLIC_IMGUR_CLIENT_ID

# Voz da NathIA
EXPO_PUBLIC_ELEVENLABS_API_KEY
EXPO_PUBLIC_ELEVENLABS_VOICE_ID

# Premium/Assinaturas
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

## 🚀 Como Configurar

### Via CLI (Recomendado)

```bash
# 1. Login no EAS
eas login

# 2. Criar secrets um por um
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key-here"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://your-project.supabase.co/functions/v1"
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "xai-..."

# Feature flags
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value "true"
```

### Verificar Secrets Configurados

```bash
# Listar todos os secrets
eas secret:list

# Ver valor de um secret específico
eas secret:get EXPO_PUBLIC_SUPABASE_URL
```

### Atualizar Secret Existente

```bash
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "new-value"
```

### Remover Secret

```bash
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
```

## ⚠️ Importante

1. **Nunca commite valores reais** de secrets no código
2. **Use apenas `EXPO_PUBLIC_*`** para variáveis que precisam estar no bundle do app
3. **Secrets são injetados** automaticamente durante o build
4. **Para desenvolvimento local**, use arquivo `.env` (não commitado)

## 🔍 Verificação

Após configurar secrets, você pode verificar se estão disponíveis no build:

```bash
# Build de preview para testar
eas build --platform android --profile preview

# Verificar logs do build
eas build:list
```

## 📚 Documentação Oficial

- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [Environment Variables](https://docs.expo.dev/guides/environment-variables/)
