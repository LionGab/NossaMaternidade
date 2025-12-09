/**
 * Complete Modern Design System Showcase
 * Uma demonstração completa de todos os componentes e funcionalidades
 * 
 * @version 3.0.0
 */

import { useState } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { ToastProvider, useToast } from '@/components/primitives/Toast';

import {
  Box,
  Text,
  H1,
  P,
  Muted,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Badge,
  Avatar,
  AvatarGroup,
  Skeleton,
  Switch,
  Tabs,
  Progress,
  Separator,
  GradientBox,
  MaternalGradient,
  Sheet,
  Dialog,
  AlertDialog,
  Accordion,
  ChipGroup,
} from '@/components/primitives';

const ShowcaseContent = () => {
  const { addToast } = useToast();
  
  // States
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [progress, setProgress] = useState(65);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>(['chip1']);

  const handleButtonPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({
        title: 'Sucesso! ✨',
        description: 'A ação foi concluída com sucesso.',
        variant: 'success',
        duration: 3000,
      });
    }, 2000);
  };

  const tabs = [
    { id: 'home', label: 'Início', badge: '5' },
    { id: 'explore', label: 'Explorar' },
    { id: 'favorites', label: 'Favoritos' },
    { id: 'profile', label: 'Perfil' },
  ];

  const accordionItems = [
    {
      id: '1',
      title: 'O que é o design system?',
      content: 'Um conjunto completo de componentes reutilizáveis, padrões de design e diretrizes para criar interfaces consistentes e acessíveis.',
    },
    {
      id: '2',
      title: 'Como usar os componentes?',
      content: 'Importe os componentes necessários e utilize as props documentadas para personalizar aparência e comportamento.',
    },
    {
      id: '3',
      title: 'Suporta dark mode?',
      content: 'Sim! Todos os componentes se adaptam automaticamente ao tema claro ou escuro do sistema.',
    },
  ];

  const chips = [
    { id: 'chip1', label: 'React Native' },
    { id: 'chip2', label: 'TypeScript' },
    { id: 'chip3', label: 'Expo' },
    { id: 'chip4', label: 'Design System' },
  ];

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ 
        padding: ModernTokens.spacing['4'],
        gap: ModernTokens.spacing['6'],
      }}
    >
      {/* Hero Section with Gradient */}
      <MaternalGradient
        style={{
          borderRadius: ModernTokens.radius['2xl'],
          padding: ModernTokens.spacing['6'],
        }}
      >
        <H1 style={{ color: '#FFF' }}>Design System Moderno</H1>
        <P style={{ color: 'rgba(255,255,255,0.9)', marginTop: ModernTokens.spacing['2'] }}>
          Componentes poderosos e acessíveis para criar experiências incríveis
        </P>
        <Box direction="row" gap="2" mt="4">
          <Badge variant="secondary">v3.0</Badge>
          <Badge variant="outline" style={{ borderColor: '#FFF' }}>
            <Text style={{ color: '#FFF' }}>React Native</Text>
          </Badge>
        </Box>
      </MaternalGradient>

      {/* Interactive Demo Card */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Componentes Interativos</CardTitle>
          <CardDescription>
            Experimente os controles e veja as animações suaves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Box gap="4">
            {/* Buttons */}
            <Box>
              <Muted style={{ marginBottom: ModernTokens.spacing['2'] }}>Buttons</Muted>
              <Box direction="row" flexWrap="wrap" gap="2">
                <Button onPress={handleButtonPress} loading={loading}>
                  Primary
                </Button>
                <Button variant="secondary" onPress={() => addToast({ title: 'Secondary!' })}>
                  Secondary
                </Button>
                <Button variant="outline" onPress={() => addToast({ title: 'Outline!' })}>
                  Outline
                </Button>
                <Button variant="ghost" onPress={() => addToast({ title: 'Ghost!' })}>
                  Ghost
                </Button>
              </Box>
            </Box>

            <Separator />

            {/* Input */}
            <Box>
              <Muted style={{ marginBottom: ModernTokens.spacing['2'] }}>Input</Muted>
              <Input
                placeholder="Digite algo mágico..."
                value={text}
                onChangeText={setText}
              />
            </Box>

            {/* Switch */}
            <Box direction="row" align="center" justify="space-between">
              <Box>
                <Text weight="semibold">Notificações</Text>
                <Muted>Receba atualizações importantes</Muted>
              </Box>
              <Switch value={switchValue} onValueChange={setSwitchValue} />
            </Box>

            {/* Progress */}
            <Box>
              <Box direction="row" justify="space-between" mb="2">
                <Muted>Progresso</Muted>
                <Muted>{progress}%</Muted>
              </Box>
              <Progress value={progress} />
              <Box direction="row" gap="2" mt="2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onPress={() => setProgress(prev => Math.max(0, prev - 10))}
                >
                  -10%
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onPress={() => setProgress(prev => Math.min(100, prev + 10))}
                >
                  +10%
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Navegação por Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />
          <Box mt="4" p="4" bg="muted" rounded="lg">
            <Text>Conteúdo da aba: <Text weight="bold">{activeTab}</Text></Text>
          </Box>
        </CardContent>
      </Card>

      {/* Chips */}
      <Card>
        <CardHeader>
          <CardTitle>Chips Selecionáveis</CardTitle>
          <CardDescription>Selecione múltiplas tecnologias</CardDescription>
        </CardHeader>
        <CardContent>
          <ChipGroup
            chips={chips}
            selectedIds={selectedChips}
            onSelectionChange={setSelectedChips}
            multiSelect
          />
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card>
        <CardHeader>
          <CardTitle>Avatares e Grupos</CardTitle>
        </CardHeader>
        <CardContent>
          <Box gap="4">
            <Box direction="row" align="center" gap="3">
              <Avatar size="sm" fallbackText="SM" />
              <Avatar size="md" fallbackText="MD" />
              <Avatar size="lg" fallbackText="LG" />
              <Avatar size="xl" fallbackText="XL" />
            </Box>
            
            <Separator />
            
            <Box>
              <Muted style={{ marginBottom: ModernTokens.spacing['2'] }}>
                Avatar Group (max 3)
              </Muted>
              <AvatarGroup max={3} size="md">
                <Avatar fallbackText="Ana" />
                <Avatar fallbackText="Bruno" />
                <Avatar fallbackText="Carlos" />
                <Avatar fallbackText="Diana" />
                <Avatar fallbackText="Eduardo" />
              </AvatarGroup>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ - Accordion</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            items={accordionItems}
            type="single"
            variant="separated"
          />
        </CardContent>
      </Card>

      {/* Overlays Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Modais e Overlays</CardTitle>
          <CardDescription>Sheet, Dialog e Alert Dialog</CardDescription>
        </CardHeader>
        <CardContent>
          <Box gap="2">
            <Button variant="outline" onPress={() => setSheetOpen(true)}>
              Abrir Bottom Sheet
            </Button>
            <Button variant="outline" onPress={() => setDialogOpen(true)}>
              Abrir Dialog
            </Button>
            <Button variant="destructive" onPress={() => setAlertOpen(true)}>
              Abrir Alert
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Estados de Carregamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Box gap="3">
            <Skeleton height={20} />
            <Skeleton height={40} width="80%" />
            <Skeleton height={60} width="60%" />
            <Skeleton circle height={60} />
          </Box>
        </CardContent>
      </Card>

      {/* Gradient Examples */}
      <Box gap="3">
        <Text variant="h3">Gradientes</Text>
        
        <GradientBox
          preset="primary"
          p="6"
          rounded="2xl"
        >
          <Text style={{ color: '#FFF' }} weight="semibold">
            Gradiente Maternal
          </Text>
        </GradientBox>

        <GradientBox
          preset="sunset"
          p="6"
          rounded="2xl"
        >
          <Text style={{ color: '#FFF' }} weight="semibold">
            Gradiente Sunset
          </Text>
        </GradientBox>

        <GradientBox
          preset="success"
          p="6"
          rounded="2xl"
        >
          <Text style={{ color: '#FFF' }} weight="semibold">
            Gradiente Success
          </Text>
        </GradientBox>
      </Box>

      {/* Bottom spacing */}
      <Box height={40} />

      {/* Overlays */}
      <Sheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Bottom Sheet"
        description="Um drawer que desliza de baixo para cima"
      >
        <Box gap="4">
          <P>
            Este é um componente Sheet que pode conter qualquer conteúdo.
            Arraste para baixo para fechar ou toque fora do sheet.
          </P>
          <Button onPress={() => setSheetOpen(false)}>
            Fechar
          </Button>
        </Box>
      </Sheet>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Dialog Exemplo"
        description="Um modal centralizado para conteúdo importante"
        footer={
          <>
            <Button variant="outline" onPress={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onPress={() => {
              setDialogOpen(false);
              addToast({ title: 'Ação confirmada!', variant: 'success' });
            }}>
              Confirmar
            </Button>
          </>
        }
      >
        <P>
          Este é o conteúdo do dialog. Você pode adicionar formulários,
          listas ou qualquer outro componente aqui.
        </P>
      </Dialog>

      <AlertDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Atenção!"
        description="Esta é uma ação destrutiva. Tem certeza que deseja continuar?"
        variant="destructive"
        onConfirm={() => {
          addToast({
            title: 'Ação destrutiva executada',
            variant: 'error',
          });
        }}
      />
    </ScrollView>
  );
};

export const CompleteModernShowcase = () => (
  <ToastProvider>
    <SafeAreaView style={{ flex: 1 }}>
      <ShowcaseContent />
    </SafeAreaView>
  </ToastProvider>
);

export default CompleteModernShowcase;
