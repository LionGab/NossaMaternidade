# 👥 Setup para Colaboradores - Nossa Maternidade

Bem-vindo(a) ao projeto! Este guia te ajudará a configurar o ambiente de desenvolvimento de forma segura.

## 🔐 Segurança - REGRAS CRÍTICAS

### ⚠️ NUNCA FAÇA:

- ❌ **NUNCA** inclua o arquivo `.env` ou qualquer arquivo com chaves de API em commits
- ❌ **NUNCA** coloque chaves de API diretamente no código (hardcoded)
- ❌ **NUNCA** compartilhe chaves de API em mensagens, issues ou PRs
- ❌ **NUNCA** inclua arquivos com extensões sensíveis (`.key`, `.pem`, `.p12`, etc.) em commits
- ❌ **NUNCA** remova entradas do `.gitignore` relacionadas a secrets

### ✅ SEMPRE FAÇA:

- ✅ Use apenas variáveis de ambiente (`process.env.EXPO_PUBLIC_*`)
- ✅ Use placeholders em arquivos de exemplo (`env.template`)
- ✅ Solicite acesso às chaves ao mantenedor do projeto
- ✅ Use `git status` para verificar arquivos não rastreados

## 🚀 Setup Inicial

### 1. Clone o Repositório

```bash
git clone https://github.com/LionGab/NossaMaternidade.git
cd NossaMaternidade
```

### 2. Instale Dependências

```bash
npm install
```

### 3. Configure Variáveis de Ambiente

1. **Copie o template:**

   ```bash
   # Windows
   copy env.template .env

   # Linux/Mac
   cp env.template .env
   ```

2. **Preencha as variáveis no `.env`:**

   ⚠️ **IMPORTANTE:** Para obter as chaves de API reais, entre em contato com o mantenedor do projeto.

   O arquivo `.env` deve conter:

   ```env
   # Supabase
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1

   # AI APIs (solicite ao mantenedor)
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   EXPO_PUBLIC_CLAUDE_API_KEY=your_claude_api_key_here
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

   # Outras configurações
   EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
   EXPO_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

3. **Verifique se o `.env` está no `.gitignore`:**
   ```bash
   git check-ignore .env
   # Deve retornar: .env
   ```

### 4. Valide a Configuração

```bash
# Verificar se todas as variáveis estão configuradas
npm run validate:env

# Verificar se não há secrets no código
npm run check:secrets
```

## 🧪 Desenvolvimento

### Executar o App

```bash
# Iniciar Expo
npx expo start

# Ou com cache limpo
npx expo start -c
```

### Executar Testes

```bash
# Todos os testes
npm test

# Com coverage
npm run test:coverage

# Testes específicos
npm test -- --testPathPattern=HomeScreen
```

### Validações

```bash
# TypeScript
npm run type-check

# Lint
npm run lint

# Design Tokens
npm run validate:design

# Tudo de uma vez
npm run validate:all
```

## 📝 Workflow de Desenvolvimento

### 1. Criar uma Branch

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/correcao-bug
```

### 2. Verificações Antes de Criar PR

```bash
# Verificar se não há secrets no código
npm run check:secrets

# Verificar TypeScript
npm run type-check

# Verificar lint
npm run lint
```

### 3. Criar Pull Request

1. Crie um PR no GitHub com suas mudanças
2. Aguarde as verificações automáticas passarem
3. Aguarde review do mantenedor

## 🔍 Verificações Automáticas

O projeto tem verificações automáticas que rodam em cada PR:

- ✅ **Secret Scanning:** Detecta chaves de API expostas
- ✅ **TypeScript:** Verifica erros de tipo
- ✅ **Lint:** Verifica qualidade de código
- ✅ **Design Tokens:** Valida uso correto do design system
- ✅ **Testes:** Executa suite de testes

**Se alguma verificação falhar, corrija antes de solicitar review.**

## 🆘 Problemas Comuns

### "Variável de ambiente não definida"

**Solução:** Verifique se o arquivo `.env` existe e contém a variável necessária.

```bash
# Verificar se .env existe
ls -la .env  # Linux/Mac
dir .env     # Windows

# Verificar conteúdo (sem expor valores)
cat .env | grep EXPO_PUBLIC_SUPABASE_URL
```

### "Secret detectado no código"

**Solução:**

1. Remova a chave do código
2. Use variável de ambiente
3. Verifique o histórico: `git log -p -S "sua-chave"`

### "Build falha no GitHub Actions"

**Solução:**

- Verifique os logs do workflow
- Secrets podem não estar configurados no GitHub
- Entre em contato com o mantenedor

## 📚 Recursos Adicionais

- [Documentação do Projeto](./README.md)
- [Setup do Backend](./SETUP_BACKEND.md)
- [Guia de Contribuição](./CONTRIBUTING.md) (se existir)
- [Design System](./DESIGN_SYSTEM_SUMMARY.md)

## 🤝 Contato

Para questões sobre:

- **Chaves de API:** Entre em contato com o mantenedor do projeto
- **Configuração:** Abra uma issue no GitHub
- **Dúvidas técnicas:** Consulte a documentação ou abra uma discussão

---

**Lembre-se:** Segurança é responsabilidade de todos! 🔒
