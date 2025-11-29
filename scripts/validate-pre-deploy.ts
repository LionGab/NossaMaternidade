#!/usr/bin/env ts-node
/**
 * Script de Validação Pré-Deploy
 * Validação completa antes de build para iOS/Android
 * 
 * Uso: npm run validate:pre-deploy
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ValidationCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const checks: ValidationCheck[] = [];

// ======================
// VALIDATION CHECKS
// ======================

/**
 * Verifica se TypeScript compila sem erros
 */
function checkTypeScript(): void {
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    checks.push({
      name: 'TypeScript',
      status: 'pass',
      message: 'TypeScript compila sem erros',
    });
  } catch (error) {
    checks.push({
      name: 'TypeScript',
      status: 'fail',
      message: 'TypeScript tem erros. Execute: npm run type-check',
    });
  }
}

/**
 * Verifica se design tokens estão sendo usados corretamente
 */
function checkDesignTokens(): void {
  try {
    const result = execSync('node scripts/validate-design-tokens.js', { 
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    
    if (result.includes('Nenhuma violação encontrada') || result.includes('0 violations')) {
      checks.push({
        name: 'Design Tokens',
        status: 'pass',
        message: 'Design tokens validados com sucesso',
      });
    } else {
      checks.push({
        name: 'Design Tokens',
        status: 'fail',
        message: 'Violações de design tokens encontradas. Execute: npm run validate:design',
      });
    }
  } catch (error) {
    checks.push({
      name: 'Design Tokens',
      status: 'fail',
      message: 'Erro ao validar design tokens',
    });
  }
}

/**
 * Verifica se platform design está correto
 */
function checkPlatformDesign(): void {
  try {
    execSync('ts-node scripts/validate-platform-design.ts', { stdio: 'pipe' });
    checks.push({
      name: 'Platform Design',
      status: 'pass',
      message: 'Platform design validado (iOS/Android)',
    });
  } catch (error) {
    checks.push({
      name: 'Platform Design',
      status: 'warning',
      message: 'Algumas validações de platform design falharam (warnings)',
    });
  }
}

/**
 * Verifica se app.config.js está configurado corretamente
 */
function checkAppConfig(): void {
  const configPath = path.join(process.cwd(), 'app.config.js');
  
  if (!fs.existsSync(configPath)) {
    checks.push({
      name: 'App Config',
      status: 'fail',
      message: 'app.config.js não encontrado',
    });
    return;
  }

  try {
    // Ler e fazer parse básico do app.config.js
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Verificações básicas via regex (não precisa executar o código)
    const issues: string[] = [];
    
    // Verificar iOS bundleIdentifier
    if (!configContent.includes('bundleIdentifier') || !configContent.match(/bundleIdentifier:\s*['"][^'"]+['"]/)) {
      issues.push('iOS bundleIdentifier não configurado ou inválido');
    }
    
    // Verificar iOS buildNumber
    if (!configContent.includes('buildNumber') || !configContent.match(/buildNumber:\s*['"]?\d+['"]?/)) {
      issues.push('iOS buildNumber não configurado ou inválido');
    }
    
    // Verificar Android package
    if (!configContent.includes('package') || !configContent.match(/package:\s*['"][^'"]+['"]/)) {
      issues.push('Android package não configurado ou inválido');
    }
    
    // Verificar Android versionCode
    if (!configContent.includes('versionCode') || !configContent.match(/versionCode:\s*\d+/)) {
      issues.push('Android versionCode não configurado ou inválido');
    }

    if (issues.length === 0) {
    checks.push({
      name: 'App Config',
      status: 'pass',
      message: 'app.config.js configurado corretamente',
    });
  } else {
    checks.push({
      name: 'App Config',
      status: 'fail',
      message: `Problemas em app.config.js: ${issues.join(', ')}`,
    });
  }
  } catch (error) {
    checks.push({
      name: 'App Config',
      status: 'warning',
      message: `Erro ao ler app.config.js: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    });
  }
}

/**
 * Verifica se eas.json está configurado
 */
function checkEASConfig(): void {
  const easPath = path.join(process.cwd(), 'eas.json');
  
  if (!fs.existsSync(easPath)) {
    checks.push({
      name: 'EAS Config',
      status: 'fail',
      message: 'eas.json não encontrado',
    });
    return;
  }

  const eas = JSON.parse(fs.readFileSync(easPath, 'utf-8'));
  
  if (!eas.build?.production) {
    checks.push({
      name: 'EAS Config',
      status: 'warning',
      message: 'Profile de produção não configurado em eas.json',
    });
  } else {
    checks.push({
      name: 'EAS Config',
      status: 'pass',
      message: 'eas.json configurado corretamente',
    });
  }
}

/**
 * Verifica se assets existem
 */
function checkAssets(): void {
  const assetsDir = path.join(process.cwd(), 'assets');
  const requiredAssets = [
    'icon.png',
    'splash.png',
    'adaptive-icon.png',
  ];

  const missing: string[] = [];

  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    if (!fs.existsSync(assetPath)) {
      missing.push(asset);
    }
  });

  if (missing.length === 0) {
    checks.push({
      name: 'Assets',
      status: 'pass',
      message: 'Todos os assets necessários encontrados',
    });
  } else {
    checks.push({
      name: 'Assets',
      status: 'fail',
      message: `Assets faltando: ${missing.join(', ')}`,
    });
  }
}

/**
 * Verifica se .env.example existe (opcional)
 */
function checkEnvExample(): void {
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (fs.existsSync(envExamplePath)) {
    checks.push({
      name: 'Environment',
      status: 'pass',
      message: '.env.example encontrado',
    });
  } else {
    checks.push({
      name: 'Environment',
      status: 'warning',
      message: '.env.example não encontrado (opcional)',
    });
  }
}

/**
 * Verifica se não há uso de src/design-system/ (legado)
 */
function checkLegacyDesignSystem(): void {
  try {
    const result = execSync('grep -r "@/design-system" src/ || true', { 
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    
    if (result.trim().length === 0) {
      checks.push({
        name: 'Legacy Design System',
        status: 'pass',
        message: 'Nenhum uso de src/design-system/ (legado) encontrado',
      });
    } else {
      checks.push({
        name: 'Legacy Design System',
        status: 'fail',
        message: 'Uso de src/design-system/ (legado) detectado. Migre para src/theme/tokens.ts',
      });
    }
  } catch (error) {
    // grep pode falhar se não encontrar nada (exit code 1)
    checks.push({
      name: 'Legacy Design System',
      status: 'pass',
      message: 'Nenhum uso de src/design-system/ (legado) encontrado',
    });
  }
}

// ======================
// MAIN
// ======================

function runAllChecks(): void {
  console.log('\n🔍 Executando validações pré-deploy...\n');

  checkTypeScript();
  checkDesignTokens();
  checkPlatformDesign();
  checkAppConfig();
  checkEASConfig();
  checkAssets();
  checkEnvExample();
  checkLegacyDesignSystem();
}

function generateReport(): void {
  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  const warnings = checks.filter(c => c.status === 'warning').length;

  console.log('═'.repeat(80));
  console.log('📊 RELATÓRIO DE VALIDAÇÃO PRÉ-DEPLOY');
  console.log('═'.repeat(80));
  console.log(`\n✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(`⚠️  Avisos: ${warnings}\n`);

  checks.forEach(check => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${check.name}: ${check.message}`);
  });

  console.log('\n' + '═'.repeat(80));

  if (failed === 0) {
    console.log('\n✅ Todas as validações críticas passaram! Pronto para deploy.\n');
    process.exit(0);
  } else {
    console.log(`\n❌ ${failed} validação(ões) crítica(s) falharam. Corrija antes de fazer deploy.\n`);
    process.exit(1);
  }
}

// ======================
// EXECUTE
// ======================

runAllChecks();
generateReport();

