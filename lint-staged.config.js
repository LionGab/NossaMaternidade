/**
 * Configuração do lint-staged
 * Executa validações apenas nos arquivos staged
 * 
 * @see https://github.com/okonet/lint-staged
 */
module.exports = {
  // ===========================================
  // TypeScript e JavaScript - Lint e Format
  // ===========================================
  '*.{ts,tsx}': [
    // ESLint com auto-fix
    'eslint --fix --max-warnings=0',
  ],

  '*.{js,jsx}': [
    'eslint --fix',
  ],

  // ===========================================
  // Componentes React Native - Design Validation
  // ===========================================
  'src/components/**/*.{ts,tsx}': [
    // Validar design tokens
    'node scripts/validate-design-tokens.js',
  ],

  // ===========================================
  // Telas - Design Validation
  // ===========================================
  'src/screens/**/*.{ts,tsx}': [
    // Validar design tokens
    'node scripts/validate-design-tokens.js',
  ],

  // ===========================================
  // Theme - Apenas TypeScript check
  // ===========================================
  'src/theme/**/*.{ts,tsx}': [
    'eslint --fix',
  ],

  // ===========================================
  // Services e Hooks - TypeScript
  // ===========================================
  'src/{services,hooks,utils,agents,ai}/**/*.{ts,tsx}': [
    'eslint --fix --max-warnings=0',
  ],

  // ===========================================
  // JSON - Prettier
  // ===========================================
  '*.json': [
    'prettier --write',
  ],

  // ===========================================
  // Markdown - Prettier (opcional)
  // ===========================================
  '*.md': [
    'prettier --write --prose-wrap preserve',
  ],
};
