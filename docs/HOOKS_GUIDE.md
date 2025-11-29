# 🎨 Guia de Git Hooks - Nossa Maternidade

Este documento explica como os git hooks funcionam no projeto e como configurá-los.

## 📋 Visão Geral

O projeto usa **Husky** para gerenciar git hooks que garantem a qualidade do código antes de cada commit.

### Hooks Configurados

| Hook | Arquivo | Função |
|------|---------|--------|
| `pre-commit` | `.husky/pre-commit` | Valida design tokens, TypeScript e lint |
| `commit-msg` | `.husky/commit-msg` | Valida formato de mensagem de commit |

## 🚀 Setup Inicial

```bash
# Instalar dependências (inclui husky)
npm install

# Configurar hooks (automático via "prepare")
npm run prepare

# Ou manualmente
npm run setup:hooks
```

## 🔧 Pre-Commit Hook

O hook `pre-commit` executa as seguintes validações:

### 1. Design Tokens ✅
```bash
npm run validate:design
```
- Detecta cores hardcoded (#xxx, rgba, etc.)
- Verifica uso do sistema legado (`@/design-system`)
- Sugere tokens equivalentes do design system

### 2. TypeScript ✅
```bash
npm run type-check
```
- Verifica erros de tipo
- Garante strict mode
- Bloqueia `any` implícito

### 3. Lint-Staged ✅
```bash
npx lint-staged
```
- Executa ESLint apenas nos arquivos modificados
- Auto-fix quando possível
- Valida design tokens em componentes/telas

## 📝 Commit-Msg Hook

O hook `commit-msg` valida o formato da mensagem de commit seguindo **Conventional Commits**.

### Formato
```
type(scope): description
```

### Tipos Permitidos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (não muda código) |
| `refactor` | Refatoração |
| `perf` | Melhoria de performance |
| `test` | Testes |
| `build` | Build system |
| `ci` | CI/CD |
| `chore` | Tarefas diversas |
| `revert` | Reverter commit |

### Exemplos Válidos
```bash
feat(home): adicionar card de emoções
fix(chat): corrigir scroll infinito
refactor(design): migrar para tokens
docs: atualizar README
test(services): adicionar testes de emotionService
```

### Exemplos Inválidos
```bash
# ❌ Sem tipo
adicionar nova feature

# ❌ Tipo inválido
feature(home): adicionar card

# ❌ Sem descrição
feat(home):

# ❌ Muito longo (>100 caracteres)
feat(home): essa é uma descrição muito longa que excede o limite de cem caracteres permitidos
```

## 🔄 GitHub Actions

O projeto também possui workflows de CI que executam validações em PRs e pushes:

### Workflow: CI Pipeline (`.github/workflows/ci.yml`)

| Job | Descrição |
|-----|-----------|
| `lint` | ESLint completo |
| `typescript` | Type check |
| `design-tokens` | Validação de design |
| `test` | Testes unitários |
| `accessibility` | Verificações de acessibilidade |

### Workflow: Design Validation (`.github/workflows/design-validation.yml`)

Focado especificamente em design system:
- Validação de design tokens
- Validação de platform design (iOS/Android)
- Pre-deploy validation
- Comentário automático em PRs

## 🛠️ Troubleshooting

### Hook não executa no Windows
```powershell
# Verificar se Git Bash está instalado
git --version

# Reinstalar husky
npm run prepare
```

### Erro "Permission denied"
```bash
# Linux/Mac: tornar executável
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Bypass temporário (não recomendado)
```bash
# Pular hooks (APENAS em emergências)
git commit --no-verify -m "emergency fix"
```

### Reset completo dos hooks
```bash
rm -rf .husky
npm run prepare
npm run setup:hooks
```

## 📊 Lint-Staged Config

O arquivo `lint-staged.config.js` define quais validações rodam em cada tipo de arquivo:

```javascript
module.exports = {
  // TypeScript/JavaScript
  '*.{ts,tsx}': ['eslint --fix --max-warnings=0'],
  
  // Componentes - Design validation
  'src/components/**/*.{ts,tsx}': ['node scripts/validate-design-tokens.js'],
  
  // Telas - Design validation
  'src/screens/**/*.{ts,tsx}': ['node scripts/validate-design-tokens.js'],
  
  // JSON - Prettier
  '*.json': ['prettier --write'],
};
```

## 🎯 Boas Práticas

1. **Sempre use tokens do design system**
   ```typescript
   // ❌ Evite
   backgroundColor: '#FFFFFF'
   
   // ✅ Correto
   backgroundColor: colors.background.card
   ```

2. **Use mensagens de commit descritivas**
   ```bash
   # ❌ Evite
   git commit -m "fix bug"
   
   # ✅ Correto
   git commit -m "fix(chat): corrigir crash ao enviar mensagem vazia"
   ```

3. **Faça commits pequenos e frequentes**
   - Cada commit deve ter uma única responsabilidade
   - Facilita revisão e rollback

4. **Execute validações localmente antes do commit**
   ```bash
   npm run validate:design
   npm run type-check
   npm run lint
   ```

## 📚 Referências

- [Husky](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Design System Documentation](./DESIGN_SYSTEM.md)

