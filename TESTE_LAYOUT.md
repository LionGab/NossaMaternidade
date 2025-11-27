# 🎨 Ambiente de Testes - Visualização de Layout

## Como Iniciar o Ambiente de Desenvolvimento

### 1. Iniciar o Servidor Expo

```bash
npm start
```

Isso abrirá o Expo Dev Server no navegador.

### 2. Executar no Dispositivo/Simulador

Escolha uma das opções:

#### iOS (Simulador ou Dispositivo Físico)
```bash
npm run ios
```

#### Android (Emulador ou Dispositivo Físico)
```bash
npm run android
```

#### Web (Visualização Rápida no Navegador)
```bash
npm run web
```

### 3. Acessar a Tela de Design System

Após o app carregar:

1. **Faça login** (ou pule o login se estiver em modo de desenvolvimento)
2. **Navegue para Configurações** (ícone de engrenagem ou menu)
3. **Clique em "Design System"** na seção "Sistema"
4. **Explore todos os componentes!**

A tela de Design System inclui:
- ✨ Typography (H1, H2, H3, Body, Caption)
- 📦 Cards (Default, Outlined, Elevated, Pressable)
- 📝 Form Components (Input, Checkbox, Radio, Switch)
- 🏷️ Badges e Chips
- ⚠️ Alerts e Toasts
- 💀 Skeleton Loading
- 🎨 Color Palette

## Atalho Direto

Se você quiser acessar diretamente sem navegar:

Edite temporariamente `src/navigation/StackNavigator.tsx`:

```typescript
// Mudar:
initialRouteName={getInitialRouteName()}

// Para:
initialRouteName="DesignSystem"
```

Depois reverta essa mudança quando terminar os testes.

## Alternativa: Tab Temporária

Se preferir uma tab sempre visível durante desenvolvimento, edite `src/navigation/TabNavigator.tsx` e adicione:

```typescript
import DesignSystemScreen from '../screens/DesignSystemScreen';
import { Palette } from 'lucide-react-native';

// Adicionar antes de </Tab.Navigator>:
<Tab.Screen
  name="DesignSystem"
  component={DesignSystemScreen}
  options={{
    tabBarLabel: '🎨 Design',
    tabBarIcon: ({ color, focused }) => (
      <Palette size={focused ? 28 : 24} color={color} />
    ),
  }}
/>
```

**Lembre-se de remover quando terminar os testes!**

## Testar Alterações em Tempo Real

O Expo oferece **Hot Reload** automático:
- Salve qualquer arquivo `.tsx` ou `.ts`
- O app recarrega automaticamente
- Teste suas mudanças instantaneamente!

## Alternar Dark/Light Mode

Na tela de Design System, use o **Switch no topo** para alternar entre os modos claro e escuro e visualizar como os componentes se comportam em cada tema.

## Dicas

1. **Shake do dispositivo** ou **Cmd+D (iOS) / Cmd+M (Android)** para abrir o menu de desenvolvedor
2. Use **Cmd+R** para recarregar manualmente
3. Console logs aparecem no terminal onde você executou `npm start`
4. Erros de TypeScript aparecem no terminal e no app

## Resolver Problemas

Se encontrar erros:

```bash
# Limpar cache
npm start -- --clear

# Reinstalar dependências
rm -rf node_modules
npm install
```

---

**Criado automaticamente por Claude Code**
