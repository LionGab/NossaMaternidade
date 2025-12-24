# 🧪 Guia de Teste - RevenueCat no Expo Go

**Data**: 2025-12-24
**Objetivo**: Validar implementação RevenueCat em modo desenvolvimento (Expo Go)
**Tempo estimado**: 15 minutos

---

## 📋 PRÉ-REQUISITOS

- ✅ Expo Go instalado no celular
- ✅ Projeto rodando: `npm start`
- ✅ Celular e PC na mesma rede Wi-Fi

---

## 🎯 O QUE VAMOS TESTAR

### ✅ O Que FUNCIONA no Expo Go

1. **Detecção de ambiente**
   - App detecta que está no Expo Go
   - RevenueCat é desabilitado automaticamente
   - Logs informativos aparecem

2. **Fallback gracioso**
   - App não quebra/crash
   - Usuário permanece como "free"
   - UI premium está acessível

3. **Toggle de debug (DEV)**
   - Simular status premium ON/OFF
   - Testar gates de acesso (voz, telas premium)
   - Validar persistência do estado

4. **Premium Store**
   - Estado global funciona
   - Persistência AsyncStorage funciona
   - Hooks retornam valores corretos

### ❌ O Que NÃO funciona no Expo Go

1. ❌ Compras reais (IAP)
2. ❌ Conexão com RevenueCat API
3. ❌ Verificação de recibos
4. ❌ Restaurar compras

> **Por quê?** Expo Go não suporta módulos nativos customizados (react-native-purchases)

---

## 🚀 PASSO A PASSO

### 1. Iniciar o App

```bash
# Terminal
npm start

# Ou com cache limpo
npm start:clear
```

**Console esperado:**
```
[RevenueCat] Expo Go detectado: RevenueCat desabilitado (use Dev Client para IAP).
[App] RevenueCat isConfigured: false
[App] RevenueCat indisponível (provável Expo Go). App rodando como free.
```

✅ **SUCESSO**: Nenhum erro/crash, app abre normalmente

---

### 2. Abrir o App no Celular

- Abra Expo Go
- Escaneie o QR code
- Aguarde o app carregar

**Comportamento esperado:**
- App carrega sem erros
- Login funciona (se autenticado)
- Tela inicial aparece

---

### 3. Validar Estado Inicial (FREE)

#### 3.1 Verificar Console

No terminal, procure por:
```
[PremiumStore] No customer info found
[PremiumStore] Premium status checked { isPremium: false, tier: 'free', period: null }
```

#### 3.2 Verificar no App

- Abra qualquer tela com PremiumGate (ex: voz da NathIA)
- Deve aparecer **Paywall** bloqueando acesso

✅ **SUCESSO**: Paywall aparece, usuário está como FREE

---

### 4. Testar Toggle Premium (DEV ONLY)

#### 4.1 Abrir Paywall

- No app, acesse qualquer feature premium
- Ou navegue para `/paywall`

#### 4.2 Usar Botão de Debug

No **FINAL** da tela Paywall, você verá:

```
┌─────────────────────────────────┐
│  Ativar Premium (DEV)           │
└─────────────────────────────────┘
```

> **IMPORTANTE**: Esse botão só aparece em modo `__DEV__`

#### 4.3 Ativar Premium

1. Toque no botão
2. Toast aparece: "Premium ativado (simulação)"
3. Paywall fecha automaticamente

#### 4.4 Validar Acesso Premium

- Acesse feature de voz (NathIA)
- Deve funcionar SEM mostrar paywall
- Acesse telas premium
- Tudo deve estar liberado

**Console esperado:**
```
[PremiumStore] Debug toggle premium { isPremium: true }
```

✅ **SUCESSO**: Premium ativado, gates liberados

---

### 5. Testar Persistência

#### 5.1 Fechar e Reabrir App

- Force-close o app (Expo Go)
- Abra novamente escaneando QR code

#### 5.2 Validar Estado Mantido

- Status premium deve persistir
- Acesso às features premium continua
- Não precisa ativar novamente

**Por quê funciona?**
Zustand + AsyncStorage salva o estado

✅ **SUCESSO**: Estado persiste entre sessões

---

### 6. Testar Desativar Premium

#### 6.1 Voltar ao Paywall

- Navegue para qualquer tela premium
- OU abra `/paywall` manualmente

#### 6.2 Desativar

1. Toque no botão (agora diz "Desativar Premium (DEV)")
2. Toast: "Premium desativado (simulação)"
3. Usuário volta para FREE

#### 6.3 Validar Bloqueio

- Tente acessar voz da NathIA
- Paywall deve aparecer novamente
- Features premium bloqueadas

✅ **SUCESSO**: Voltou para FREE, gates ativados

---

## 📊 CHECKLIST DE VALIDAÇÃO

### Startup
- [ ] App inicia sem crash
- [ ] Log: "Expo Go detectado"
- [ ] Log: "RevenueCat isConfigured: false"
- [ ] Sem erros no console

### Estado FREE
- [ ] PremiumGate bloqueia features
- [ ] Paywall aparece
- [ ] Botão "Ativar Premium (DEV)" visível

### Toggle Premium ON
- [ ] Botão funciona
- [ ] Toast de confirmação
- [ ] Gates liberados
- [ ] Log: "isPremium: true"

### Persistência
- [ ] Estado salvo após fechar app
- [ ] Reabre com premium ativo
- [ ] AsyncStorage funcionando

### Toggle Premium OFF
- [ ] Botão "Desativar" funciona
- [ ] Toast de confirmação
- [ ] Gates bloqueados novamente
- [ ] Log: "isPremium: false"

---

## 🐛 TROUBLESHOOTING

### Problema: Botão de debug não aparece

**Causa**: App não está em modo DEV
**Solução**:
```bash
npm start -- --dev-client
```

### Problema: Estado não persiste

**Causa**: AsyncStorage não configurado
**Solução**:
```bash
# Reinstalar app no Expo Go
# Limpar cache
npm start:clear
```

### Problema: Erro ao ativar premium

**Causa**: Zustand store não inicializado
**Verificação**:
```typescript
// Abra React DevTools
// Verifique se usePremiumStore existe
```

### Problema: Crash ao abrir paywall

**Causa**: Erro de importação
**Logs**: Verificar stack trace completo
**Solução**: Executar `npm run typecheck`

---

## 🔍 LOGS IMPORTANTES

### Sucesso (Expo Go)
```
✅ [RevenueCat] Expo Go detectado: RevenueCat desabilitado
✅ [App] RevenueCat isConfigured: false
✅ [PremiumStore] No customer info found
✅ [PremiumStore] Premium status checked { isPremium: false }
```

### Erro (inesperado)
```
❌ Failed to initialize RevenueCat
❌ RevenueCat not configured. Call initializePurchases()
❌ Error: Module not found: react-native-purchases
```

Se ver **ERROS** acima → Algo está quebrado, reporte!

---

## 📈 PRÓXIMOS PASSOS

Após validar no Expo Go:

### Opção A: Continuar testando em FREE
- Desenvolver features
- Testar gates com toggle manual
- Validar UX do paywall

### Opção B: Testar IAP REAL
- Criar Dev Client: `npx expo run:ios`
- Configurar RevenueCat Dashboard
- Testar compras em Sandbox

### Opção C: Produção
- Build de produção: `npm run eas:build:ios`
- Configurar produtos nas Stores
- Testar com TestFlight/Internal Testing

---

## ✅ CONCLUSÃO

Se todos os checkboxes estão marcados:

**✅ IMPLEMENTAÇÃO VALIDADA**

O código RevenueCat está:
- Funcionando corretamente
- Com fallback robusto
- Pronto para IAP real (com configuração)

Próximo sprint: Configurar RevenueCat Dashboard + Stores.

---

**Criado por**: Claude Code
**Versão**: 1.0.0
**Última atualização**: 2025-12-24
