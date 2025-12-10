# 🔧 Gemini CLI Extension - Integração no Cursor/VS Code

Este guia explica como instalar e usar a extensão oficial **Gemini CLI Companion** (`google.gemini-cli-vscode-ide-companion`) no Cursor/VS Code para o projeto **Nossa Maternidade**.

## 📋 O que é a Gemini CLI Extension?

A **Gemini CLI Companion** é uma extensão oficial do Google que integra o **Gemini CLI** (agente de IA em terminal) diretamente no IDE. Ela permite:

- ✅ Usar Gemini CLI diretamente no terminal do Cursor/VS Code
- ✅ Contexto automático do workspace (10 arquivos recentes, cursor, seleção)
- ✅ Diffs nativos no editor para revisar mudanças sugeridas
- ✅ Comandos via Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)

## 🔄 Diferença: Gemini CLI Extension vs MCP

| Aspecto          | Gemini CLI Extension                  | MCP (Model Context Protocol)            |
| ---------------- | ------------------------------------- | --------------------------------------- |
| **Uso**          | Terminal interativo (CLI)             | Integração programática (API)           |
| **Contexto**     | Workspace do IDE (arquivos, cursor)   | Projeto completo (services, agents)     |
| **Interface**    | Terminal + Command Palette            | Servidores MCP configurados             |
| **Quando usar**  | Desenvolvimento interativo, debugging | Integração no código (agents, services) |
| **Configuração** | Extensão do marketplace               | Arquivo `mcp.json`                      |

**Resumo:**

- **Gemini CLI Extension** = Ferramenta de desenvolvimento (você usa no terminal)
- **MCP** = Integração no código (o app usa via services)

Ambas podem coexistir e se complementam! 🎯

## 🚀 Instalação

### Método 1: Automático (Recomendado)

1. Instale o **Gemini CLI** globalmente:

   ```bash
   npm install -g @google/gemini-cli
   ```

2. **Windows PowerShell:** Use o script helper do projeto:

   ```powershell
   .\scripts\gemini-cli.ps1
   ```

   **Mac/Linux:** Use o script helper:

   ```bash
   chmod +x scripts/gemini-cli.sh
   ./scripts/gemini-cli.sh
   ```

   **Ou execute diretamente:**

   ```bash
   npx -y @google/gemini-cli
   ```

3. O CLI detectará o IDE e perguntará se deseja conectar. Confirme:

   ```
   Gemini CLI detected VS Code. Would you like to connect? (yes/no)
   ```

4. A extensão será instalada automaticamente e a conexão será habilitada.

### Método 2: Manual via Marketplace

1. Abra o Cursor/VS Code
2. Pressione `Cmd+Shift+X` (Mac) ou `Ctrl+Shift+X` (Windows/Linux) para abrir Extensions
3. Procure por: `Gemini CLI Companion`
4. Instale a extensão `google.gemini-cli-vscode-ide-companion`
5. Após instalação, ative a integração no terminal:
   ```bash
   gemini
   /ide enable
   ```

### Método 3: Manual via CLI

Se você já tem o Gemini CLI instalado:

```bash
gemini
/ide install
```

Isso instalará a extensão apropriada para seu IDE.

## ⚙️ Configuração

### 1. Configurar API Key

A extensão usa a mesma API key do Gemini CLI. Configure via:

**Opção A: Variável de ambiente (Windows PowerShell)**

```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**Opção B: Variável de ambiente (Mac/Linux)**

```bash
export GEMINI_API_KEY=GEMINI_API_KEY=AIzaSyA5IQtfm8TMqHGAzMAyAY3MbNA3ERUu5rs
```

**Opção C: Usar script helper do projeto (recomendado)**

O projeto inclui um script helper que carrega automaticamente a API key do `.env`:

**Windows PowerShell:**

```powershell
.\scripts\gemini-cli.ps1
```

**Mac/Linux:**

```bash
./scripts/gemini-cli.sh
```

O script automaticamente:

- ✅ Carrega `GEMINI_API_KEY` ou `EXPO_PUBLIC_GEMINI_API_KEY` do `.env`
- ✅ Configura a variável de ambiente
- ✅ Inicia o Gemini CLI

**Opção D: Configurar via arquivo de configuração do Gemini CLI**

O Gemini CLI armazena configurações em:

- **Windows:** `%APPDATA%\gemini-cli\config.json`
- **Mac/Linux:** `~/.config/gemini-cli/config.json`

Você pode editar manualmente ou usar o CLI (quando funcionar):

```bash
npx -y @google/gemini-cli /config set api_key your_api_key_here
```

### 2. Verificar Conexão

**Windows PowerShell:**

```powershell
.\scripts\gemini-cli.ps1 /ide status
```

**Mac/Linux:**

```bash
./scripts/gemini-cli.sh /ide status
```

**Ou diretamente:**

```bash
npx -y @google/gemini-cli /ide status
```

Isso mostra:

- IDE conectado (Cursor/VS Code)
- Lista de arquivos recentemente acessados
- Status da conexão

## 🎯 Uso Básico

### Comandos do Gemini CLI

No terminal, digite `gemini` para iniciar:

```bash
gemini
```

**Comandos principais:**

| Comando             | Descrição                  |
| ------------------- | -------------------------- |
| `/ide enable`       | Habilita conexão com IDE   |
| `/ide disable`      | Desabilita conexão com IDE |
| `/ide status`       | Verifica status da conexão |
| `/ide install`      | Instala extensão do IDE    |
| `/help`             | Lista todos os comandos    |
| `/exit` ou `Ctrl+C` | Sair do CLI                |

**Exemplo de uso:**

**Windows PowerShell:**

```powershell
.\scripts\gemini-cli.ps1
# Gemini CLI iniciado

Você: Refatore o componente Button.tsx para usar design tokens

# Gemini analisa o arquivo, sugere mudanças
# Um diff abre automaticamente no editor
```

**Mac/Linux:**

```bash
./scripts/gemini-cli.sh
# Gemini CLI iniciado

Você: Refatore o componente Button.tsx para usar design tokens

# Gemini analisa o arquivo, sugere mudanças
# Um diff abre automaticamente no editor
```

### Comandos do Command Palette

No Cursor/VS Code, pressione `Cmd+Shift+P` (Mac) ou `Ctrl+Shift+P` (Windows/Linux):

| Comando                                | Descrição                            |
| -------------------------------------- | ------------------------------------ |
| `Gemini CLI: Run`                      | Inicia o Gemini CLI no terminal      |
| `Gemini CLI: Accept Diff`              | Aceita as mudanças sugeridas no diff |
| `Gemini CLI: Close Diff Editor`        | Fecha o editor de diff               |
| `Gemini CLI: View Third-Party Notices` | Visualiza avisos de terceiros        |

## 🔄 Trabalhando com Diffs

Quando o Gemini CLI sugere mudanças de código:

### Aceitar um Diff

**Método 1: Interface do Editor**

1. Clique no ícone ✓ (checkmark) na barra de título do diff
2. Salve o arquivo (`Cmd+S` / `Ctrl+S`)

**Método 2: Command Palette**

1. `Cmd+Shift+P` → `Gemini CLI: Accept Diff`
2. No terminal, responda `yes` quando perguntado

**Método 3: Terminal**

1. No terminal do Gemini CLI, responda `yes` quando perguntado

### Rejeitar um Diff

**Método 1: Interface do Editor**

1. Clique no ícone ✗ (X) na barra de título do diff
2. Ou feche a aba do diff

**Método 2: Command Palette**

1. `Cmd+Shift+P` → `Gemini CLI: Close Diff Editor`
2. No terminal, responda `no` quando perguntado

**Método 3: Terminal**

1. No terminal do Gemini CLI, responda `no` quando perguntado

### Modificar um Diff

Você pode editar diretamente o diff antes de aceitar:

1. O diff mostra lado a lado (original vs sugerido)
2. Edite o lado direito (sugestão) conforme necessário
3. Aceite quando estiver satisfeito

## 🎨 Integração com Nossa Maternidade

### Contexto Automático

A extensão fornece automaticamente ao Gemini CLI:

- ✅ **10 arquivos mais recentes** acessados no IDE
- ✅ **Posição do cursor** no arquivo atual
- ✅ **Texto selecionado** (até 16KB)
- ✅ **Workspace path** (caminho do projeto)

### Exemplos de Uso no Projeto

**1. Refatorar componente para usar design tokens:**

```bash
gemini
Você: Refatore src/components/atoms/Button.tsx para usar apenas design tokens de src/theme/tokens.ts. Remova cores hardcoded.
```

**2. Corrigir erro TypeScript:**

```bash
gemini
Você: Corrige o erro TypeScript em src/screens/HomeScreen.tsx linha 45. O erro é: Property 'emotion' does not exist on type 'UserProfile'.
```

**3. Criar teste para service:**

```bash
gemini
Você: Cria um teste unitário para src/services/supabase/emotionService.ts seguindo o padrão do projeto (Jest + React Native Testing Library).
```

**4. Adicionar acessibilidade:**

```bash
gemini
Você: Adiciona labels de acessibilidade (accessibilityLabel, accessibilityRole) ao componente src/components/organisms/MaternalCard.tsx seguindo WCAG AAA.
```

## 🔧 Troubleshooting

### Problema: Extensão não conecta

**Solução:**

1. Verifique se a extensão está instalada: `Cmd+Shift+X` → procure "Gemini CLI Companion"
2. Reinicie o Cursor/VS Code
3. No terminal: `gemini` → `/ide enable`
4. Verifique status: `/ide status`

### Problema: API Key não encontrada

**Solução:**

1. Configure a variável de ambiente:
   ```bash
   export GEMINI_API_KEY=your_key_here
   ```
2. Ou configure via CLI:
   ```bash
   gemini
   /config set api_key your_key_here
   ```
3. Verifique: `/config get api_key`

### Problema: Diff não abre

**Solução:**

1. Verifique se a conexão IDE está ativa: `/ide status`
2. Tente habilitar novamente: `/ide disable` → `/ide enable`
3. Reinicie o Cursor/VS Code
4. Verifique se há erros no Output Panel: `View` → `Output` → selecione "Gemini CLI"

### Problema: Contexto do workspace não funciona

**Solução:**

1. Certifique-se de que o workspace está aberto (não apenas um arquivo)
2. Verifique se há arquivos abertos recentemente
3. Tente selecionar texto no editor antes de fazer a pergunta
4. Verifique status: `/ide status` (deve listar arquivos recentes)

## 📚 Recursos Adicionais

- [Documentação Oficial Gemini CLI](https://google-gemini.github.io/gemini-cli/)
- [GitHub: google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [VS Code Marketplace: Gemini CLI Companion](https://marketplace.visualstudio.com/items?itemName=google.gemini-cli-vscode-ide-companion)

## ✅ Checklist de Configuração

- [ ] Gemini CLI instalado globalmente (`npm install -g @google/gemini-cli`)
- [ ] Extensão "Gemini CLI Companion" instalada no Cursor/VS Code
- [ ] API Key configurada (`GEMINI_API_KEY` ou via `/config set`)
- [ ] Conexão IDE habilitada (`/ide enable`)
- [ ] Status verificado (`/ide status`)
- [ ] Teste básico realizado (pergunta simples no CLI)

## 🎯 Próximos Passos

Após configurar:

1. **Explore comandos:** Use `/help` no Gemini CLI para ver todos os comandos
2. **Teste com arquivos do projeto:** Peça para refatorar componentes usando design tokens
3. **Use para debugging:** Peça ajuda para corrigir erros TypeScript
4. **Integre no workflow:** Use o CLI para tarefas rápidas, MCP para integração no código

---

**Última atualização:** 2025-01-XX  
**Versão:** 1.0.0  
**Projeto:** Nossa Maternidade
