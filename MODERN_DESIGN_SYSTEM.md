# 🎨 Modern Design System - Nossa Maternidade

## 📚 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Componentes](#componentes)
- [Design Tokens](#design-tokens)
- [Acessibilidade](#acessibilidade)
- [Exemplos](#exemplos)

## 🌟 Visão Geral

Um design system completo e moderno baseado em **shadcn/ui** e **Material Design 3**, otimizado para React Native com Expo. Todos os componentes são:

- ✅ **Acessíveis** (WCAG AAA compliant)
- ✅ **Animados** (micro-interações suaves)
- ✅ **Responsivos** (adaptam-se a diferentes tamanhos)
- ✅ **Theme-aware** (suporte a dark mode)
- ✅ **Type-safe** (TypeScript estrito)
- ✅ **Performáticos** (React.memo e otimizações)

## 📦 Instalação

```bash
# Instale as dependências necessárias
npm install expo-linear-gradient
```

## 🧩 Componentes

### Layout

#### Box
Container flexível com props semânticas.

```tsx
import { Box } from '@/components/primitives';

<Box p="4" rounded="lg" bg="card" shadow="md">
  <Text>Conteúdo</Text>
</Box>
```

**Props principais:**
- `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` - Padding
- `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` - Margin
- `rounded` - Border radius
- `bg` - Background color
- `shadow` - Shadow elevation

#### GradientBox
Container com gradiente linear.

```tsx
import { GradientBox, MaternalGradient } from '@/components/primitives';

<GradientBox colors={['#E91E63', '#9C27B0']} p="6" rounded="2xl">
  <Text>Com gradiente!</Text>
</GradientBox>

// Ou use presets
<MaternalGradient>
  <Text>Gradiente maternal</Text>
</MaternalGradient>
```

### Typography

#### Text
Componente de texto com variantes semânticas.

```tsx
import { Text, H1, H2, H3, P, Muted } from '@/components/primitives';

<H1>Título Principal</H1>
<H2>Subtítulo</H2>
<P>Parágrafo com espaçamento adequado.</P>
<Muted>Texto secundário</Muted>
```

**Variantes:**
- `h1`, `h2`, `h3`, `h4` - Headings
- `p` - Paragraph
- `lead` - Lead text
- `large` - Large text
- `small` - Small text
- `muted` - Muted text

### Buttons & Interactive

#### Button
Botão com múltiplas variantes e estados.

```tsx
import { Button } from '@/components/primitives';

<Button onPress={handlePress} loading={loading}>
  Primary Button
</Button>

<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

**Tamanhos:** `sm`, `md` (default), `lg`

**Estados:** `loading`, `disabled`

#### Switch
Toggle switch animado.

```tsx
import { Switch } from '@/components/primitives';

<Switch 
  value={enabled} 
  onValueChange={setEnabled}
  size="md"
/>
```

### Forms

#### Input
Campo de entrada com estados e ícones.

```tsx
import { Input } from '@/components/primitives';

<Input
  placeholder="Digite seu email..."
  value={email}
  onChangeText={setEmail}
  error={hasError}
  disabled={isDisabled}
/>
```

### Display

#### Badge
Label/tag para destaque.

```tsx
import { Badge } from '@/components/primitives';

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

#### Avatar
Imagem de perfil com fallback.

```tsx
import { Avatar, AvatarGroup } from '@/components/primitives';

<Avatar 
  uri="https://..." 
  fallbackText="JD"
  size="lg"
/>

<AvatarGroup max={3}>
  <Avatar fallbackText="A" />
  <Avatar fallbackText="B" />
  <Avatar fallbackText="C" />
  <Avatar fallbackText="D" />
</AvatarGroup>
```

#### Chip
Tag interativo/selecionável.

```tsx
import { Chip, ChipGroup } from '@/components/primitives';

<ChipGroup
  chips={[
    { id: '1', label: 'React' },
    { id: '2', label: 'TypeScript' },
  ]}
  selectedIds={selected}
  onSelectionChange={setSelected}
  multiSelect
/>
```

#### Skeleton
Placeholder de carregamento animado.

```tsx
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard 
} from '@/components/primitives';

<Skeleton height={20} width="80%" />
<SkeletonText lines={3} />
<SkeletonAvatar size={40} />
<SkeletonCard />
```

### Containers

#### Card
Container com elevação e estrutura semântica.

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/primitives';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Conteúdo principal</Text>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Navigation

#### Tabs
Navegação por abas com indicador animado.

```tsx
import { Tabs } from '@/components/primitives';

<Tabs
  tabs={[
    { id: 'home', label: 'Início', badge: '5' },
    { id: 'profile', label: 'Perfil' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
/>
```

**Variantes:** `default`, `pills`, `underline`

### Feedback

#### Progress
Barra de progresso animada.

```tsx
import { Progress, CircularProgress } from '@/components/primitives';

<Progress value={65} variant="success" showLabel />

<CircularProgress value={75} size={80} />
```

#### Toast
Sistema de notificações.

```tsx
import { ToastProvider, useToast } from '@/components/primitives';

// No root do app
<ToastProvider>
  <App />
</ToastProvider>

// Em componentes
const { addToast } = useToast();

addToast({
  title: 'Sucesso!',
  description: 'Operação concluída.',
  variant: 'success',
  duration: 3000,
  action: {
    label: 'Desfazer',
    onPress: handleUndo,
  },
});
```

#### Accordion
Seções expansíveis.

```tsx
import { Accordion } from '@/components/primitives';

<Accordion
  items={[
    {
      id: '1',
      title: 'Pergunta 1',
      content: 'Resposta detalhada...',
    },
  ]}
  type="single"
  variant="separated"
/>
```

### Overlays

#### Dialog
Modal centralizado.

```tsx
import { Dialog, AlertDialog } from '@/components/primitives';

<Dialog
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Título"
  description="Descrição"
  footer={
    <>
      <Button variant="outline" onPress={handleCancel}>
        Cancelar
      </Button>
      <Button onPress={handleConfirm}>
        Confirmar
      </Button>
    </>
  }
>
  <Text>Conteúdo do dialog</Text>
</Dialog>
```

#### Sheet
Bottom sheet/drawer.

```tsx
import { Sheet } from '@/components/primitives';

<Sheet
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Bottom Sheet"
  snapPoints={[50, 90]}
>
  <Text>Conteúdo deslizante</Text>
</Sheet>
```

### Utilities

#### Separator
Divisor visual.

```tsx
import { Separator } from '@/components/primitives';

<Separator />
<Separator orientation="vertical" />
<Separator label="OU" />
<Separator variant="dashed" />
```

## 🎨 Design Tokens

### Cores

O sistema usa HSL (Hue, Saturation, Lightness) para melhor controle e suporte a temas.

```typescript
import { ModernTokens } from '@/theme/modernTokens';

// Light theme
const colors = ModernTokens.colors.light;
colors.background // '#FFFFFF'
colors.foreground // '#09090B'
colors.primary // '#E91E63' (Rosa Magenta)
colors.maternal.pink // '#E91E63'
colors.maternal.purple // '#9C27B0'

// Dark theme
const darkColors = ModernTokens.colors.dark;
```

### Espaçamento

Sistema baseado em múltiplos de 4px.

```typescript
ModernTokens.spacing['0'] // 0
ModernTokens.spacing['1'] // 4px
ModernTokens.spacing['2'] // 8px
ModernTokens.spacing['4'] // 16px
ModernTokens.spacing['8'] // 32px
```

### Tipografia

```typescript
ModernTokens.typography.fontSize.xs // 12
ModernTokens.typography.fontSize.sm // 14
ModernTokens.typography.fontSize.base // 16
ModernTokens.typography.fontSize.lg // 18
ModernTokens.typography.fontSize.xl // 20

ModernTokens.typography.fontWeight.normal // '400'
ModernTokens.typography.fontWeight.medium // '500'
ModernTokens.typography.fontWeight.semibold // '600'
ModernTokens.typography.fontWeight.bold // '700'
```

### Border Radius

```typescript
ModernTokens.radius.sm // 4
ModernTokens.radius.md // 8
ModernTokens.radius.lg // 12
ModernTokens.radius.xl // 16
ModernTokens.radius['2xl'] // 20
ModernTokens.radius.full // 9999
```

### Shadows

```typescript
ModernTokens.shadows.sm
ModernTokens.shadows.md
ModernTokens.shadows.lg
ModernTokens.shadows.xl
```

## ♿ Acessibilidade

### Validação de Contraste

```typescript
import { meetsWCAGStandard } from '@/utils/accessibility';

const result = meetsWCAGStandard(
  '#E91E63', // foreground
  '#FFFFFF', // background
  'AAA',     // level
  'normal'   // size
);

console.log(result.passes); // true/false
console.log(result.ratio);  // 7.2:1
```

### Touch Targets

Todos os componentes interativos têm **mínimo 44pt** (iOS) / **48dp** (Android).

```typescript
import { validateTouchTarget } from '@/utils/accessibility';

const result = validateTouchTarget(40, 40, 'ios');
console.log(result.passes); // false (< 44pt)
```

### Labels de Acessibilidade

Todos os componentes suportam `accessibilityLabel` e `accessibilityHint`.

```tsx
<Button 
  accessibilityLabel="Salvar alterações"
  accessibilityHint="Salva o formulário e retorna para a tela anterior"
>
  Salvar
</Button>
```

## 🎯 Exemplos Completos

### Formulário de Login

```tsx
import { Box, Card, CardContent, Input, Button, Text } from '@/components/primitives';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Card>
      <CardContent>
        <Box gap="4">
          <Text variant="h3">Login</Text>
          
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Button 
            onPress={handleLogin}
            loading={loading}
            fullWidth
          >
            Entrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
```

### Card de Perfil

```tsx
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Avatar, 
  Box, 
  Text, 
  Badge 
} from '@/components/primitives';

const ProfileCard = ({ user }) => (
  <Card variant="elevated">
    <CardHeader>
      <Box direction="row" align="center" gap="3">
        <Avatar 
          uri={user.avatar}
          fallbackText={user.name}
          size="lg"
        />
        <Box flex={1}>
          <Text variant="h4">{user.name}</Text>
          <Text size="sm" color="muted">{user.email}</Text>
        </Box>
        <Badge variant="success">Ativo</Badge>
      </Box>
    </CardHeader>
    <CardContent>
      <Text>{user.bio}</Text>
    </CardContent>
  </Card>
);
```

## 🚀 Performance

### Otimizações

- Todos os componentes usam `React.memo` para evitar re-renders desnecessários
- Animações usam `useNativeDriver` quando possível
- Estilos são memoizados com `useMemo`
- Callbacks são estáveis com `useCallback`

### Best Practices

```tsx
// ✅ BOM: Props estáveis
const [value, setValue] = useState('');
<Input value={value} onChangeText={setValue} />

// ❌ RUIM: Inline functions criam nova referência a cada render
<Input onChangeText={(text) => setState({ ...state, text })} />

// ✅ BOM: Callback memoizado
const handleChange = useCallback((text) => {
  setState(prev => ({ ...prev, text }));
}, []);
<Input onChangeText={handleChange} />
```

## 📖 Referências

- [shadcn/ui](https://ui.shadcn.com/) - Inspiração do design
- [Material Design 3](https://m3.material.io/) - Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Acessibilidade
- [React Native](https://reactnative.dev/) - Framework

## 🤝 Contribuindo

Para adicionar novos componentes, siga a estrutura:

1. Crie o componente em `/src/components/primitives/`
2. Use `ModernTokens` para valores de design
3. Adicione props de acessibilidade
4. Escreva testes
5. Documente no README
6. Exporte em `index.ts`

---

**Versão:** 3.0.0  
**Data:** Dezembro 2025  
**Licença:** MIT
