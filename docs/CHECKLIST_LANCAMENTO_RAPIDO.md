# ✅ CHECKLIST RÁPIDO DE LANÇAMENTO

> Para Nathália Valente - Nossa Maternidade / NathIA  
> Dezembro 2025

---

## 📋 ANTES DE TUDO (Dia 0)

### Contas de Desenvolvedor
```
□ Apple Developer Program ($99/ano)
  URL: https://developer.apple.com/programs/enroll/
  
□ Google Play Console ($25 único)
  URL: https://play.google.com/console
```

### Identificadores Únicos
```
□ Bundle ID iOS: com.nossamaternidade.app ✅ (já configurado)
□ Package Android: com.nossamaternidade.app ✅ (já configurado)
□ Apple Team ID: _________ (preencher)
□ App Store Connect ID: _________ (preencher)
```

---

## 🎨 ASSETS (Dia 1-2)

### Ícone do App
```
□ icon.png (1024x1024) - PNG, sem transparência para iOS
□ adaptive-icon.png (1024x1024) - PNG, para Android
□ notification-icon.png (96x96) - branco sobre transparente
```

### Splash Screen
```
□ splash.png (2048x2048) - PNG
□ Cor de fundo: #EC4899 (rosa) ✅ (já configurado)
```

### Screenshots App Store (iPhone 15 Pro Max)
```
□ 1. Tela de boas-vindas/onboarding
□ 2. Chat com NathIA
□ 3. Comunidade
□ 4. Dashboard/Home
□ 5. Perfil ou funcionalidade destaque
```

### Screenshots Google Play
```
□ Mesmas 5+ acima em 1080x1920 ou similar
□ Feature Graphic (1024x500) - banner promocional
```

---

## ⚙️ CONFIGURAÇÃO (Dia 2-3)

### eas.json - Atualizar
```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "SEU_ID_AQUI",      // ← PREENCHER
        "appleTeamId": "SEU_TEAM_AQUI"   // ← PREENCHER
      }
    }
  }
}
```

### Google Play Service Account
```
1. Ir em Google Cloud Console
2. Criar Service Account com papel "Service Account User"
3. Baixar JSON da chave
4. Salvar como: ./google-play-service-account.json
5. Adicionar ao .gitignore!
```

### Variáveis de Ambiente (Produção)
```
□ EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
□ EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
□ EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://xxx.supabase.co/functions/v1
□ EXPO_PUBLIC_ENABLE_AI_FEATURES=true
□ EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🔨 BUILD (Dia 3-4)

### Comandos
```bash
# 1. Verificar tudo OK
npm run type-check && npm run lint

# 2. Build iOS
eas build --platform ios --profile production

# 3. Build Android
eas build --platform android --profile production

# 4. Aguardar builds (20-40 min cada)
eas build:list
```

---

## 📤 SUBMISSÃO (Dia 4-5)

### iOS
```bash
# Opção A: Automático via EAS
eas submit --platform ios --profile production

# Opção B: Manual
# 1. Baixar .ipa do dashboard EAS
# 2. Usar app "Transporter" no Mac
# 3. Upload para App Store Connect
```

### Android
```bash
# Opção A: Automático via EAS
eas submit --platform android --profile production

# Opção B: Manual
# 1. Baixar .aab do dashboard EAS
# 2. Upload no Google Play Console > Production
```

---

## 📝 LISTAGEM NAS LOJAS

### App Store Connect
```
Informações do App:
□ Nome: Nossa Maternidade
□ Subtítulo: Sua companheira de maternidade
□ Categoria: Health & Fitness
□ Classificação: 12+
□ Descrição (4000 chars)
□ Palavras-chave (100 chars)
□ URL de Suporte
□ URL Política de Privacidade
□ Privacy Nutrition Labels preenchidas
```

### Google Play Console
```
Listagem da Loja:
□ Nome: Nossa Maternidade
□ Descrição curta (80 chars)
□ Descrição completa (4000 chars)
□ Categoria: Health & Fitness > Parenting
□ Content Rating: preencher questionário
□ Data Safety: preencher formulário
□ URL Política de Privacidade
```

---

## 🛡️ COMPLIANCE (Obrigatório)

### Política de Privacidade
```
Precisa cobrir:
□ Dados coletados (email, nome, fotos, mensagens)
□ Processamento por IA (com opt-out possível)
□ Armazenamento (Supabase)
□ Direitos LGPD (acesso, correção, exclusão)
□ Contato para DPO/responsável
```

### Data Safety (Google Play)
```
Formulário obrigatório:
□ Coleta de email? SIM (autenticação)
□ Coleta de nome? SIM (perfil)
□ Coleta de fotos? SIM (avatar)
□ Compartilha com terceiros? NÃO
□ Dados criptografados? SIM
□ Usuário pode deletar dados? SIM
```

---

## 🚀 LANÇAMENTO (Dia 6-7)

### Pré-lançamento
```
□ Teste com grupo fechado (50-100 pessoas)
□ Monitore crashes no Sentry/EAS
□ Prepare comunicado de lançamento
□ Configure analytics (se não feito)
```

### Dia do Lançamento
```
□ Liberar para público nas lojas
□ Post de anúncio da Nathália
□ Monitorar reviews e ratings
□ Equipe de suporte pronta
```

---

## 🆘 SE ALGO DER ERRADO

### Build falhou
```bash
# Ver logs detalhados
eas build:view [BUILD_ID]

# Erros comuns:
# - Certificados iOS expirados → renovar no Apple Developer
# - Keystore Android perdido → EAS gerencia automaticamente
# - Dependência quebrada → npm ci (limpa node_modules)
```

### App rejeitado
```
iOS comum:
- Falta de login alternativo → Adicionar "Pular" ou Apple Sign-In
- Descrição não clara → Melhorar texto
- Bugs óbvios → Corrigir e resubmeter

Android comum:
- Data Safety incompleto → Preencher corretamente
- Permissões excessivas → Justificar no formulário
- Metadata faltando → Completar listagem
```

### Crash em produção
```bash
# Ver crashes
# Sentry (se configurado) ou EAS Insights

# Hotfix rápido
eas update --branch production --message "Fix crash XYZ"
```

---

## 📞 CONTATOS ÚTEIS

```
Apple Developer Support: https://developer.apple.com/contact/
Google Play Support: https://support.google.com/googleplay/android-developer/
Expo Discord: https://chat.expo.dev/
Supabase Discord: https://discord.supabase.com/
```

---

**Tempo estimado total: 5-7 dias** (se não houver bloqueios)

**Boa sorte, Valente! 💪🩷**
