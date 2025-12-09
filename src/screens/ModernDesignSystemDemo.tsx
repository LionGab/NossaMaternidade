/**
 * Modern Design System Demo Screen
 * Demonstra todos os componentes do novo design system
 * 
 * @version 3.0.0
 */

import React, { useState } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';

import {
  Box,
  H1,
  H2,
  H3,
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
  SkeletonCard,
} from '@/components/primitives';

export const ModernDesignSystemDemo = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: ModernTokens.spacing['4'],
          gap: ModernTokens.spacing['6'],
        }}
      >
        {/* Typography Section */}
        <Box>
          <H1>Modern Design System</H1>
          <Muted>Baseado em shadcn/ui + Material Design 3</Muted>
        </Box>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Diferentes variantes e tamanhos de botões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Box gap="3">
              <Button onPress={handlePress} loading={loading}>
                Primary Button
              </Button>
              
              <Button variant="secondary" onPress={handlePress}>
                Secondary Button
              </Button>
              
              <Button variant="outline" onPress={handlePress}>
                Outline Button
              </Button>
              
              <Button variant="ghost" onPress={handlePress}>
                Ghost Button
              </Button>
              
              <Button variant="destructive" onPress={handlePress}>
                Destructive Button
              </Button>

              <Box direction="row" gap="2">
                <Button size="sm" onPress={handlePress}>
                  Small
                </Button>
                <Button size="default" onPress={handlePress}>
                  Default
                </Button>
                <Button size="lg" onPress={handlePress}>
                  Large
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Campo de entrada com estados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Box gap="3">
              <Input
                placeholder="Digite seu nome..."
                value={text}
                onChangeText={setText}
              />
              
              <Input
                placeholder="Input desabilitado"
                disabled
              />
              
              <Input
                placeholder="Input com erro"
                error
              />
            </Box>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>
              Labels e tags para destaque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Box direction="row" flexWrap="wrap" gap="2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </Box>
          </CardContent>
        </Card>

        {/* Avatars Section */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>
              Imagens de perfil e grupos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Box gap="4">
              <Box direction="row" align="center" gap="3">
                <Avatar 
                  size="sm" 
                  fallbackText="SM" 
                />
                <Avatar 
                  size="md" 
                  fallbackText="MD" 
                />
                <Avatar 
                  size="lg" 
                  fallbackText="LG" 
                />
                <Avatar 
                  size="xl" 
                  fallbackText="XL" 
                />
              </Box>

              <Box>
                <Muted>Avatar Group</Muted>
                <AvatarGroup max={3} size="md">
                  <Avatar fallbackText="AB" />
                  <Avatar fallbackText="CD" />
                  <Avatar fallbackText="EF" />
                  <Avatar fallbackText="GH" />
                  <Avatar fallbackText="IJ" />
                </AvatarGroup>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Skeletons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Skeletons</CardTitle>
            <CardDescription>
              Placeholders de carregamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Box gap="3">
              <Skeleton height={20} />
              <Skeleton height={40} />
              <Skeleton height={60} width="50%" />
              <Skeleton circle height={60} />
            </Box>
          </CardContent>
        </Card>

        {/* Skeleton Card Example */}
        <SkeletonCard />

        {/* Cards Variants */}
        <Box gap="3">
          <Card variant="default">
            <H3>Default Card</H3>
            <P>Com shadow padrão</P>
          </Card>

          <Card variant="elevated">
            <H3>Elevated Card</H3>
            <P>Com shadow elevada</P>
          </Card>

          <Card variant="outline">
            <H3>Outline Card</H3>
            <P>Com borda</P>
          </Card>
        </Box>

        {/* Typography Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent>
            <Box gap="2">
              <H1>Heading 1</H1>
              <H2>Heading 2</H2>
              <H3>Heading 3</H3>
              <P>Paragraph text with proper line height and spacing for comfortable reading.</P>
              <Muted>Muted text for secondary information</Muted>
            </Box>
          </CardContent>
        </Card>

        {/* Spacing at bottom */}
        <Box height={40} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModernDesignSystemDemo;
