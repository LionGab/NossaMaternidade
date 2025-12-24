# ⚡ Teste Rápido - RevenueCat no Expo Go

**5 minutos** para validar a implementação

---

## 🚀 INICIAR

```bash
# Terminal 1: Iniciar Expo
npm start
```

Escaneie o QR code no Expo Go

---

## ✅ VALIDAR (2 minutos)

### 1. Console do Terminal
Procure por:
```
✓ [RevenueCat] Expo Go detectado
✓ [App] RevenueCat isConfigured: false
✓ [PremiumStore] No customer info found
```

### 2. No App
- Tente acessar voz da NathIA
- Paywall deve aparecer

---

## 🧪 TESTAR PREMIUM (3 minutos)

### Ativar Premium
1. No Paywall, role até o final
2. Toque: **"Ativar Premium (DEV)"**
3. Toast: "Premium ativado (simulação)"

### Validar
- Acesse voz da NathIA
- Deve funcionar SEM paywall

### Desativar
1. Volte ao Paywall
2. Toque: **"Desativar Premium (DEV)"**
3. Toast: "Premium desativado (simulação)"

### Validar
- Tente acessar voz novamente
- Paywall deve reaparecer

---

## 📊 CHECKLIST

- [ ] App inicia sem crash
- [ ] Logs corretos no console
- [ ] Paywall aparece (modo FREE)
- [ ] Botão DEV visível
- [ ] Toggle premium funciona
- [ ] Gates liberados quando premium
- [ ] Estado persiste ao reabrir app

---

## 🎯 SUCESSO?

Se todos os checkboxes ✓ → **IMPLEMENTAÇÃO OK**

---

## 📚 MAIS DETALHES

- **Guia completo**: `docs/TESTE_EXPO_GO.md`
- **Validação automática**: `bash scripts/test-revenuecat-expo-go.sh`

---

**Próximo passo**: Configurar RevenueCat Dashboard para IAP real
