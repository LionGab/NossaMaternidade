#!/usr/bin/env node
/**
 * Auto Commit Script - Automatiza todo o processo de commit
 * 
 * Executa:
 * 1. Validações (TypeScript, ESLint)
 * 2. Adiciona arquivos ao Git
 * 3. Cria commit com mensagem descritiva
 * 4. Opcionalmente faz push
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

interface CommitOptions {
  message?: string;
  push?: boolean;
  skipValidation?: boolean;
  skipLint?: boolean;
}

function runCommand(command: string, options: { silent?: boolean } = {}): string {
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd()
    });
    const result = output?.toString() || '';
    if (!options.silent && result) {
      console.log(result);
    }
    return result;
  } catch (error) {
    if (!options.silent) {
      console.error(`❌ Erro ao executar: ${command}`);
      const errorOutput = (error as { stdout?: Buffer; stderr?: Buffer })?.stderr?.toString() || '';
      if (errorOutput) {
        console.error(errorOutput);
      }
    }
    throw error;
  }
}

function checkGitRepo(): boolean {
  try {
    runCommand('git rev-parse --git-dir', { silent: true });
    return true;
  } catch {
    return false;
  }
}

function getStagedFiles(): string[] {
  try {
    const output = runCommand('git diff --cached --name-only', { silent: true });
    return output.split('\n').filter(line => line.trim());
  } catch {
    return [];
  }
}

function getUnstagedFiles(): string[] {
  try {
    const output = runCommand('git status --porcelain', { silent: true });
    return output
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('??'))
      .map(line => line.substring(3).trim());
  } catch {
    return [];
  }
}

function generateCommitMessage(files: string[]): string {
  const categories: Record<string, string[]> = {
    feat: [],
    fix: [],
    chore: [],
    docs: [],
    refactor: [],
    style: [],
    test: []
  };

  files.forEach(file => {
    if (file.includes('test') || file.includes('spec')) {
      categories.test.push(file);
    } else if (file.includes('docs/') || file.endsWith('.md')) {
      categories.docs.push(file);
    } else if (file.includes('fix') || file.includes('bug')) {
      categories.fix.push(file);
    } else if (file.includes('refactor')) {
      categories.refactor.push(file);
    } else if (file.includes('style') || file.includes('format')) {
      categories.style.push(file);
    } else if (file.includes('feat') || file.includes('feature')) {
      categories.feat.push(file);
    } else {
      categories.chore.push(file);
    }
  });

  // Determina o tipo principal
  let mainType = 'chore';
  let maxCount = categories.chore.length;

  Object.entries(categories).forEach(([type, files]) => {
    if (files.length > maxCount) {
      maxCount = files.length;
      mainType = type;
    }
  });

  // Gera mensagem baseada no tipo
  const typeLabels: Record<string, string> = {
    feat: 'feat',
    fix: 'fix',
    chore: 'chore',
    docs: 'docs',
    refactor: 'refactor',
    style: 'style',
    test: 'test'
  };

  const typeLabel = typeLabels[mainType] || 'chore';
  const fileCount = files.length;
  
  // Mensagem curta para poucos arquivos
  if (fileCount <= 3) {
    const fileNames = files.map(f => f.split('/').pop()).join(', ');
    return `${typeLabel}: ${fileNames}`;
  }

  // Mensagem descritiva para muitos arquivos
  const descriptions: Record<string, string> = {
    feat: 'adiciona novas funcionalidades',
    fix: 'corrige problemas e bugs',
    chore: 'atualiza configurações e dependências',
    docs: 'atualiza documentação',
    refactor: 'refatora código',
    style: 'ajusta formatação',
    test: 'adiciona ou atualiza testes'
  };

  return `${typeLabel}: ${descriptions[mainType] || 'atualiza arquivos'} (${fileCount} arquivos)`;
}

async function autoCommit(options: CommitOptions = {}): Promise<void> {
  console.log('🚀 Auto Commit - Nossa Maternidade\n');

  // 1. Verificar se é um repositório Git
  if (!checkGitRepo()) {
    console.error('❌ Não é um repositório Git!');
    process.exit(1);
  }

  // 2. Verificar se há mudanças
  const unstagedFiles = getUnstagedFiles();
  const stagedFiles = getStagedFiles();

  if (unstagedFiles.length === 0 && stagedFiles.length === 0) {
    console.log('ℹ️  Nenhuma mudança para commitar.');
    return;
  }

  console.log(`📝 Arquivos modificados: ${unstagedFiles.length}`);
  console.log(`📦 Arquivos staged: ${stagedFiles.length}\n`);

  // 3. Adicionar arquivos ao Git
  if (unstagedFiles.length > 0) {
    console.log('📥 Adicionando arquivos ao Git...');
    try {
      runCommand('git add -A');
      console.log('✅ Arquivos adicionados\n');
    } catch (error) {
      console.error('❌ Erro ao adicionar arquivos:', error);
      process.exit(1);
    }
  }

  // 4. Validações (se não pular)
  if (!options.skipValidation) {
    console.log('🔍 Executando validações...\n');

    // TypeScript
    try {
      console.log('📦 TypeScript...');
      runCommand('npm run type-check', { silent: true });
      console.log('✅ TypeScript passou\n');
    } catch (error) {
      console.error('❌ TypeScript falhou!');
      if (!options.skipLint) {
        console.log('💡 Use --skip-validation para pular validações');
        process.exit(1);
      }
    }

    // ESLint (se não pular)
    if (!options.skipLint) {
      try {
        console.log('🧹 ESLint...');
        runCommand('npm run lint', { silent: true });
        console.log('✅ ESLint passou\n');
      } catch (error) {
        console.warn('⚠️  ESLint tem warnings (continuando...)');
      }
    }
  }

  // 5. Gerar mensagem de commit
  const allFiles = [...new Set([...stagedFiles, ...unstagedFiles])];
  const commitMessage = options.message || generateCommitMessage(allFiles);

  console.log(`📝 Mensagem de commit: ${commitMessage}\n`);

  // 6. Criar commit
  try {
    console.log('💾 Criando commit...');
    runCommand(`git commit -m "${commitMessage}"`);
    console.log('✅ Commit criado com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro ao criar commit:', error);
    process.exit(1);
  }

  // 7. Push (se solicitado)
  if (options.push) {
    try {
      console.log('📤 Enviando para o remoto...');
      runCommand('git push');
      console.log('✅ Push concluído!\n');
    } catch (error) {
      console.error('❌ Erro ao fazer push:', error);
      console.log('💡 Execute manualmente: git push');
    }
  } else {
    const branch = runCommand('git branch --show-current', { silent: true }).trim();
    console.log(`💡 Para enviar ao remoto: git push`);
    console.log(`📊 Branch atual: ${branch}\n`);
  }

  console.log('🎉 Processo concluído!');
}

// CLI
const args = process.argv.slice(2);
const options: CommitOptions = {
  push: args.includes('--push') || args.includes('-p'),
  skipValidation: args.includes('--skip-validation') || args.includes('--skip'),
  skipLint: args.includes('--skip-lint'),
};

// Mensagem customizada
const messageIndex = args.findIndex(arg => arg === '--message' || arg === '-m');
if (messageIndex !== -1 && args[messageIndex + 1]) {
  options.message = args[messageIndex + 1];
}

// Executar
autoCommit(options).catch((error: unknown) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

export { autoCommit };

