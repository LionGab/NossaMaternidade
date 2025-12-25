# Configuração do Termius no Cursor

Este guia explica como integrar o Termius (cliente SSH/SFTP) ao Cursor via MCP.

**Status**: ⚠️ Não existe servidor MCP oficial do Termius

## Opções Disponíveis

### Opção 1: Usar SSH Diretamente (Recomendado)

O Termius é um cliente SSH visual. Para uso no Cursor, você pode:

1. **Usar SSH via terminal integrado do Cursor**
2. **Criar um servidor MCP customizado** que se comunica com o Termius

### Opção 2: Servidor MCP Customizado (Avançado)

Se você precisa de integração programática, pode criar um servidor MCP que:

- Lista hosts do Termius
- Executa comandos SSH
- Gerencia conexões

**Pré-requisitos**:

- Node.js instalado
- Termius instalado e configurado
- Acesso aos dados do Termius (via API ou banco de dados local)

## Configuração Manual (macOS)

### Localização do Arquivo de Configuração

No macOS, o arquivo de configuração do Cursor fica em:

```
~/Library/Application Support/Cursor/User/settings.json
```

### Exemplo de Configuração (Servidor MCP Customizado)

Se você criar um servidor MCP customizado para Termius, adicione ao `settings.json`:

```json
{
  "mcpServers": {
    "termius": {
      "description": "Termius SSH/SFTP MCP Server (customizado)",
      "command": "node",
      "args": ["/caminho/para/termius-mcp-server/index.js"],
      "env": {
        "TERMIUS_DATA_PATH": "~/.termius"
      }
    }
  }
}
```

### Alternativa: Usar SSH Diretamente

Para uso simples, você pode usar SSH diretamente no terminal do Cursor:

1. Abra o terminal integrado do Cursor (`Ctrl+`` ou `Cmd+``)
2. Use comandos SSH normais:

   ```bash
   ssh usuario@hostname
   ```

3. Ou configure SSH config em `~/.ssh/config`:
   ```
   Host meu-servidor
       HostName servidor.example.com
       User usuario
       Port 22
       IdentityFile ~/.ssh/id_rsa
   ```

## Integração com Termius Desktop

Se você usa o Termius Desktop App, você pode:

1. **Exportar configurações do Termius** (formato JSON)
2. **Criar um script Node.js** que lê essas configurações
3. **Expor via MCP** para o Cursor

### Exemplo de Servidor MCP Customizado

Crie um arquivo `termius-mcp-server.js`:

```javascript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const server = new Server(
  {
    name: "termius-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Ler hosts do Termius (ajuste o caminho conforme necessário)
function getTermiusHosts() {
  try {
    const termiusPath = join(homedir(), ".termius", "hosts.json");
    const data = readFileSync(termiusPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Tool: listar hosts
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_termius_hosts",
      description: "Lista todos os hosts configurados no Termius",
    },
    {
      name: "connect_termius_host",
      description: "Conecta a um host do Termius via SSH",
      inputSchema: {
        type: "object",
        properties: {
          hostId: {
            type: "string",
            description: "ID do host no Termius",
          },
        },
        required: ["hostId"],
      },
    },
  ],
}));

// Tool: executar comando
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_termius_hosts") {
    const hosts = getTermiusHosts();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(hosts, null, 2),
        },
      ],
    };
  }

  if (name === "connect_termius_host") {
    // Implementar lógica de conexão SSH
    return {
      content: [
        {
          type: "text",
          text: `Conectando ao host ${args.hostId}...`,
        },
      ],
    };
  }

  throw new Error(`Tool desconhecido: ${name}`);
});

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Termius MCP Server rodando");
}

main().catch(console.error);
```

## Configuração no Cursor (macOS)

1. **Abra o arquivo de configuração**:

   ```bash
   open ~/Library/Application\ Support/Cursor/User/settings.json
   ```

2. **Adicione a configuração do Termius MCP** (se você criou um servidor customizado):

   ```json
   {
     "mcpServers": {
       "termius": {
         "command": "node",
         "args": ["/caminho/absoluto/para/termius-mcp-server.js"]
       }
     }
   }
   ```

3. **Reinicie o Cursor** para aplicar as mudanças

## Alternativa Simples: Terminal Integrado

Para a maioria dos casos, usar o terminal integrado do Cursor é suficiente:

1. Abra o terminal: `Cmd+`` (macOS) ou `Ctrl+`` (Windows)
2. Use SSH normalmente:

   ```bash
   ssh usuario@servidor.com
   ```

3. Configure aliases no `~/.zshrc` ou `~/.bashrc`:
   ```bash
   alias servidor-prod="ssh usuario@prod.example.com"
   alias servidor-dev="ssh usuario@dev.example.com"
   ```

## Troubleshooting

### Termius MCP não aparece

- Verifique se o servidor MCP customizado está instalado
- Confirme que o caminho no `settings.json` está correto
- Verifique os logs do Cursor: `Help > Toggle Developer Tools > Console`

### Erro ao conectar

- Certifique-se de que o Termius está instalado
- Verifique o caminho dos dados do Termius (pode variar por OS)
- No macOS: `~/.termius/`
- No Windows: `%APPDATA%\Termius\`

## Referências

- [Termius Documentation](https://docs.termius.com/)
- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [Cursor MCP Setup](./MCP_SETUP.md)
