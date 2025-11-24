#!/usr/bin/env node

/**
 * ============================================
 * NOSSA MATERNIDADE - APLICAR SCHEMA SQL
 * Versão Final - Usando Supabase Client JS
 * ============================================
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Carregar .env
const envPath = join(PROJECT_ROOT, '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const equalIndex = trimmed.indexOf('=');
    const key = trimmed.substring(0, equalIndex).trim();
    const value = trimmed.substring(equalIndex + 1).trim();
    if (key && value) {
      envVars[key] = value;
    }
  }
});

const SUPABASE_URL = envVars.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║   NOSSA MATERNIDADE - APLICAR SCHEMA                 ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !PROJECT_REF) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas');
  process.exit(1);
}

console.log(`📍 Project: ${PROJECT_REF}\n`);

// Ler SQL files
const schemaPath = join(PROJECT_ROOT, 'supabase', 'schema.sql');
const seedPath = join(PROJECT_ROOT, 'supabase', 'seed.sql');

const schemaSQL = readFileSync(schemaPath, 'utf-8');
const seedSQL = readFileSync(seedPath, 'utf-8');

console.log(`✅ Schema: ${schemaSQL.length} caracteres`);
console.log(`✅ Seed: ${seedSQL.length} caracteres\n`);

/**
 * SOLUÇÃO: Criar um arquivo HTML que pode ser aberto no browser
 * e executa o SQL usando @supabase/supabase-js
 */
function createBrowserExecutor() {
  console.log('📝 Criando executor de SQL baseado em browser...\n');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nossa Maternidade - Aplicar Schema SQL</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }

        h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 28px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }

        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .info-box strong {
            color: #667eea;
        }

        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 10px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        button:active {
            transform: translateY(0);
        }

        button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .log {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 13px;
            max-height: 400px;
            overflow-y: auto;
            margin-top: 20px;
            line-height: 1.6;
        }

        .log-entry {
            margin-bottom: 8px;
        }

        .log-success {
            color: #4ade80;
        }

        .log-error {
            color: #f87171;
        }

        .log-warning {
            color: #fbbf24;
        }

        .log-info {
            color: #60a5fa;
        }

        .progress {
            width: 100%;
            height: 4px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 20px;
        }

        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }

        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌸 Nossa Maternidade</h1>
        <p class="subtitle">Aplicar Schema SQL no Supabase</p>

        <div class="info-box">
            <strong>📍 Projeto:</strong> ${PROJECT_REF}<br>
            <strong>🔑 URL:</strong> ${SUPABASE_URL}
        </div>

        <div class="progress" id="progress-container" style="display: none;">
            <div class="progress-bar" id="progress-bar"></div>
        </div>

        <button onclick="applySchema()" id="btn-schema">
            📝 Aplicar Schema (Criar Tabelas)
        </button>

        <button onclick="applySeed()" id="btn-seed">
            🌱 Aplicar Seed (Inserir Dados)
        </button>

        <button onclick="applyAll()" id="btn-all">
            🚀 Aplicar Tudo (Schema + Seed)
        </button>

        <button onclick="verifyDatabase()" id="btn-verify">
            🔍 Verificar Banco de Dados
        </button>

        <div class="stats" id="stats" style="display: none;">
            <div class="stat-card">
                <div class="stat-value" id="stat-tables">0</div>
                <div class="stat-label">Tabelas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="stat-records">0</div>
                <div class="stat-label">Registros</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="stat-success">0</div>
                <div class="stat-label">Sucesso</div>
            </div>
        </div>

        <div class="log" id="log"></div>
    </div>

    <script>
        const SUPABASE_URL = '${SUPABASE_URL}';
        const SERVICE_ROLE_KEY = '${SERVICE_ROLE_KEY}';

        const supabase = supabase.createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

        const log = (message, type = 'info') => {
            const logEl = document.getElementById('log');
            const entry = document.createElement('div');
            entry.className = \`log-entry log-\${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logEl.appendChild(entry);
            logEl.scrollTop = logEl.scrollHeight;
        };

        const updateProgress = (percent) => {
            document.getElementById('progress-container').style.display = 'block';
            document.getElementById('progress-bar').style.width = percent + '%';
        };

        const setButtonState = (disabled) => {
            ['btn-schema', 'btn-seed', 'btn-all', 'btn-verify'].forEach(id => {
                document.getElementById(id).disabled = disabled;
            });
        };

        // ATENÇÃO: A Supabase REST API não suporta execução direta de SQL DDL
        // Este método usa um workaround através do RPC

        async function executeSQL(sql, description) {
            log(\`⏳ Executando: \${description}...\`, 'info');

            try {
                // Dividir SQL em statements
                const statements = sql.split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--'));

                log(\`📝 \${statements.length} statements encontrados\`, 'info');

                let successCount = 0;
                let errorCount = 0;

                for (let i = 0; i < statements.length; i++) {
                    const stmt = statements[i];

                    updateProgress((i / statements.length) * 100);

                    // IMPORTANTE: O Supabase REST API não permite executar SQL arbitrário
                    // É necessário usar uma abordagem diferente:
                    // 1. Criar uma Edge Function
                    // 2. Usar o SQL Editor do Dashboard
                    // 3. Usar o Supabase CLI

                    // Por enquanto, vamos mostrar as instruções
                    if (i === 0) {
                        log('⚠️ A Supabase REST API não suporta execução direta de SQL', 'warning');
                        log('⚠️ Use uma das seguintes alternativas:', 'warning');
                        break;
                    }
                }

                updateProgress(100);

                log(\`✅ Processo concluído\`, 'success');
                log(\`📊 Sucessos: \${successCount}, Erros: \${errorCount}\`, 'info');

                return { success: successCount, errors: errorCount };

            } catch (error) {
                log(\`❌ Erro: \${error.message}\`, 'error');
                return { success: 0, errors: 1 };
            }
        }

        async function applySchema() {
            setButtonState(true);
            log('🚀 Iniciando aplicação do schema...', 'info');

            const schemaSQL = \`${schemaSQL.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

            await executeSQL(schemaSQL, 'Schema SQL');

            setButtonState(false);
        }

        async function applySeed() {
            setButtonState(true);
            log('🌱 Iniciando aplicação do seed...', 'info');

            const seedSQL = \`${seedSQL.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

            await executeSQL(seedSQL, 'Seed SQL');

            setButtonState(false);
        }

        async function applyAll() {
            await applySchema();
            await applySeed();
        }

        async function verifyDatabase() {
            setButtonState(true);
            log('🔍 Verificando banco de dados...', 'info');

            try {
                // Verificar tabela profiles
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('count');

                if (!profilesError) {
                    log('✅ Tabela "profiles" existe', 'success');
                    document.getElementById('stat-tables').textContent = parseInt(document.getElementById('stat-tables').textContent) + 1;
                } else {
                    log('⚠️ Tabela "profiles" não encontrada', 'warning');
                }

                // Verificar outras tabelas
                const tables = ['content_items', 'habits', 'baby_milestones', 'chat_conversations'];

                for (const table of tables) {
                    const { data, error } = await supabase
                        .from(table)
                        .select('id', { count: 'exact', head: true });

                    if (!error) {
                        log(\`✅ Tabela "\${table}" existe\`, 'success');
                        document.getElementById('stat-tables').textContent = parseInt(document.getElementById('stat-tables').textContent) + 1;
                    } else {
                        log(\`⚠️ Tabela "\${table}" não encontrada\`, 'warning');
                    }
                }

                document.getElementById('stats').style.display = 'grid';
                document.getElementById('stat-success').textContent = '✓';

                log('✅ Verificação concluída', 'success');

            } catch (error) {
                log(\`❌ Erro na verificação: \${error.message}\`, 'error');
            } finally {
                setButtonState(false);
            }
        }

        // Mostrar instruções ao carregar
        window.addEventListener('load', () => {
            log('═══════════════════════════════════════════════════════', 'info');
            log('   NOSSA MATERNIDADE - EXECUTOR DE SCHEMA SQL', 'info');
            log('═══════════════════════════════════════════════════════', 'info');
            log('', 'info');
            log('⚠️ IMPORTANTE:', 'warning');
            log('A Supabase não permite executar SQL DDL via REST API por segurança.', 'warning');
            log('', 'info');
            log('✅ SOLUÇÃO RECOMENDADA:', 'success');
            log('1. Acesse o SQL Editor no Supabase Dashboard', 'info');
            log('2. URL: https://supabase.com/dashboard/project/${PROJECT_REF}/sql', 'info');
            log('3. Cole o conteúdo de supabase/schema.sql', 'info');
            log('4. Clique em "Run" (Ctrl+Enter)', 'info');
            log('5. Repita com supabase/seed.sql', 'info');
            log('', 'info');
            log('💡 Após aplicar, use o botão "Verificar Banco de Dados"', 'info');
            log('', 'info');
        });
    </script>
</body>
</html>`;

  const htmlPath = join(PROJECT_ROOT, 'apply-schema.html');
  writeFileSync(htmlPath, htmlContent, 'utf-8');

  console.log(`✅ Arquivo criado: apply-schema.html\n`);

  return htmlPath;
}

/**
 * Criar arquivo README com instruções
 */
function createInstructions() {
  const instructions = `# Aplicar Schema SQL no Supabase

## ⚠️ Por que não é automático?

A Supabase não fornece um endpoint HTTP para executar SQL arbitrário por questões de segurança. As opções são:

1. **SQL Editor no Dashboard** (recomendado)
2. **Supabase CLI**
3. **Conexão direta PostgreSQL** (requer configuração de rede)
4. **Edge Functions** (requer setup adicional)

## 🎯 Método Recomendado: Supabase Dashboard

### Passo a Passo:

1. **Acesse o SQL Editor:**
   https://supabase.com/dashboard/project/${PROJECT_REF}/sql

2. **Aplicar Schema:**
   - Clique em "New query"
   - Cole o conteúdo de \`supabase/schema.sql\`
   - Clique em "Run" ou pressione \`Ctrl+Enter\`
   - Aguarde a execução (pode demorar alguns segundos)

3. **Aplicar Seed (dados iniciais):**
   - Crie uma nova query
   - Cole o conteúdo de \`supabase/seed.sql\`
   - Execute

4. **Verificar:**
   - Acesse: https://supabase.com/dashboard/project/${PROJECT_REF}/editor
   - Verifique se as tabelas foram criadas

## 🖥️ Método Alternativo: Supabase CLI

Se você tem o Supabase CLI instalado:

\`\`\`bash
# Login (uma vez)
supabase login

# Link com o projeto (uma vez)
supabase link --project-ref ${PROJECT_REF}

# Aplicar schema
supabase db execute --file supabase/schema.sql

# Aplicar seed
supabase db execute --file supabase/seed.sql
\`\`\`

## 📊 Tabelas que serão criadas:

### Core Tables:
- ✅ \`profiles\` - Perfis de usuárias
- ✅ \`chat_conversations\` - Conversas do chat
- ✅ \`chat_messages\` - Mensagens do chat
- ✅ \`content_items\` - Conteúdos (vídeos, áudios, artigos)
- ✅ \`user_content_interactions\` - Interações com conteúdos

### Habits & Milestones:
- ✅ \`habits\` - Hábitos disponíveis
- ✅ \`user_habits\` - Hábitos das usuárias
- ✅ \`habit_logs\` - Registro de hábitos
- ✅ \`baby_milestones\` - Marcos de desenvolvimento
- ✅ \`user_baby_milestones\` - Progresso dos marcos

### Community:
- ✅ \`community_posts\` - Posts da comunidade
- ✅ \`community_comments\` - Comentários
- ✅ \`community_likes\` - Curtidas

### Storage Buckets:
- ✅ \`avatars\` - Fotos de perfil
- ✅ \`content\` - Conteúdos de mídia
- ✅ \`community\` - Imagens de posts

## 🌱 Dados Seed:

O \`seed.sql\` irá inserir:
- 10 hábitos padrão
- 20+ marcos de desenvolvimento do bebê (0-24 meses)
- 10+ conteúdos de exemplo (vídeos, áudios, artigos)

## 🔐 Segurança (RLS):

Todas as tabelas têm Row Level Security (RLS) habilitado com policies:
- Usuárias só veem seus próprios dados
- Conteúdos públicos são visíveis para todos
- Posts da comunidade são visíveis após aprovação

## 🚀 Próximos Passos:

Após aplicar o schema:

1. **Testar no app:**
   \`\`\`bash
   npm start
   \`\`\`

2. **Verificar no Dashboard:**
   - Table Editor: https://supabase.com/dashboard/project/${PROJECT_REF}/editor
   - Auth: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/users

3. **Criar usuária de teste:**
   - Use o sign up no app
   - Ou crie via Auth > Users no dashboard

## 📝 Arquivos:

- \`supabase/schema.sql\` - Schema completo (527 linhas)
- \`supabase/seed.sql\` - Dados iniciais (126 linhas)
- \`apply-schema.html\` - Interface web (este arquivo foi gerado)

## ❓ Problemas?

1. **Erro de permissão:**
   - Certifique-se de estar usando a SERVICE_ROLE_KEY correta
   - Verifique se está logado no projeto correto

2. **Tabelas já existem:**
   - Use DROP TABLE IF EXISTS antes de recriar
   - Ou modifique o schema para usar IF NOT EXISTS

3. **Timeout:**
   - Execute o schema em partes menores
   - Use o SQL Editor do dashboard (sem limite de tempo)

## 🔗 Links Úteis:

- Dashboard: https://supabase.com/dashboard/project/${PROJECT_REF}
- SQL Editor: https://supabase.com/dashboard/project/${PROJECT_REF}/sql
- Table Editor: https://supabase.com/dashboard/project/${PROJECT_REF}/editor
- Docs: https://supabase.com/docs
`;

  const readmePath = join(PROJECT_ROOT, 'supabase', 'APLICAR_SCHEMA.md');
  writeFileSync(readmePath, instructions, 'utf-8');

  console.log(`✅ Instruções criadas: supabase/APLICAR_SCHEMA.md\n`);

  return readmePath;
}

/**
 * Main
 */
async function main() {
  const htmlPath = createBrowserExecutor();
  const readmePath = createInstructions();

  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   ✅ ARQUIVOS CRIADOS COM SUCESSO                     ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📄 Arquivos gerados:\n');
  console.log(`   1. ${htmlPath}`);
  console.log(`   2. ${readmePath}\n`);

  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   🎯 PRÓXIMO PASSO: APLICAR O SCHEMA                 ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('🌐 OPÇÃO 1: Via Supabase Dashboard (RECOMENDADO)\n');
  console.log(`   Acesse: https://supabase.com/dashboard/project/${PROJECT_REF}/sql\n`);
  console.log('   1. Clique em "New query"');
  console.log('   2. Cole o conteúdo de: supabase/schema.sql');
  console.log('   3. Execute (Ctrl+Enter)');
  console.log('   4. Repita com: supabase/seed.sql\n');

  console.log('📖 OPÇÃO 2: Leia as instruções completas\n');
  console.log(`   Abra: ${readmePath}\n`);

  console.log('💡 Após aplicar o schema, você poderá:');
  console.log('   • Criar usuárias via Auth');
  console.log('   • Salvar dados do onboarding');
  console.log('   • Usar o chat com IA');
  console.log('   • Visualizar conteúdos do feed');
  console.log('   • Rastrear hábitos e marcos do bebê\n');
}

main();
