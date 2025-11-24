# Variáveis de Ambiente

Este arquivo documenta todas as variáveis de ambiente necessárias para o projeto.

## Como Configurar

1. Crie um arquivo `.env` na raiz do projeto
2. Copie as variáveis abaixo e preencha com seus valores

## Variáveis Obrigatórias

```env
# Configuração do Gemini AI
# Obtenha sua chave em: https://makersuite.google.com/app/apikey
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui

# Configuração do Supabase
# Obtenha essas informações no painel do seu projeto Supabase
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## Variáveis Opcionais

```env
# Configuração do Sentry (opcional)
# EXPO_PUBLIC_SENTRY_DSN=sua_dsn_sentry_aqui

# Configuração do OneSignal (opcional)
# EXPO_PUBLIC_ONESIGNAL_APP_ID=seu_app_id_aqui
```

## Importante

- Todas as variáveis devem usar o prefixo `EXPO_PUBLIC_` para serem acessíveis no código do cliente
- Após criar ou modificar o arquivo `.env`, reinicie o servidor Expo (`npm start`)
- O arquivo `.env` não deve ser commitado no Git (já está no .gitignore)

