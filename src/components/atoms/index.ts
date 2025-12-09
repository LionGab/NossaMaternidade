/**
 * Atoms - Componentes Primitivos
 * Exportações centralizadas de todos os componentes atômicos
 */

// Layout Components
export { Box, type BoxProps } from './Box';
export { Stack, type StackProps } from './Stack';
export { Row, type RowProps } from './Row';
export { Container, type ContainerProps } from './Container';
export { SafeView, SafeText, type SafeViewProps } from './SafeView';
export { SafeAreaWrapper, type SafeAreaWrapperProps } from './SafeAreaWrapper';
export { KeyboardAvoidingWrapper, type KeyboardAvoidingWrapperProps } from './KeyboardAvoidingWrapper';

// Typography Components
export { Text, Body, Caption, Label, Overline, type CustomTextProps, type TextVariant, type TextSize, type TextColor } from './Text';
export { H1, H2, H3, type HeadingProps } from './Heading';

// Button Components
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { HapticButton, type HapticButtonProps } from './HapticButton';
export { IconButton, type IconButtonProps } from './IconButton';
export { PillButton, type PillButtonProps } from './PillButton';
export { Pressable, type PressableProps } from './Pressable';
export { TouchableArea, type TouchableAreaProps } from './TouchableArea';

// Card Components
export { Card, type CardProps, type CardVariant, type CardPadding } from './Card';
export { EmotionalCard, type EmotionalCardProps } from './EmotionalCard';

// Form Components
export { Divider, type DividerProps } from './Divider';
export { SearchBarPill, type SearchBarPillProps } from './SearchBarPill';

// Image Components
export { OptimizedImage, type ImagePriority, type ImageCachePolicy } from './OptimizedImage';

// List Components
export { OptimizedFlatList, type OptimizedFlatListProps } from './OptimizedFlatList';

// Link Components
export { Link, type LinkProps } from './Link';

// Progress Components
export { ProgressBar, type ProgressBarProps } from './ProgressBar';
export { ProgressIndicator, type ProgressIndicatorProps } from './ProgressIndicator';
export { ProgressRing, type ProgressRingProps } from './ProgressRing';

// Chat Components
export { ChatBubble, type ChatBubbleProps } from './ChatBubble';

// Other Components
export { Skeleton, type SkeletonProps } from './Skeleton';
export { Streak, type StreakProps } from './Streak';
