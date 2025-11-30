# ⚡ Quick Start: Claude no Cursor - Nossa Maternidade

**Tempo estimado:** 10 minutos  
**Data:** 29/11/2025

---

## 🎯 Setup Rápido (5 minutos)

### 1. Verificar Configuração (30s)

```bash
npm run verify:cursor
```

Se tudo estiver ✅, pule para "Primeiros Passos". Se houver avisos, continue.

### 2. Configurar API Key no Cursor (2 min)

1. Abra Cursor
2. `Ctrl+,` (Settings)
3. Vá em **"AI Models"** ou **"Features"**
4. Procure **"Claude API Key"** ou **"Anthropic API Key"**
5. Cole sua chave (formato: `sk-ant-...`)
   - Obter em: [console.anthropic.com](https://console.anthropic.com) > API Keys

### 3. Selecionar Modelo (30s)

1. Nas mesmas configurações
2. Selecione **Claude Sonnet 4.5** como padrão
3. Ative **Codebase Indexing** (se disponível)

### 4. Verificar Novamente (30s)

```bash
npm run verify:cursor
```

Deve mostrar tudo ✅ agora.

---

## 🚀 Primeiros Passos (5 minutos)

### Teste 1: Chat Básico (1 min)

1. `Ctrl+L` (ou `Cmd+L` no Mac) - Abre Chat
2. Digite:
   ```
   @src/theme/tokens.ts
   Explique como usar os design tokens neste projeto
   ```
3. Observe a resposta detalhada

### Teste 2: Inline Edit (1 min)

1. Abra qualquer arquivo `.tsx`
2. Selecione uma linha de código
3. `Ctrl+K` (ou `Cmd+K` no Mac)
4. Digite: `Refatore para usar design tokens`
5. Veja a sugestão inline

### Teste 3: Composer (Multi-arquivo) (3 min)

1. `Ctrl+Shift+I` (ou `Cmd+Shift+I` no Mac) - Abre Composer
2. Digite:
   ```
   @src/screens/HomeScreen.tsx
   @src/theme/tokens.ts
   
   Identifique todas as cores hardcoded nesta tela e sugira como substituir por design tokens.
   Não implemente ainda, apenas liste as substituições necessárias.
   ```
3. Veja a análise completa

---

## 📋 Checklist de Verificação

Marque conforme completa:

- [ ] API Key configurada no Cursor
- [ ] Claude Sonnet 4.5 selecionado
- [ ] Codebase Indexing ativo
- [ ] `npm run verify:cursor` retorna ✅
- [ ] Teste de chat funcionou
- [ ] Teste de inline edit funcionou
- [ ] Teste de composer funcionou

**Se tudo marcado ✅, você está pronto!**

---

## 🎯 Próximos Passos

### Hoje (15 min)

1. **Ler seção Antipadrões** em `docs/CURSOR_CLAUDE_SETUP.md` (seção 7)
   - Evita erros caros
   - Economiza 30-50% de tokens

2. **Explorar Templates** em `docs/CURSOR_PROMPT_TEMPLATES.md`
   - Templates prontos para uso
   - Copiar e colar, ajustar e usar

### Esta Semana (30 min/dia)

1. **Dia 1**: Experimentar diferentes tipos de prompts
2. **Dia 2**: Criar sua primeira Rule personalizada
3. **Dia 3**: Mapear quando usar Haiku vs Sonnet
4. **Dia 4**: Otimizar prompts mais comuns
5. **Dia 5**: Revisar e ajustar workflow

---

## ⚡ Atalhos Essenciais

| Ação | Windows/Linux | Mac |
|------|---------------|-----|
| Abrir Chat | `Ctrl + L` | `Cmd + L` |
| Composer (Agent) | `Ctrl + Shift + I` | `Cmd + Shift + I` |
| Inline Edit | `Ctrl + K` | `Cmd + K` |
| Settings | `Ctrl + ,` | `Cmd + ,` |
| Aceitar Sugestão | `Tab` | `Tab` |

---

## 🆘 Problemas Comuns

### "API Key inválida"

1. Verifique se copiou a chave completa (`sk-ant-...`)
2. Verifique se não há espaços extras
3. Gere nova chave em [console.anthropic.com](https://console.anthropic.com)

### "Limite excedido"

1. Verifique uso em [claude.ai/settings](https://claude.ai/settings)
2. Limites resetam a cada 5 horas
3. Inicie nova conversa para economizar tokens

### "Respostas genéricas"

1. Use `@arquivo.ts` específico no prompt
2. Inclua contexto relacionado
3. Consulte `docs/CURSOR_PROMPT_TEMPLATES.md`

---

## 📚 Documentação Completa

- **Guia Completo**: `docs/CURSOR_CLAUDE_SETUP.md` (1228 linhas)
- **Templates de Prompts**: `docs/CURSOR_PROMPT_TEMPLATES.md`
- **Regras do Projeto**: `.cursor/rules`

---

## 💡 Pro Tip

**Workflow de 10 segundos:**

```
Você sabe EXATAMENTE o que fazer?
├─ SIM → Ctrl+K (Inline Edit) → Sonnet 4.5
└─ NÃO → Precisa entender código?
   ├─ SIM → Ctrl+L (Chat) → Haiku (rápido/barato)
   └─ NÃO → Tarefa tem >3 arquivos?
      ├─ SIM → Ctrl+Shift+I (Composer) → Sonnet 4.5
      └─ NÃO → Ctrl+K (Inline) → Sonnet 4.5
```

---

## ✅ Pronto!

Agora você pode começar a desenvolver com Claude no Cursor de forma eficiente.

**Dúvidas?** Consulte `docs/CURSOR_CLAUDE_SETUP.md` (guia completo).

**Templates prontos?** Veja `docs/CURSOR_PROMPT_TEMPLATES.md`.

---

**Última atualização:** 29/11/2025

