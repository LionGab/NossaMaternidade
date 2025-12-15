# 📚 Documentação - Deploy nas Stores

Bem-vindo à documentação completa para deploy do **Nossa Maternidade** nas lojas.

## 🎯 Por Onde Começar?

### Se você está começando agora:

1. **Leia primeiro:** [`PASSO_A_PASSO_DEPLOY.md`](./PASSO_A_PASSO_DEPLOY.md)
   - Guia completo passo a passo
   - Todos os detalhes explicados
   - Checkpoints em cada etapa

### Se você já leu tudo e quer referência rápida:

2. **Guia rápido:** [`QUICK_START_DEPLOY.md`](./QUICK_START_DEPLOY.md)
   - Comandos principais
   - Checklist mínimo

### Para tarefas específicas:

3. **Configurar Secrets:** [`SECRETS_SETUP.md`](./SECRETS_SETUP.md)
   - Como configurar variáveis de ambiente no EAS
   - Lista completa de secrets necessários

4. **Checklist Completo:** [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
   - Verificar tudo antes de submeter
   - Item por item

---

## 📋 Todos os Documentos

### Guias Principais

- **[PASSO_A_PASSO_DEPLOY.md](./PASSO_A_PASSO_DEPLOY.md)** ⭐
  - Guia completo e detalhado
  - Todos os passos na ordem correta
  - **COMEÇE POR AQUI**

- **[QUICK_START_DEPLOY.md](./QUICK_START_DEPLOY.md)**
  - Guia rápido para deploy
  - Para quem já sabe o que fazer

### Referências

- **[SECRETS_SETUP.md](./SECRETS_SETUP.md)**
  - Configuração de secrets no EAS
  - Lista completa de variáveis

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**
  - Checklist completo pré-deploy
  - Verifique tudo antes de submeter

### Resumos e Status

- **[BUILD_PREPARATION_SUMMARY.md](./BUILD_PREPARATION_SUMMARY.md)**
  - Resumo das mudanças implementadas
  - Estrutura de arquivos criados

- **[RESUMO_IMPLEMENTACAO.md](./RESUMO_IMPLEMENTACAO.md)**
  - Status completo da implementação
  - O que foi feito e o que falta

---

## 🚀 Comandos Principais

```bash
# 1. Instalar dependências
npm install

# 2. Validar projeto
npm run check-build-ready

# 3. Build
eas build --platform all --profile production

# 4. Submit
eas submit --platform all
```

---

## 🔑 Secrets Necessários

Você precisa configurar os seguintes secrets no EAS:

1. `EXPO_PUBLIC_SUPABASE_URL`
2. `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL`
4. `EXPO_PUBLIC_OPENAI_API_KEY`
5. `EXPO_PUBLIC_GROK_API_KEY` (opcional)

Veja [`SECRETS_SETUP.md`](./SECRETS_SETUP.md) para detalhes.

---

## 📞 Próximos Passos

1. **Leia:** [`PASSO_A_PASSO_DEPLOY.md`](./PASSO_A_PASSO_DEPLOY.md)
2. **Configure:** Secrets no EAS (veja [`SECRETS_SETUP.md`](./SECRETS_SETUP.md))
3. **Crie:** Assets faltantes (screenshots, feature graphic)
4. **Crie:** Contas nas lojas (Apple Developer, Google Play)
5. **Configure:** Apps nas lojas (metadata, informações)
6. **Build:** Execute builds de produção
7. **Submit:** Submeta para review

---

**Última atualização:** 2025
