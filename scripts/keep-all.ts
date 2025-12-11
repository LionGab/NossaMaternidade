#!/usr/bin/env node
/**
 * Script Keep All - Aceita todas as mudanças automaticamente
 *
 * Força o Git a aceitar todas as mudanças e manter todos os arquivos
 * Útil quando o Cursor pede "Keep File" para múltiplos arquivos
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import { glob } from 'glob';

const CONFIG = {
  includePatterns: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.js',
    'src/**/*.jsx',
    'scripts/**/*.ts',
    '*.ts',
    '*.tsx',
    '*.json',
    '*.md',
  ],
  excludePatterns: ['node_modules/**', 'dist/**', '.git/**', 'dev-dist/**', '**/*.d.ts'],
};

async function keepAllFiles(): Promise<void> {
  console.log('🔄 Mantendo todos os arquivos...\n');

  try {
    // Primeiro, tenta adicionar tudo via git add
    try {
      execSync('git add -A', {
        encoding: 'utf-8',
        stdio: 'pipe',
        cwd: process.cwd(),
      });
      console.log('✅ Todos os arquivos adicionados ao Git\n');
    } catch (error) {
      console.warn('⚠️  Não foi possível adicionar todos via Git (pode não ser um repo Git)\n');
    }

    // Lista arquivos modificados/não rastreados
    try {
      const statusOutput = execSync('git status --porcelain', {
        encoding: 'utf-8',
        stdio: 'pipe',
        cwd: process.cwd(),
      });

      const files = statusOutput
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => line.substring(3).trim())
        .filter((file) => {
          // Verifica se está nos padrões incluídos
          return CONFIG.includePatterns.some((pattern) => {
            const globPattern = pattern.replace(/\*\*/g, '**');
            return file.match(new RegExp(globPattern.replace(/\*/g, '.*'))) !== null;
          });
        });

      if (files.length > 0) {
        console.log(`📝 Encontrados ${files.length} arquivo(s) modificado(s):\n`);

        for (const file of files) {
          if (existsSync(file)) {
            try {
              execSync(`git add -f "${file}"`, {
                encoding: 'utf-8',
                stdio: 'pipe',
                cwd: process.cwd(),
              });
              console.log(`✅ ${file}`);
            } catch {
              console.log(`⚠️  ${file} - Não foi possível adicionar`);
            }
          }
        }
      } else {
        console.log('ℹ️  Nenhum arquivo modificado encontrado\n');
      }
    } catch (error) {
      console.warn('⚠️  Não foi possível verificar status do Git\n');
    }

    // Também busca arquivos via glob para garantir
    const allFiles: string[] = [];
    for (const pattern of CONFIG.includePatterns) {
      try {
        const matches = await glob(pattern, {
          ignore: CONFIG.excludePatterns,
          absolute: false,
          cwd: process.cwd(),
        });
        allFiles.push(...matches);
      } catch {
        // Ignora erros de glob
      }
    }

    // Remove duplicatas
    const uniqueFiles = [...new Set(allFiles)];

    if (uniqueFiles.length > 0) {
      console.log(`\n📦 Mantendo ${uniqueFiles.length} arquivo(s) do projeto...\n`);

      let kept = 0;
      for (const file of uniqueFiles) {
        if (existsSync(file)) {
          try {
            execSync(`git add -f "${file}"`, {
              encoding: 'utf-8',
              stdio: 'pipe',
              cwd: process.cwd(),
            });
            kept++;
          } catch {
            // Ignora erros silenciosamente
          }
        }
      }

      console.log(`\n✅ ${kept} arquivo(s) mantido(s) automaticamente!`);
    }
  } catch (error) {
    console.error('❌ Erro ao manter arquivos:', error);
    process.exit(1);
  }
}

// Main
if (
  import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') || '') ||
  process.argv[1]?.includes('keep-all')
) {
  keepAllFiles().catch((error: unknown) => {
    console.error('Erro:', error);
    process.exit(1);
  });
}

export { keepAllFiles };
