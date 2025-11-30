# 🎯 Próximos Passos: Configuração Manual do Claude no Cursor

**Status:** ✅ Verificação automatizada passou (5/5 checks)  
**Próximo:** Configuração manual da API Key e testes

---

## ✅ O Que Já Está Pronto

Todos os arquivos e configurações automatizadas estão OK:

| Item | Status |
|------|--------|
| `.cursor/settings.json` | ✅ Configurado |
| `.cursor/rules` | ✅ Encontrado |
| `package.json` scripts | ✅ 3/3 scripts |
| Documentação completa | ✅ Presente |
| `.cursorignore` | ✅ Configurado |
| Estrutura do projeto | ✅ OK |

---

## 🚀 Passo 1: Obter API Key do Claude (5 min)

### Opção A: Se você já tem conta Anthropic

1. **Acesse:** [console.anthropic.com](https://console.anthropic.com)
2. **Faça login** na sua conta
3. **Vá em:** "API Keys" (menu lateral)
4. **Clique:** "Create Key"
5. **Dê um nome:** Ex: "Cursor - Nossa Maternidade"
6. **Copie a chave** (formato: `sk-ant-...`)
   - ⚠️ **IMPORTANTE:** Guarde em local seguro, não será exibida novamente!

### Opção B: Se você não tem conta ainda

1. **Crie conta:** [console.anthropic.com](https://console.anthropic.com)
2. **Complete o cadastro**
3. **Siga Opção A** acima

### Opção C: Se já tem chave mas não sabe onde está

1. **Acesse:** [console.anthropic.com](https://console.anthropic.com) > API Keys
2. **Visualize chaves existentes** (você verá apenas os últimos 4 caracteres)
3. **Se necessário:** Crie uma nova chave

---

## 🔧 Passo 2: Configurar API Key no Cursor (3 min)

### Windows/Linux

1. **Abra o Cursor**
2. **Pressione:** `Ctrl + ,` (abre Settings)
3. **Procure por:** 
   - "AI Models" OU
   - "Features" OU
   - "Claude" OU
   - "Anthropic"
4. **Encontre o campo:** "Claude API Key" ou "Anthropic API Key"
5. **Cole sua chave:** `sk-ant-...`
6. **Salve** (pode ser automático ou botão "Save")

### Mac

1. **Abra o Cursor**
2. **Pressione:** `Cmd + ,` (abre Settings)
3. **Siga passos 3-6 acima**

### Se não encontrar o campo

**Alternativa 1: Via Command Palette**
1. `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite: "Claude" ou "API Key"
3. Selecione a opção apropriada

**Alternativa 2: Verificar versão do Cursor**
1. `Help` > `About Cursor`
2. Se versão antiga, atualize: `Help` > `Check for Updates`

---

## ⚙️ Passo 3: Verificar Plano Max do Claude (2 min)

### Verificar se está ativo

1. **Acesse:** [claude.ai/settings](https://claude.ai/settings)
2. **Vá em:** "Billing" ou "Cobrança"
3. **Verifique:** Deve mostrar "Claude Max" ou "Plano Max"

### Se não está ativo

1. **Ainda em:** [claude.ai/settings](https://claude.ai/settings)
2. **Vá em:** "Upgrade" ou "Atualizar para Max"
3. **Escolha nível:**
   - **5x (US$ 100/mês)**: ~225 mensagens a cada 5h → Uso frequente
   - **20x (US$ 200/mês)**: ~900 mensagens a cada 5h → Uso intenso diário
4. **Complete o pagamento**

### Se já tem plano mas não é Max

- O Cursor funcionará, mas com limites menores
- Recomenda-se upgrade para uso intenso
- Consulte guia completo para otimizações sem Max

---

## 🎯 Passo 4: Configurar Modelo Padrão (2 min)

1. **No Cursor Settings** (`Ctrl+,` ou `Cmd+,`)
2. **Na seção de AI Models:**
3. **Selecione modelo padrão:**
   - ✅ **Recomendado:** Claude Sonnet 4.5 (melhor custo/benefício)
   - ✅ **Alternativa:** Claude Opus 4 (mais preciso, mais caro)
   - ❌ **Evitar para padrão:** Claude Haiku (use apenas para exploração rápida)

4. **Ative (se disponível):**
   - ✅ Codebase Indexing
   - ✅ Autocomplete

5. **Salve configurações**

---

## 🧪 Passo 5: Testar Configuração (5 min)

### Teste 1: Chat Básico (2 min)

1. **Pressione:** `Ctrl+L` (Windows/Linux) ou `Cmd+L` (Mac)
2. **Digite:**
   ```
   @src/theme/tokens.ts
   Explique como usar os design tokens neste projeto em uma frase curta
   ```
3. **Aguarde resposta:**
   - ✅ Se funcionou: Verá explicação detalhada
   - ❌ Se erro: Veja troubleshooting abaixo

### Teste 2: Inline Edit (1 min)

1. **Abra qualquer arquivo `.tsx`** (ex: `src/App.tsx`)
2. **Selecione uma linha de código**
3. **Pressione:** `Ctrl+K` (Windows/Linux) ou `Cmd+K` (Mac)
4. **Digite:** `Explique esta linha`
5. **Veja sugestão inline**

### Teste 3: Composer (2 min)

1. **Pressione:** `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Shift+I` (Mac)
2. **Digite:**
   ```
   @src/theme/tokens.ts
   Liste os principais design tokens disponíveis neste projeto
   ```
3. **Veja análise completa**

---

## ✅ Verificação Final

Execute novamente a verificação:

```bash
npm run verify:cursor
```

**Todos devem passar** + você deve conseguir usar o chat (`Ctrl+L`).

---

## 🆘 Troubleshooting

### ❌ "API Key inválida"

**Possíveis causas:**
- Chave copiada incompleta
- Espaços extras antes/depois
- Chave expirada ou revogada

**Solução:**
1. Gere nova chave em [console.anthropic.com](https://console.anthropic.com)
2. Copie COMPLETA (deve começar com `sk-ant-`)
3. Cole novamente no Cursor (sem espaços)
4. Teste novamente

---

### ❌ "Limite de uso excedido"

**Possíveis causas:**
- Limite do plano atingido
- Não tem Plano Max

**Solução:**
1. Verifique uso em [claude.ai/settings](https://claude.ai/settings)
2. Limites resetam a cada 5 horas
3. Aguarde ou upgrade para Plano Max
4. Use nova conversa para economizar tokens

---

### ❌ "Modelo não disponível"

**Possíveis causas:**
- Versão do Cursor desatualizada
- Plano Max não ativo
- Problema temporário

**Solução:**
1. Atualize Cursor: `Help` > `Check for Updates`
2. Verifique se Plano Max está ativo
3. Tente `Claude Opus 4` como alternativa
4. Reinicie o Cursor

---

### ❌ Chat não abre (`Ctrl+L` não funciona)

**Possíveis causas:**
- Atalho conflitante
- Cursor não reconhece API Key
- Problema de instalação

**Solução:**
1. Verifique se API Key está configurada (Settings > AI Models)
2. Tente atalho alternativo: Command Palette (`Ctrl+Shift+P`) > "Chat"
3. Reinicie o Cursor
4. Verifique se há atualizações disponíveis

---

### ❌ "Respostas genéricas ou irrelevantes"

**Isso não é erro de configuração**, mas de prompt:

**Solução:**
1. Use `@arquivo.ts` específico no prompt
2. Inclua contexto relacionado
3. Consulte: `docs/CURSOR_PROMPT_TEMPLATES.md`
4. Leia: Seção "Melhores Práticas" do guia completo

---

## 📚 Próximos Passos Após Configuração

### Hoje (30 min)

1. **Explorar Templates** (10 min)
   - Abrir: `docs/CURSOR_PROMPT_TEMPLATES.md`
   - Escolher 2-3 templates mais úteis
   - Testar um template real

2. **Ler Antipadrões** (10 min)
   - Abrir: `docs/CURSOR_CLAUDE_SETUP.md`
   - Ir para: Seção 7 "Antipadrões Comuns"
   - Evita erros caros!

3. **Primeira Task Real** (10 min)
   - Escolher task pequena do projeto
   - Usar Claude para implementar
   - Aprender na prática

### Esta Semana

- **Dia 1-2:** Experimentar diferentes tipos de prompts
- **Dia 3-4:** Criar primeira Rule personalizada
- **Dia 5:** Revisar e ajustar workflow

---

## 🎉 Parabéns!

Se você chegou até aqui e todos os testes passaram, você está pronto para usar Claude no Cursor com máxima eficiência!

### Recursos Disponíveis

- **Quick Start:** `docs/CURSOR_QUICK_START.md`
- **Guia Completo:** `docs/CURSOR_CLAUDE_SETUP.md`
- **Templates:** `docs/CURSOR_PROMPT_TEMPLATES.md`
- **Checklist:** `docs/CURSOR_IMPLEMENTATION_CHECKLIST.md`

---

**Última atualização:** 29/11/2025  
**Status:** ✅ Pronto para configuração manual

