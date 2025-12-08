# 🚀 Guia Rápido de Testes - Nossa Maternidade

## ✅ Status da Preparação

O aplicativo foi preparado para testes! As dependências foram instaladas e o arquivo `.env` foi criado.

## ✅ Variáveis de Ambiente Configuradas

**Status:** Todas as variáveis obrigatórias estão configuradas e validadas!

- ✅ EXPO_PUBLIC_SUPABASE_URL
- ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY
- ✅ EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL
- ✅ EXPO_PUBLIC_GEMINI_API_KEY
- ✅ EXPO_PUBLIC_CLAUDE_API_KEY
- ✅ EXPO_PUBLIC_OPENAI_API_KEY
- ✅ EXPO_PUBLIC_PERPLEXITY_API_KEY
- ✅ EXPO_PUBLIC_ELEVENLABS_API_KEY
- ✅ EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED

**Validação:** Execute `node scripts/validate-env.js` para verificar novamente.

## 🎯 Como Testar

### 1. Testar no Expo Go (Dispositivo Físico)

```bash
npm start
```

Ou:

```bash
npx expo start
```

**Passos:**

1. Instale o app **Expo Go** no seu celular (iOS ou Android)
2. Escaneie o QR code que aparecerá no terminal
3. O app será carregado no seu dispositivo

### 2. Testar em Emulador/Simulador

**Android:**

```bash
npm run android
```

**iOS (apenas macOS):**

```bash
npm run ios
```

### 3. Testar no Navegador (Web)

```bash
npm run web
```

O app abrirá em `http://localhost:8082`

## 📋 Checklist Antes de Testar

- [x] Variáveis de ambiente configuradas no `.env` ✅
- [ ] Projeto Supabase configurado e rodando
- [ ] Expo Go instalado no dispositivo (se testar em dispositivo físico)
- [ ] Emulador/Simulador configurado (se testar em emulador)

## 🔧 Comandos Úteis

### Verificar Configuração

```bash
node scripts/validate-env.js
```

### Verificar TypeScript

```bash
npm run type-check
```

### Executar Testes

```bash
npm test
```

### Limpar Cache e Reiniciar

```bash
npx expo start -c
```

## ⚠️ Problemas Conhecidos

### Erros de TypeScript

Alguns erros de TypeScript foram corrigidos, mas ainda podem existir avisos menores que não impedem a execução do app.

### Variáveis de Ambiente

Se o app não conectar ao Supabase, verifique:

1. Se as variáveis estão corretas no `.env`
2. Se o arquivo `.env` está na raiz do projeto
3. Se você reiniciou o servidor Expo após alterar o `.env`

## 📚 Documentação Adicional

- **README.md** - Visão geral completa do projeto
- **docs/EXPO_GO_COMPATIBILITY.md** - Compatibilidade com Expo Go
- **env.template** - Template de variáveis de ambiente

## 🎉 Pronto para Testar!

Após configurar as variáveis de ambiente, você pode iniciar o app com `npm start` e começar a testar!

---

**Última atualização:** Preparação concluída automaticamente pelo script `prepare-for-testing.ps1`
