/**
 * Script de Verificação de Secrets
 * 
 * Verifica se há chaves de API ou secrets expostos no código
 * 
 * Uso:
 *   npm run check:secrets
 *   ts-node scripts/check-secrets.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Compatibilidade ES modules
const getDirname = () => {
  try {
    return dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
};

interface SecretPattern {
  name: string;
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

const SECRET_PATTERNS: SecretPattern[] = [
  {
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{32,}/,
    severity: 'critical',
    description: 'OpenAI API keys começam com "sk-"',
  },
  {
    name: 'GitHub Personal Access Token',
    pattern: /ghp_[a-zA-Z0-9]{36,}/,
    severity: 'critical',
    description: 'GitHub PATs começam com "ghp_"',
  },
  {
    name: 'GitHub OAuth Token',
    pattern: /gho_[a-zA-Z0-9]{36,}/,
    severity: 'critical',
    description: 'GitHub OAuth tokens começam com "gho_"',
  },
  {
    name: 'GitHub User Token',
    pattern: /ghu_[a-zA-Z0-9]{36,}/,
    severity: 'critical',
    description: 'GitHub user tokens começam com "ghu_"',
  },
  {
    name: 'GitHub Session Token',
    pattern: /ghs_[a-zA-Z0-9]{36,}/,
    severity: 'critical',
    description: 'GitHub session tokens começam com "ghs_"',
  },
  {
    name: 'GitHub Refresh Token',
    pattern: /ghr_[a-zA-Z0-9]{36,}/,
    severity: 'critical',
    description: 'GitHub refresh tokens começam com "ghr_"',
  },
  {
    name: 'Google API Key',
    pattern: /AIza[0-9A-Za-z-_]{35}/,
    severity: 'critical',
    description: 'Google API keys começam com "AIza"',
  },
  {
    name: 'AWS Access Key ID',
    pattern: /AKIA[0-9A-Z]{16}/,
    severity: 'critical',
    description: 'AWS Access Key IDs começam com "AKIA"',
  },
  {
    name: 'AWS Secret Access Key',
    pattern: /(aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*=\s*[0-9a-zA-Z/+]{40}/,
    severity: 'high',
    description: 'AWS Secret Access Keys têm 40 caracteres e aparecem com variável',
  },
  {
    name: 'Supabase Service Role Key',
    pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
    severity: 'critical',
    description: 'JWT tokens do Supabase (service role)',
  },
  {
    name: 'Private Key (RSA)',
    pattern: /-----BEGIN (RSA )?PRIVATE KEY-----/,
    severity: 'critical',
    description: 'Chaves privadas RSA',
  },
  {
    name: 'Private Key (EC)',
    pattern: /-----BEGIN EC PRIVATE KEY-----[A-Za-z0-9+\/=\s]+-----END EC PRIVATE KEY-----/,
    severity: 'critical',
    description: 'Chaves privadas EC completas',
  },
];

// Arquivos e pastas a ignorar
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.expo/,
  /\.env$/,
  /\.env\.local$/,
  /\.env\.production$/,
  /package-lock\.json/,
  /yarn\.lock/,
  /\.log$/,
  /\.tsbuildinfo$/,
  /scripts\/check-secrets\.ts$/, // Ignorar este arquivo
];

// Extensões de arquivo para verificar
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml'];

interface FoundSecret {
  file: string;
  line: number;
  pattern: SecretPattern;
  match: string;
  context: string;
}

function shouldIgnoreFile(filePath: string): boolean {
  return IGNORE_PATTERNS.some((pattern) => pattern.test(filePath));
}

function getFileExtension(filePath: string): string {
  const parts = filePath.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
}

function findSecretsInFile(filePath: string): FoundSecret[] {
  const secrets: FoundSecret[] = [];

  if (!existsSync(filePath)) {
    return secrets;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach((pattern) => {
        const matches = line.match(pattern.pattern);
        if (matches) {
          // Verificar se não é um placeholder ou comentário
          const isPlaceholder =
            line.includes('your_') ||
            line.includes('xxx') ||
            line.includes('example') ||
            line.includes('placeholder') ||
            line.includes('REMOVED') ||
            line.trim().startsWith('//') ||
            line.trim().startsWith('#') ||
            line.trim().startsWith('*') ||
            line.includes('pattern:') || // Ignorar definições de padrões regex
            line.includes('RegExp') ||
            line.includes('SECRET_PATTERNS') ||
            line.includes('BEGIN EC PRIVATE KEY') && !line.includes('-----END'); // Ignorar se não for chave completa

          if (!isPlaceholder) {
            secrets.push({
              file: filePath,
              line: index + 1,
              pattern,
              match: matches[0],
              context: line.trim().substring(0, 100),
            });
          }
        }
      });
    });
  } catch (error) {
    // Ignorar erros de leitura (permissões, etc.)
  }

  return secrets;
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  try {
    if (!existsSync(dir)) {
      return fileList;
    }

    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      
      if (shouldIgnoreFile(fullPath)) {
        continue;
      }

      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          getAllFiles(fullPath, fileList);
        } else if (stat.isFile()) {
          const ext = getFileExtension(fullPath);
          if (FILE_EXTENSIONS.includes(ext)) {
            fileList.push(fullPath);
          }
        }
      } catch (error) {
        // Ignorar erros de permissão
        continue;
      }
    }
  } catch (error) {
    // Ignorar erros
  }

  return fileList;
}

function main() {
  console.log('🔍 Verificando secrets no código...\n');

  const rootDir = join(getDirname(), '..');
  const files = getAllFiles(rootDir);
  const allSecrets: FoundSecret[] = [];

  console.log(`📁 Verificando ${files.length} arquivos...\n`);

  files.forEach((file) => {
    const secrets = findSecretsInFile(file);
    allSecrets.push(...secrets);
  });

  // Agrupar por severidade
  const critical = allSecrets.filter((s) => s.pattern.severity === 'critical');
  const high = allSecrets.filter((s) => s.pattern.severity === 'high');
  const medium = allSecrets.filter((s) => s.pattern.severity === 'medium');

  // Exibir resultados
  if (allSecrets.length === 0) {
    console.log('✅ Nenhum secret detectado no código!\n');
    process.exit(0);
  }

  console.log('🚨 SECRETS DETECTADOS!\n');
  console.log(`📊 Resumo:`);
  console.log(`   🔴 Críticos: ${critical.length}`);
  console.log(`   🟠 Altos: ${high.length}`);
  console.log(`   🟡 Médios: ${medium.length}\n`);

  if (critical.length > 0) {
    console.log('🔴 SECRETS CRÍTICOS:\n');
    critical.forEach((secret) => {
      console.log(`   📄 ${secret.file}:${secret.line}`);
      console.log(`   🔑 Tipo: ${secret.pattern.name}`);
      console.log(`   📝 Contexto: ${secret.context}`);
      console.log(`   ⚠️  ${secret.pattern.description}\n`);
    });
  }

  if (high.length > 0) {
    console.log('🟠 SECRETS DE ALTA SEVERIDADE:\n');
    high.forEach((secret) => {
      console.log(`   📄 ${secret.file}:${secret.line}`);
      console.log(`   🔑 Tipo: ${secret.pattern.name}`);
      console.log(`   📝 Contexto: ${secret.context}\n`);
    });
  }

  console.log('\n💡 AÇÕES RECOMENDADAS:');
  console.log('   1. Remova os secrets do código');
  console.log('   2. Use variáveis de ambiente (.env)');
  console.log('   3. Configure secrets no GitHub (Settings → Secrets)');
  console.log('   4. Se as chaves foram expostas, REGENERE-AS imediatamente');
  console.log('   5. Revise o histórico do Git: git log -p -S "sua-chave"\n');

  process.exit(critical.length > 0 ? 1 : 0);
}

// Executar se for chamado diretamente
main();

export { findSecretsInFile, SECRET_PATTERNS };

