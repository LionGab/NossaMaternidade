# 📄 Guia: Publicação de Documentos Legais

Este guia explica como publicar os documentos legais obrigatórios para deploy nas lojas.

---

## 📋 Documentos Necessários

### 1. Privacy Policy (Política de Privacidade)
- **URL obrigatória:** https://nossamaternidade.com.br/privacy
- **Arquivo:** `docs/PRIVACY_POLICY.md`
- **Status:** ✅ Template completo disponível

### 2. Terms of Service (Termos de Uso)
- **URL obrigatória:** https://nossamaternidade.com.br/terms
- **Arquivo:** `docs/TERMS_OF_SERVICE.md`
- **Status:** ✅ Template completo disponível

### 3. Disclaimer Médico
- **Onde:** Dentro do app (já implementado nas telas)
- **Status:** ✅ Já implementado

---

## 🚀 Como Publicar

### Opção 1: Website Próprio (Recomendado)

1. **Criar páginas no website:**
   - `/privacy` - Privacy Policy
   - `/terms` - Terms of Service

2. **Converter Markdown para HTML:**
   ```bash
   # Usar ferramenta como markdown-to-html
   npm install -g markdown-to-html
   markdown-to-html docs/PRIVACY_POLICY.md -o public/privacy.html
   markdown-to-html docs/TERMS_OF_SERVICE.md -o public/terms.html
   ```

3. **Atualizar URLs no app:**
   - `app.config.js` - Adicionar deep links
   - `src/screens/PrivacyPolicyScreen.tsx` - Link para URL pública
   - `src/screens/TermsOfServiceScreen.tsx` - Link para URL pública

### Opção 2: GitHub Pages (Gratuito)

1. **Criar branch `gh-pages`:**
   ```bash
   git checkout -b gh-pages
   ```

2. **Criar arquivos HTML:**
   - `docs/privacy.html`
   - `docs/terms.html`

3. **Habilitar GitHub Pages:**
   - Settings → Pages → Source: `gh-pages` / `docs`

4. **URLs resultantes:**
   - https://[username].github.io/[repo]/privacy.html
   - https://[username].github.io/[repo]/terms.html

### Opção 3: Serviço de Hospedagem Estática

**Opções gratuitas:**
- **Vercel:** Deploy automático do diretório `docs`
- **Netlify:** Deploy automático
- **Cloudflare Pages:** Deploy automático

**Passos (Vercel exemplo):**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd docs
vercel --prod
```

---

## ✅ Checklist de Publicação

### Antes de Publicar:
- [ ] Revisar todos os placeholders `[DATA]`, `[NOME]`, `[CNPJ]`, etc.
- [ ] Preencher informações da empresa
- [ ] Adicionar data de última atualização
- [ ] Verificar links internos
- [ ] Testar em diferentes navegadores

### Após Publicar:
- [ ] Verificar URLs acessíveis publicamente
- [ ] Testar links no app
- [ ] Adicionar URLs no `app.config.js`
- [ ] Atualizar telas do app com links para URLs públicas
- [ ] Documentar URLs no README

---

## 📝 Informações a Preencher

### Placeholders Comuns:

**Privacy Policy:**
- `[DATA]` → Data de publicação (ex: 15/12/2024)
- `[NOME DO DPO]` → Nome do Encarregado de Dados
- `[ENDEREÇO COMPLETO DA EMPRESA]` → Endereço completo
- `[RAZÃO SOCIAL DA EMPRESA]` → Razão social
- `[CNPJ]` → CNPJ da empresa
- `[TELEFONE]` → Telefone de contato
- `[CIDADE]` → Cidade do foro

**Terms of Service:**
- `[DATA]` → Data de publicação
- `[NOME DA EMPRESA]` → Nome da empresa
- `[CNPJ]` → CNPJ
- `[ENDEREÇO COMPLETO]` → Endereço completo
- `[TELEFONE]` → Telefone
- `[CIDADE]` → Cidade do foro
- `[ESTADO]` → Estado

---

## 🔗 URLs no App

Após publicar, atualize as referências no app:

### 1. `app.config.js`
```javascript
extra: {
  privacyPolicyUrl: 'https://nossamaternidade.com.br/privacy',
  termsOfServiceUrl: 'https://nossamaternidade.com.br/terms',
}
```

### 2. Telas do App
Adicionar botão "Ver versão web" que abre a URL pública.

---

## 📚 Referências

- **Apple App Store:** Requer Privacy Policy URL
- **Google Play:** Requer Privacy Policy URL e Terms of Service URL
- **LGPD:** Exige transparência sobre coleta de dados
- **GDPR:** Exige Privacy Policy acessível

---

## ⚠️ Importante

- **Nunca** publique documentos com placeholders não preenchidos
- **Sempre** mantenha versões atualizadas
- **Documente** mudanças no histórico de versões
- **Notifique** usuários sobre mudanças significativas

---

**Última atualização:** Dezembro 2024

