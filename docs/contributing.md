# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **Nossa Maternidade**! Este documento fornece diretrizes para contribuições.

## 📋 Como Contribuir

### 1. Reportar Bugs

Se encontrar um bug:

1. **Verifique** se já não foi reportado nas Issues
2. **Crie uma nova Issue** com:
   - Título claro e descritivo
   - Descrição do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)
   - Ambiente (iOS/Android/Web, versão)

### 2. Sugerir Funcionalidades

Para sugerir uma nova funcionalidade:

1. **Verifique** se já não foi sugerida
2. **Crie uma Issue** com:
   - Título descritivo
   - Descrição detalhada da funcionalidade
   - Casos de uso
   - Benefícios para as usuárias

### 3. Contribuir com Código

#### Setup do Ambiente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/nossa-maternidade.git
   cd nossa-maternidade
   ```

2. **Instale dependências**
   ```bash
   # Web
   npm install
   
   # Mobile
   npm install --package-lock-only
   npm install
   ```

3. **Configure variáveis de ambiente**
   - Crie `.env` com `API_KEY` do Gemini (se necessário)

4. **Execute o projeto**
   ```bash
   # Web
   npm run dev
   
   # Mobile
   npm run ios  # ou npm run android
   ```

#### Processo de Desenvolvimento

1. **Crie uma branch**
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Desenvolva seguindo os padrões** (veja seção abaixo)

3. **Teste suas mudanças**
   - Execute testes: `npm test`
   - Teste manualmente em iOS e Android
   - Verifique linter: `npm run lint` (se configurado)

4. **Commit suas mudanças**
   ```bash
   git add .
   git commit -m "feat: adiciona funcionalidade X"
   ```

5. **Push e crie Pull Request**
   ```bash
   git push origin feature/nome-da-feature
   ```

## 📝 Padrões de Código

### TypeScript

- **Sempre use TypeScript** (não JavaScript)
- **Defina tipos** para props, estados e funções
- **Evite `any`** - use `unknown` se necessário

```typescript
// ✅ Bom
interface UserProps {
  name: string;
  age: number;
}

// ❌ Ruim
const props: any = { name: 'João', age: 30 };
```

### Nomenclatura

- **Componentes**: PascalCase (`HomeView`, `NathIAView`)
- **Arquivos**: Mesmo nome do componente
- **Hooks**: camelCase começando com `use` (`useAppState`, `useTheme`)
- **Funções**: camelCase (`handleSendMessage`, `createPost`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Tipos/Interfaces**: PascalCase (`User`, `Message`)

### Estrutura de Componentes

```typescript
// 1. Imports
import React from 'react';
import { View } from 'react-native';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Componente
export const MyComponent: React.FC<Props> = ({ title }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 7. Render
  return <View>{title}</View>;
};
```

### Comentários

- **Comente o "porquê"**, não o "o quê"
- **Use JSDoc** para funções públicas
- **Mantenha comentários atualizados**

```typescript
/**
 * Envia mensagem para NathIA e salva no histórico
 * @param message - Texto da mensagem do usuário
 * @param conversationId - ID da conversa (opcional, cria nova se não fornecido)
 * @returns Promise com resposta da IA
 */
async function sendMessage(message: string, conversationId?: string): Promise<Message> {
  // ...
}
```

### Mobile vs Web

- **Web**: Arquivos `.tsx` (ex: `HomeView.tsx`)
- **Mobile**: Arquivos `.native.tsx` (ex: `HomeView.native.tsx`)
- **Compartilhado**: Utilitários, services, hooks (sem extensão `.native`)

### Performance

- **Use React.memo** para componentes pesados
- **Use useMemo/useCallback** para cálculos e funções caras
- **Use FlatList** ao invés de ScrollView para listas
- **Lazy load** de componentes pesados

```typescript
// ✅ Bom
const MemoizedComponent = React.memo(ExpensiveComponent);

// ✅ Bom
const expensiveValue = useMemo(() => computeValue(data), [data]);

// ❌ Ruim
<ScrollView>
  {items.map(item => <Item key={item.id} />)}
</ScrollView>
```

### Tratamento de Erros

- **Sempre trate erros** em funções assíncronas
- **Use Error Boundaries** para erros de renderização
- **Use errorTracker** para tracking em produção

```typescript
// ✅ Bom
try {
  const result = await apiCall();
} catch (error) {
  errorTracker.captureError(error, { context: 'apiCall' });
  // Mostrar mensagem amigável ao usuário
}
```

## 🔍 Processo de Pull Request

### Checklist Antes de Submeter

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (`npm test`)
- [ ] Testado em iOS e Android (se aplicável)
- [ ] Sem erros de linter
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem convenção (veja abaixo)

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
Passos para testar as mudanças

## Screenshots (se aplicável)
Adicione screenshots aqui

## Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Sem breaking changes (ou documentados)
```

### Review Process

1. **Pelo menos 1 aprovação** necessária
2. **Todos os testes** devem passar
3. **Sem conflitos** com a branch principal
4. **Code review** focado em:
   - Qualidade do código
   - Performance
   - Segurança
   - UX

## 📦 Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

### Exemplos

```bash
feat(chat): adiciona modo de reflexão na NathIA
fix(auth): corrige logout não limpando storage
docs(readme): atualiza instruções de setup mobile
refactor(components): extrai lógica de posts para hook
```

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Escrever Testes

- **Teste comportamento**, não implementação
- **Use React Native Testing Library**
- **Mock dependências externas** (API, storage)

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from './MyComponent';

test('deve exibir título corretamente', () => {
  const { getByText } = render(<MyComponent title="Teste" />);
  expect(getByText('Teste')).toBeTruthy();
});
```

## 🐛 Debugging

### Web

- Use React DevTools
- Console do navegador
- Network tab para requisições

### Mobile

- React Native Debugger
- Flipper (se configurado)
- Logs do dispositivo

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Dúvidas?

Abra uma Issue com a tag `question` ou entre em contato com os mantenedores.

---

**Obrigado por contribuir! ❤️**

