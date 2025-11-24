#!/usr/bin/env node

/**
 * Script de Preparação de Assets Android
 * Prepara e valida assets necessários para Google Play Store
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Verificar se diretório existe
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    success(`Diretório criado: ${dirPath}`);
  }
}

// Criar estrutura de diretórios para screenshots
function createScreenshotStructure() {
  info('Criando estrutura de diretórios para screenshots...');
  
  const screenshotsDir = path.resolve('assets', 'screenshots', 'android');
  const sizes = [
    'phone',      // 1080x1920 (mínimo 2)
    'tablet-7',   // 1200x1920 (opcional)
    'tablet-10',  // 1600x2560 (opcional)
  ];
  
  sizes.forEach(size => {
    const dir = path.join(screenshotsDir, size);
    ensureDir(dir);
  });
  
  success('Estrutura de screenshots criada');
  info(`  Adicione screenshots em: ${screenshotsDir}`);
  info('  Tamanhos necessários:');
  info('    - phone: 1080x1920px (mínimo 2 imagens)');
  info('    - tablet-7: 1200x1920px (opcional)');
  info('    - tablet-10: 1600x2560px (opcional)');
}

// Criar README para assets
function createAssetsReadme() {
  info('Criando README de assets...');
  
  const readmePath = path.resolve('assets', 'screenshots', 'README.md');
  const readmeContent = `# Screenshots Android

## Estrutura de Diretórios

\`\`\`
screenshots/android/
├── phone/          # Screenshots para telefones (1080x1920px)
├── tablet-7/       # Screenshots para tablets 7" (1200x1920px)
└── tablet-10/       # Screenshots para tablets 10" (1600x2560px)
\`\`\`

## Requisitos Google Play

### Telefones (Obrigatório)
- **Tamanho**: 1080x1920 pixels
- **Quantidade mínima**: 2 screenshots
- **Quantidade máxima**: 8 screenshots
- **Formato**: PNG ou JPG
- **Peso máximo**: 8MB por imagem

### Tablets 7" (Opcional)
- **Tamanho**: 1200x1920 pixels
- **Quantidade**: 2-8 screenshots

### Tablets 10" (Opcional)
- **Tamanho**: 1600x2560 pixels
- **Quantidade**: 2-8 screenshots

## Feature Graphic

- **Tamanho**: 1024x500 pixels
- **Formato**: PNG ou JPG
- **Peso máximo**: 15MB
- **Localização**: \`assets/feature-graphic.png\`

## Dicas

1. Use screenshots que mostrem as principais funcionalidades do app
2. Adicione texto explicativo nas imagens (opcional)
3. Mantenha consistência visual entre os screenshots
4. Teste os screenshots em diferentes dispositivos antes de enviar
`;

  fs.writeFileSync(readmePath, readmeContent);
  success('README de assets criado');
}

// Main
function main() {
  log('\n📦 Preparação de Assets Android\n', 'blue');
  
  createScreenshotStructure();
  log('');
  
  createAssetsReadme();
  log('');
  
  // Verificar feature graphic
  const featureGraphicPath = path.resolve('assets', 'feature-graphic.png');
  if (!fs.existsSync(featureGraphicPath)) {
    warning('Feature graphic não encontrado (assets/feature-graphic.png)');
    info('  Tamanho recomendado: 1024x500px');
  } else {
    success('Feature graphic encontrado');
  }
  
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('✅ Preparação de assets concluída!', 'green');
  log('\nPróximos passos:');
  log('  1. Adicione screenshots nas pastas criadas');
  log('  2. Crie feature graphic (1024x500px)');
  log('  3. Execute npm run validate:android para validar\n');
}

main();

