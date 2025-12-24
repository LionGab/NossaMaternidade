# TestFlight - Guia Completo para Nossa Maternidade

## O Que É TestFlight?

TestFlight é a plataforma oficial da Apple para testes beta de apps antes de publicar na App Store. Permite compartilhar builds com testadores internos e externos.

**Referência:** [Apple Developer - TestFlight](https://developer.apple.com/testflight/)

---

## Requisitos

✅ **Conta Apple Developer ativa** (você está aguardando aprovação)
✅ **App criado no App Store Connect**
✅ **Build feito via EAS**

---

## Fluxo Completo

```
1. Conta Apple Developer Aprovada
   ↓
2. Criar App no App Store Connect
   ↓
3. Fazer Build: eas build --profile production --platform ios
   ↓
4. Build aparece no App Store Connect → TestFlight
   ↓
5. Adicionar Testadores
   ↓
6. Testadores instalam via App TestFlight
   ↓
7. Coletar Feedback
   ↓
8. Corrigir bugs e fazer novo build
   ↓
9. Quando pronto → Submeter para App Store
```

---

## Passo a Passo Detalhado

### 1. Após Conta Ser Aprovada

#### 1.1 Criar App no App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Clique em **My Apps** → **+** → **New App**
3. Preencha:
   - **Platform:** iOS
   - **Name:** Nossa Maternidade
   - **Primary Language:** Português (Brasil)
   - **Bundle ID:** `com.nossamaternidade.app`
   - **SKU:** `NOSSA_MATERNIDADE_2025`
4. Clique em **Create**

#### 1.2 Fazer Primeiro Build

```bash
# No terminal do MacBook
cd ~/Documents/Lion/NossaMaternidade

# Build de produção
eas build --profile production --platform ios
```

**Tempo:** 15-30 minutos

**O que acontece:**

- EAS cria certificados automaticamente
- Build é feito na nuvem
- Você recebe notificação quando concluir

---

### 2. Configurar TestFlight

#### 2.1 Acessar TestFlight

1. No App Store Connect, selecione **Nossa Maternidade**
2. Clique na aba **TestFlight** (menu superior)
3. Você verá seu build quando estiver pronto

#### 2.2 Adicionar Informações do Beta

1. Na seção **Test Information**, clique em **+**
2. Preencha:
   - **What to Test:** Descreva o que você quer que testem
   - **Description:** Detalhes sobre o app e funcionalidades
   - **Feedback Email:** Seu email para receber feedback
   - **Marketing URL:** (opcional) https://nossamaternidade.com.br
   - **Privacy Policy URL:** https://nossamaternidade.com.br/privacidade

**Exemplo de "What to Test":**

```
Teste todas as funcionalidades principais:
- Onboarding e criação de perfil
- Chat com NathIA (IA)
- Comunidade (posts, likes, comentários)
- Rastreamento de ciclo menstrual
- Hábitos de bem-estar
- Check-ins diários

Reporte qualquer bug ou sugestão de melhoria.
```

---

### 3. Adicionar Testadores

#### 3.1 Testadores Internos (Até 100 pessoas)

**Quem pode ser:**

- Membros do seu time de desenvolvimento
- Pessoas com roles: Account Holder, Admin, App Manager, Developer, Marketing

**Como adicionar:**

1. No TestFlight, vá em **Internal Testing**
2. Clique em **+** ao lado de "Internal Testers"
3. Adicione emails dos testadores
4. Eles receberão convite por email

**Vantagens:**

- ✅ Acesso imediato (sem review da Apple)
- ✅ Até 100 testadores
- ✅ Distribuição automática de novos builds (opcional)

#### 3.2 Testadores Externos (Até 10.000 pessoas)

**Requisitos:**

- Primeiro build precisa ser aprovado pela Apple Review
- Review leva 24-48 horas

**Como adicionar:**

**Opção A: Por Email**

1. Crie um grupo em **External Testing**
2. Adicione builds ao grupo
3. Adicione emails dos testadores
4. Eles receberão convite

**Opção B: Link Público (Recomendado)**

1. Crie grupo externo
2. Ative **Public Link**
3. Compartilhe o link:
   - Email marketing
   - Redes sociais
   - Site do app
4. Pessoas podem se inscrever sem você precisar do email delas

**Configurar Critérios (Opcional):**

- Tipo de dispositivo (iPhone, iPad)
- Versão do iOS (ex: iOS 15+)
- Localização (ex: Brasil)

---

### 4. Testadores Instalam o App

#### 4.1 Instalar App TestFlight

1. Testadores baixam **TestFlight** da App Store (grátis)
2. Abrem o email de convite (ou link público)
3. Clicam em **View in TestFlight**
4. Instalam o app beta

#### 4.2 Usar o App Beta

- App aparece no TestFlight app
- Testadores podem instalar até 30 builds diferentes
- Podem alternar entre builds facilmente

---

### 5. Coletar Feedback

#### 5.1 Feedback dos Testadores

Testadores podem:

1. **Tirar Screenshot** → Adicionar anotações → Enviar feedback
2. **Reportar Crash** → Apple envia crash report automaticamente
3. **Enviar Feedback Escrito** → Via TestFlight app

#### 5.2 Ver Feedback no App Store Connect

1. Vá em **TestFlight** → **Feedback**
2. Veja todos os feedbacks organizados por:
   - Build
   - Plataforma
   - Versão do iOS
   - Data

#### 5.3 Métricas de Testadores

Veja estatísticas:

- Quantos testadores instalaram
- Quantos estão ativos
- Taxa de aceitação de convites
- Engajamento por grupo

---

### 6. Fazer Novos Builds

Após corrigir bugs baseado no feedback:

```bash
# Fazer novo build
eas build --profile production --platform ios

# Build aparecerá automaticamente no TestFlight
# Adicione ao grupo de testadores
```

**Limite:** Até 100 builds podem estar ativos simultaneamente

---

### 7. Submeter para App Store

Quando estiver satisfeito com os testes:

1. No App Store Connect, vá em **App Store** (não TestFlight)
2. Clique em **+ Version**
3. Selecione o build que quer publicar
4. Preencha informações:
   - Descrição
   - Screenshots
   - Categoria
   - Privacy Policy
5. Clique em **Submit for Review**

**Ou via EAS:**

```bash
eas submit --profile production --platform ios
```

---

## Estrutura Recomendada de Grupos

### Grupo 1: Internal - Desenvolvimento

- **Membros:** Time de desenvolvimento
- **Builds:** Todos os builds
- **Propósito:** Testes rápidos antes de release

### Grupo 2: External - Beta Fechado

- **Membros:** 50-100 testadores selecionados
- **Builds:** Builds estáveis
- **Propósito:** Testes mais amplos

### Grupo 3: External - Beta Público

- **Membros:** Link público (até 10.000)
- **Builds:** Builds aprovados pela review
- **Propósito:** Testes em larga escala

---

## Checklist TestFlight

### Preparação

- [ ] Conta Apple Developer aprovada
- [ ] App criado no App Store Connect
- [ ] Build feito via EAS
- [ ] Build processado no App Store Connect

### Configuração

- [ ] Informações do beta preenchidas
- [ ] Grupo de testadores internos criado
- [ ] Testadores internos adicionados
- [ ] (Opcional) Grupo externo criado

### Primeira Distribuição

- [ ] Build adicionado ao grupo interno
- [ ] Testadores receberam convites
- [ ] Testadores instalaram TestFlight app
- [ ] App beta instalado nos dispositivos

### Coleta de Feedback

- [ ] Feedback sendo recebido
- [ ] Métricas sendo monitoradas
- [ ] Bugs sendo corrigidos
- [ ] Novos builds sendo feitos

### Submissão

- [ ] App testado e aprovado pelos testadores
- [ ] Build final selecionado
- [ ] Informações da App Store preenchidas
- [ ] Submetido para review

---

## Dicas Importantes

### 1. Distribuição Automática

Ative **Automatic Distribution** para testadores internos:

- Novos builds são enviados automaticamente
- Testadores sempre têm a versão mais recente
- Economiza tempo

### 2. Limite de Builds

- **100 builds ativos** simultaneamente
- Builds antigos são arquivados automaticamente
- Mantenha apenas builds relevantes

### 3. Review de Builds Externos

- Primeiro build externo precisa de review (24-48h)
- Builds subsequentes são mais rápidos
- Use builds internos para testes rápidos

### 4. Feedback Estruturado

Peça feedback específico:

- "Teste o fluxo de criação de post"
- "Verifique se o chat com NathIA funciona"
- "Reporte qualquer crash"

### 5. Testar em Diferentes Dispositivos

Peça testadores com:

- iPhone diferentes (SE, Pro, Pro Max)
- Versões diferentes do iOS
- Diferentes configurações

---

## Comandos Úteis

### Verificar Status do Build

```bash
# Listar builds
eas build:list --platform ios

# Ver último build
eas build:list --platform ios --limit 1
```

### Abrir TestFlight no Navegador

```bash
# Abrir App Store Connect → TestFlight
open https://appstoreconnect.apple.com
```

---

## Troubleshooting

### Build Não Aparece no TestFlight

**Causa:** Build ainda processando

**Solução:**

- Aguarde 5-10 minutos
- Verifique email de notificação
- Recarregue página do App Store Connect

### Testadores Não Recebem Convite

**Causa:** Email incorreto ou spam

**Solução:**

- Verifique email está correto
- Peça para verificar spam
- Reenvie convite manualmente

### Build Rejeitado pela Review

**Causa:** Violação de guidelines

**Solução:**

- Leia motivo da rejeição
- Corrija problemas
- Faça novo build
- Resubmeta

---

## Referências

- [TestFlight - Apple Developer](https://developer.apple.com/testflight/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/ios/)

---

## Próximos Passos

1. **Aguardar aprovação** da conta Apple Developer
2. **Criar app** no App Store Connect
3. **Fazer primeiro build:** `eas build --profile production --platform ios`
4. **Configurar TestFlight** seguindo este guia
5. **Adicionar testadores** e começar testes

Boa sorte com os testes! 🚀
