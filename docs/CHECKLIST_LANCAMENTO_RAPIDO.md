# ✅ Checklist de Lançamento Rápido (5-7 dias)

> Checklist prático para lançar o app nas stores

---

## Dia 1-2: Contas e Configurações

### Apple Developer
- [ ] Criar conta Apple Developer ($99/ano)
- [ ] Gerar App Store Connect API Key
- [ ] Criar App ID no Apple Developer Portal
- [ ] Configurar certificados de distribuição
- [ ] Preencher `appleTeamId` no `eas.json`

### Google Play
- [ ] Criar conta Google Play Console ($25 única)
- [ ] Criar Service Account JSON
- [ ] Configurar Google Play API
- [ ] Criar app no console
- [ ] Preencher formulário Data Safety

### Supabase
- [ ] Verificar projeto de produção
- [ ] Confirmar RLS em todas as tabelas
- [ ] Testar auth flow completo
- [ ] Verificar Edge Functions

---

## Dia 2-3: Assets Obrigatórios

### Ícone do App
- [ ] iOS: 1024x1024px (PNG, sem transparência)
- [ ] Android: 512x512px (PNG, pode ter transparência)
- [ ] Favicon: 192x192px

### Splash Screen
- [ ] 1284x2778px (iPhone 14 Pro Max)
- [ ] Versão dark mode (opcional)

### Screenshots (mínimo)
| Plataforma | Tamanho | Quantidade |
|------------|---------|------------|
| iPhone 6.7" | 1290x2796 | 4-6 |
| iPhone 6.5" | 1284x2778 | 4-6 |
| iPad 12.9" | 2048x2732 | 4-6 |
| Android | 1080x1920 | 4-6 |

### Textos
- [ ] Nome do app (max 30 caracteres)
- [ ] Subtítulo (max 30 caracteres)
- [ ] Descrição curta (max 80 caracteres)
- [ ] Descrição completa (max 4000 caracteres)
- [ ] Keywords (max 100 caracteres)
- [ ] URL de suporte
- [ ] URL de privacidade

---

## Dia 3-4: Build e Teste

### Corrigir Issues
```bash
# Verificar TypeScript
npm run type-check

# Verificar Lint
npm run lint

# Rodar testes
npm run test

# Todos devem passar!
```

### Build Preview
```bash
# Build para teste interno
eas build --profile preview --platform all

# Testar no dispositivo físico
# iOS: TestFlight ou Ad-Hoc
# Android: APK direto
```

### Testar Features Críticas
- [ ] Login/Cadastro
- [ ] Chat com NathIA
- [ ] Detecção de crise (testar com frases específicas)
- [ ] Comunidade (posts, likes)
- [ ] Hábitos (criar, completar)
- [ ] Notificações push
- [ ] Deep links

---

## Dia 4-5: Beta Fechado

### Recrutar Testers
- [ ] 50-100 mães do público-alvo
- [ ] Criar grupo WhatsApp/Telegram para feedback
- [ ] Preparar formulário de feedback

### Distribuir
```bash
# iOS - TestFlight
eas submit --platform ios --profile preview

# Android - Internal Testing
eas submit --platform android --profile preview
```

### Monitorar
- [ ] Crashes (Sentry/Crashlytics)
- [ ] Feedback dos testers
- [ ] Performance
- [ ] Uso de IA (custos)

---

## Dia 5-6: Ajustes Finais

### Corrigir Bugs do Beta
- [ ] Priorizar bugs críticos
- [ ] Ignorar melhorias para v2

### Assets Finais
- [ ] Screenshots com dados reais
- [ ] Vídeo preview (opcional, muito recomendado)

### Build de Produção
```bash
# Build final
eas build --profile production --platform all
```

---

## Dia 6-7: Submissão

### iOS App Store
```bash
eas submit --platform ios --profile production
```

- [ ] Preencher App Store Connect
- [ ] Categoria: Health & Fitness ou Lifestyle
- [ ] Age Rating: 12+ (conteúdo de saúde mental)
- [ ] App Review Information (conta de teste)
- [ ] Submeter para review

### Google Play Store
```bash
eas submit --platform android --profile production
```

- [ ] Preencher Google Play Console
- [ ] Categoria: Health & Fitness
- [ ] Content Rating: Everyone ou Teen
- [ ] Data Safety form
- [ ] Submeter para review

---

## Pós-Submissão

### Tempo de Review
| Store | Tempo Médio |
|-------|-------------|
| iOS | 24-48h |
| Android | 2-7 dias |

### Se Rejeitado
1. Ler motivo da rejeição com atenção
2. Corrigir exatamente o que foi pedido
3. Resubmeter com nota explicando a correção

### Após Aprovação
- [ ] Testar download da store
- [ ] Verificar analytics
- [ ] Preparar comunicado de lançamento
- [ ] **NÃO ANUNCIAR ATÉ TESTAR DOWNLOAD REAL**

---

## Comandos Resumidos

```bash
# Verificar tudo
npm run type-check && npm run lint && npm run test

# Build preview (teste)
eas build --profile preview --platform all

# Build produção
eas build --profile production --platform all

# Submeter iOS
eas submit --platform ios

# Submeter Android
eas submit --platform android
```

---

## Checklist Final (Copiar e Colar)

```
[ ] Conta Apple Developer ativa
[ ] Conta Google Play ativa
[ ] Supabase produção configurado
[ ] Ícone 1024x1024
[ ] Splash screen
[ ] 4+ screenshots por tamanho
[ ] Textos da store
[ ] TypeScript 0 erros
[ ] Lint 0 warnings
[ ] Testes passando
[ ] Build preview testado
[ ] Beta com 50+ testers
[ ] Build produção gerado
[ ] iOS submetido
[ ] Android submetido
[ ] Download real testado
```

---

*Última atualização: 08/12/2025*
