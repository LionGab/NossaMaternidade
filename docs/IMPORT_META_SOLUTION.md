# 🔧 Solução para Erro "Cannot use 'import.meta' outside a module"

## Problema

O erro `Uncaught SyntaxError: Cannot use 'import.meta' outside a module` ocorre quando o código tenta usar `import.meta` em um contexto que não é reconhecido como um módulo ES.

## Causa

O arquivo `eslint.config.mjs` usa `import.meta.url` e estava sendo incluído no bundle web, causando o erro.

## Soluções Aplicadas

### 1. Configuração do Metro Bundler

Atualizamos `metro.config.js` para excluir arquivos de configuração do bundle:

```javascript
config.resolver.blockList = [
  /eslint\.config\.mjs$/,
  /\.eslintrc\.js$/,
  /jest\.config\.js$/,
  // ... outros arquivos de config
];
```

### 2. Polyfill para import.meta (Web)

Adicionamos um polyfill básico em `src/polyfills.ts` para garantir compatibilidade no web.

### 3. Configuração do Expo Web

Atualizamos `app.config.js` para configurar o bundler corretamente para web.

## Como Aplicar a Correção

1. **Pare o servidor Expo** (se estiver rodando):
   ```bash
   # Pressione Ctrl+C no terminal onde o Expo está rodando
   ```

2. **Limpe o cache**:
   ```bash
   npx expo start -c
   ```

3. **Reinicie o servidor**:
   ```bash
   npm start
   ```

4. **Teste no web**:
   - Pressione `w` no terminal do Expo
   - Ou acesse `http://localhost:8082`

## Verificação

Se o erro persistir:

1. Verifique se o cache foi limpo:
   ```bash
   rm -rf .expo
   rm -rf node_modules/.cache
   npx expo start -c
   ```

2. Verifique se os arquivos de configuração não estão sendo importados no código:
   ```bash
   grep -r "eslint.config" src/
   ```

3. Se necessário, adicione mais exclusões no `metro.config.js`:
   ```javascript
   config.resolver.blockList.push(/caminho/para/arquivo/problematico/);
   ```

## Notas

- O `eslint.config.mjs` é um arquivo de configuração do ESLint e **não deve** ser incluído no bundle da aplicação
- O polyfill de `import.meta` é apenas uma medida de segurança para web
- Em produção, o Expo usa webpack que deve processar corretamente os módulos ES

## Status

✅ Correções aplicadas
✅ Metro config atualizado
✅ Polyfill adicionado
✅ Configuração web atualizada

---

**Próximo passo:** Reinicie o servidor Expo com cache limpo (`npx expo start -c`)

