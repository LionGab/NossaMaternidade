# 📱 Guia Visual de Teste - Botões do Onboarding

## 🎯 Objetivo
Validar que todos os botões do onboarding funcionam corretamente em dispositivos móveis.

---

## 🚀 Setup Inicial

### 1. Iniciar o servidor:
```bash
cd /workspace
npx expo start
```

### 2. No celular (iOS/Android):
1. Instalar **Expo Go** na loja de apps
2. Abrir Expo Go
3. Escanear o QR code que aparece no terminal
4. Aguardar app carregar

---

## 🧪 Testes por Etapa do Onboarding

### ✅ **Step 1: Nome**
**O que testar:**
- [ ] Digite seu nome no campo
- [ ] Botão "Próximo" fica habilitado (azul)
- [ ] Clique no botão "Próximo"
- [ ] App avança para próxima tela

**Problemas comuns:**
- ❌ Botão não responde ao toque
- ❌ Botão fica desabilitado mesmo com nome preenchido
- ❌ Teclado cobre o botão

**Se falhar:** Verificar logs no Metro: `[OnboardingScreen] Button pressed`

---

### ✅ **Step 2: Fase da Maternidade**
**O que testar:**
- [ ] Aparecem 5 opções (cards)
- [ ] Clique em uma opção (ex: "Estou grávida")
- [ ] Card fica azul (selecionado)
- [ ] Clique no botão "Próximo"
- [ ] App avança para próxima tela
- [ ] Clique no botão "Voltar"
- [ ] App volta para tela anterior

**Testes extras:**
- [ ] Tente clicar na borda do card (teste hitSlop)
- [ ] Tente clicar entre o emoji e o texto

**Problemas comuns:**
- ❌ Cards não respondem ao toque
- ❌ Botão "Voltar" não funciona
- ❌ Seleção não fica visível

---

### ✅ **Step 3: Objetivos (Multi-seleção)**
**O que testar:**
- [ ] Aparecem 6 opções
- [ ] Clique em 1 opção → fica azul
- [ ] Clique em mais 2 opções → ficam azuis
- [ ] Contador mostra "3/3 selecionados"
- [ ] Clique em 4ª opção → não permite (máximo 3)
- [ ] Clique em uma já selecionada → desmarca
- [ ] Botão "Próximo" funciona

**Problemas comuns:**
- ❌ Multi-seleção não funciona
- ❌ Não limita a 3 seleções
- ❌ Desmarcação não funciona

---

### ✅ **Step 4: Estado Emocional**
**O que testar:**
- [ ] Aparecem 5 opções de emoção
- [ ] Clique em uma (ex: "Ansiosa")
- [ ] Opção fica selecionada
- [ ] Botão "Próximo" funciona

---

### ✅ **Step 5: Foco Principal**
**O que testar:**
- [ ] Aparecem 5 opções de foco
- [ ] Clique em uma
- [ ] Botão "Próximo" funciona

---

### ✅ **Step 6: Tom de Conversa**
**O que testar:**
- [ ] Aparecem 3 opções de tom
- [ ] Clique em uma (ex: "Bem acolhedora, tipo amiga")
- [ ] Botão "Próximo" funciona

---

### ✅ **Step 7: Notificações (Final)**
**O que testar:**
- [ ] Aparecem 2 opções (Sim / Não)
- [ ] Clique em uma
- [ ] Botão muda para "Começar!" (em vez de "Próximo")
- [ ] Clique em "Começar!"
- [ ] Loading aparece ("Salvando...")
- [ ] App navega para tela principal (Home)

**Problemas comuns:**
- ❌ Botão "Começar!" não responde
- ❌ Loading infinito
- ❌ Erro ao salvar dados
- ❌ Não navega para Home

---

## 🔍 Testes de Borda (Críticos)

### Teste de hitSlop (Área de Toque Expandida):
1. **Teste nas bordas:**
   - Clique 5px FORA da borda visual do botão
   - Deve funcionar (graças ao hitSlop)

2. **Teste com dedo molhado/seco:**
   - Simular toque impreciso
   - Botão deve responder facilmente

3. **Teste com toque rápido:**
   - Toque e solte rapidamente
   - Não deve cancelar (graças ao pressRetentionOffset)

---

## 📊 Checklist Completo

### Funcionalidade Básica:
- [ ] Todos os botões respondem ao toque
- [ ] Botão "Voltar" funciona em todos os steps (2-7)
- [ ] Botão "Próximo" funciona em todos os steps (1-6)
- [ ] Botão "Começar!" funciona no step 7
- [ ] Todas as opções (cards) são clicáveis

### Feedback Visual:
- [ ] Botões mostram opacidade ao pressionar (0.7)
- [ ] Cards mudam de cor ao selecionar (azul)
- [ ] Loading aparece ao finalizar
- [ ] Animações de transição funcionam

### Feedback Háptico (Vibração):
- [ ] Toque nos botões vibra suavemente
- [ ] Seleção de opções vibra
- [ ] Finalização vibra (padrão de sucesso)

### Acessibilidade:
- [ ] Botões têm tamanho mínimo 44pt
- [ ] Labels descritivos para screen readers
- [ ] Alto contraste entre texto e fundo
- [ ] Feedback visual claro de seleção

### Teclado (Step 1):
- [ ] Botão "Próximo" fica visível com teclado aberto
- [ ] Pode clicar no botão com teclado aberto
- [ ] Teclado não cobre botões

---

## 🐛 Debug: O que verificar se falhar

### 1. Logs no Metro:
Procurar por:
```
[HapticButton] handlePress called
[OnboardingScreen] Button pressed
```

Se NÃO aparecer: Problema de detecção de toque

### 2. Estado do botão:
Adicionar log temporário no código:
```tsx
console.log('DEBUG:', {
  canProceed: canProceed(),
  disabled: !canProceed() || loading,
  loading,
  currentStep,
});
```

### 3. Verificar visualmente:
- Botão está visível? (não cortado)
- Botão está por baixo de outro elemento?
- Botão está com `opacity: 0`?

### 4. Testar botão direto:
Adicionar um botão de teste:
```tsx
<TouchableOpacity
  onPress={() => console.log('TESTE DIRETO OK')}
  style={{ backgroundColor: 'red', padding: 20, margin: 20 }}
>
  <Text>TESTE</Text>
</TouchableOpacity>
```

Se funcionar: Problema no componente customizado
Se não funcionar: Problema de setup/ambiente

---

## 📸 Screenshots Esperados

### Step 1: Nome
```
┌─────────────────────────┐
│  Progresso: ━━━━━━━━━   │
│                         │
│  💙                     │
│  Como você quer que eu  │
│  te chame aqui dentro?  │
│                         │
│  ┌─────────────────────┐│
│  │ Digite seu nome...  ││ ← Campo de texto
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │     Próximo    →    ││ ← Botão principal
│  └─────────────────────┘│
│                         │
│       1 de 7            │
└─────────────────────────┘
```

### Step 2: Fase
```
┌─────────────────────────┐
│  ← Progresso: ━━━━━━━━  │
│                         │
│  Em qual dessas fases   │
│  você se sente hoje?    │
│                         │
│  ┌─────────────────────┐│
│  │ 🤰 Estou grávida    ││ ← Clicável
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 👶 Já tenho filho(s)││
│  └─────────────────────┘│
│                         │
│  ┌──────┐  ┌───────────┐│
│  │Voltar│  │ Próximo → ││ ← Ambos clicáveis
│  └──────┘  └───────────┘│
└─────────────────────────┘
```

---

## ✅ Critérios de Sucesso

### Teste passa se:
1. ✅ Consegue completar onboarding do início ao fim
2. ✅ Todos os botões respondem na primeira tentativa
3. ✅ Botões funcionam nas bordas (hitSlop)
4. ✅ Botão "Voltar" retorna à tela anterior
5. ✅ Feedback háptico funciona
6. ✅ App navega para Home após finalizar

### Teste falha se:
1. ❌ Qualquer botão não responde ao toque
2. ❌ Precisa clicar múltiplas vezes
3. ❌ Botões não funcionam nas bordas
4. ❌ Teclado cobre botões
5. ❌ Loading infinito
6. ❌ Não navega para Home

---

## 🎓 Observações Finais

### Dispositivos recomendados para teste:
- ✅ iPhone 12 ou superior (iOS 15+)
- ✅ Samsung Galaxy S21 ou superior (Android 11+)
- ✅ Dispositivo com tela pequena (iPhone SE)
- ✅ Dispositivo com tela grande (iPad)

### Condições de teste:
- 📶 Wi-Fi estável
- 🔋 Bateria > 20%
- 🌡️ Temperatura normal (não superaquecido)
- 📱 Expo Go atualizado

### Tempo estimado de teste:
- **Teste básico:** ~3 minutos (percorrer todos os steps)
- **Teste completo:** ~10 minutos (incluindo testes de borda)
- **Teste de regressão:** ~5 minutos (apenas happy path)

---

## 📞 Suporte

Se encontrar problemas:

1. **Limpar cache:**
   ```bash
   npx expo start --clear
   ```

2. **Reinstalar dependências:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Verificar versões:**
   ```bash
   npx expo-doctor
   ```

4. **Consultar logs:**
   - Metro: Terminal onde rodou `npx expo start`
   - Dispositivo: Shake device → Show Dev Menu → Debug

---

**Última atualização:** 09/12/2025  
**Versão do fix:** 1.0  
**Status:** ✅ Pronto para teste
