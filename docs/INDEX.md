# 📑 Índice Rápido - Documentação Nossa Maternidade

Acesso rápido aos documentos mais importantes.

---

## 🎯 Documentos Essenciais (Leia Primeiro)

### 1. 🚀 Publicação nas Lojas
**[GUIA_PRODUCAO_BRUTAL_2025.md](./GUIA_PRODUCAO_BRUTAL_2025.md)**
- ⭐ **COMECE AQUI** se você quer publicar o app
- Guia completo passo a passo
- Checklist de bloqueadores
- Modelos de IA recomendados
- Cronograma realista

### 2. 🔍 Melhorias de Código
**[MELHORIAS_IDENTIFICADAS.md](./MELHORIAS_IDENTIFICADAS.md)**
- Análise completa da base de código
- 602 cores hardcoded identificadas
- Plano de ação priorizado
- Scripts de migração

### 3. ✅ Checklist de Deploy
**[DEPLOYMENT_READINESS_CHECKLIST.md](./DEPLOYMENT_READINESS_CHECKLIST.md)**
- Checklist detalhado
- Bloqueadores críticos
- Problemas importantes
- Otimizações

---

## 📋 Checklists Rápidos

| Documento | Quando Usar |
|-----------|-------------|
| [APP_STORES_CHECKLIST.md](./APP_STORES_CHECKLIST.md) | Antes de submeter para lojas |
| [CHECKLIST_PUBLICATION.md](./CHECKLIST_PUBLICATION.md) | Checklist final de publicação |
| [release-checklist.md](./release-checklist.md) | Processo de release |

---

## 🛠️ Setup e Configuração

| Documento | Descrição |
|-----------|-----------|
| [SETUP_BACKEND.md](./SETUP_BACKEND.md) | Configurar Supabase |
| [EXPO_GO_COMPATIBILITY.md](./EXPO_GO_COMPATIBILITY.md) | Compatibilidade Expo Go |
| [CONFIGURAR_MCP_CURSOR.md](./CONFIGURAR_MCP_CURSOR.md) | Setup MCP no Cursor |

---

## 📱 Publicação Específica

| Documento | Plataforma |
|-----------|------------|
| [REQUIREMENTS_APP_STORES.md](./REQUIREMENTS_APP_STORES.md) | iOS + Android |
| [DEPLOY_ANDROID.md](./DEPLOY_ANDROID.md) | Android (Google Play) |
| [STORE_ASSETS_GUIDE.md](./STORE_ASSETS_GUIDE.md) | Assets para lojas |

---

## ⚖️ Legal e Compliance

| Documento | Tipo |
|-----------|------|
| [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) | Política de Privacidade |
| [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md) | Termos de Uso |
| [MEDICAL_DISCLAIMER.md](./MEDICAL_DISCLAIMER.md) | Disclaimer Médico |
| [data-safety-google-play.md](./data-safety-google-play.md) | Data Safety (Google Play) |

---

## 🤖 IA e Integrações

| Documento | Descrição |
|-----------|-----------|
| [CLAUDE_AI_GUIDE.md](./CLAUDE_AI_GUIDE.md) | Integração Claude AI |

---

## 🧪 Testes e Qualidade

| Documento | Descrição |
|-----------|-----------|
| [TESTING_QUICK_GUIDE.md](./TESTING_QUICK_GUIDE.md) | Guia rápido de testes |

---

## 📖 Contexto

| Documento | Descrição |
|-----------|-----------|
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Contexto completo do projeto |

---

## 🔧 Scripts e Ferramentas

### Validação
```bash
npm run validate:production  # Validar prontidão para produção
npm run validate:design     # Validar design tokens
npm run type-check          # Verificar TypeScript
npm run health-check        # Health check completo
```

### Build
```bash
npm run build:dev          # Development build
npm run build:production   # Production build
npm run submit:ios        # Submeter iOS
npm run submit:android    # Submeter Android
```

### Migração
```bash
node scripts/migrate-hardcoded-colors.js --all  # Migrar cores
```

---

## 🗺️ Fluxo Recomendado

### Para Publicar o App:

1. **Leia:** [GUIA_PRODUCAO_BRUTAL_2025.md](./GUIA_PRODUCAO_BRUTAL_2025.md)
2. **Execute:** `npm run validate:production`
3. **Configure:** Backend (SETUP_BACKEND.md)
4. **Prepare:** Assets (STORE_ASSETS_GUIDE.md)
5. **Valide:** Checklist (DEPLOYMENT_READINESS_CHECKLIST.md)
6. **Submeta:** Siga o guia passo a passo

### Para Melhorar o Código:

1. **Leia:** [MELHORIAS_IDENTIFICADAS.md](./MELHORIAS_IDENTIFICADAS.md)
2. **Priorize:** Itens críticos primeiro
3. **Execute:** Scripts de migração
4. **Valide:** Testes e lint

---

## 📞 Ajuda

- **Dúvidas sobre publicação:** Consulte [GUIA_PRODUCAO_BRUTAL_2025.md](./GUIA_PRODUCAO_BRUTAL_2025.md)
- **Dúvidas sobre código:** Consulte [MELHORIAS_IDENTIFICADAS.md](./MELHORIAS_IDENTIFICADAS.md)
- **Problemas técnicos:** Execute scripts de validação

---

**Última atualização:** 08/12/2025
