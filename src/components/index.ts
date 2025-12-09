// Core Components
// ✅ Usando versões de atoms/ quando disponível (mais modernas e completas)
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './atoms/Button';
export { Card, type CardProps, type CardVariant, type CardPadding } from './atoms/Card';
export { ProgressIndicator, type ProgressIndicatorProps } from './atoms/ProgressIndicator';
export { OptimizedImage, type ImagePriority, type ImageCachePolicy } from './atoms/OptimizedImage';

// Componentes que não têm versão em atoms/ - manter na raiz
export { Input, type InputProps } from './Input';
export { Modal, type ModalProps } from './Modal';
export { Loading, type LoadingProps } from './Loading';
export { Avatar, type AvatarProps } from './Avatar';
export { Logo, type LogoProps } from './Logo';
export { CommentItem } from './CommentItem';
export { CommentsSection } from './CommentsSection';
export { ContentCard } from './ContentCard';
export { AudioPlayer } from './AudioPlayer';
export { ErrorBoundary } from './ErrorBoundary';

// Form Components
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from './Radio';
export { Switch, type SwitchProps } from './Switch';

// Feedback Components
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './Badge';
export { Chip, type ChipProps, type ChipVariant, type ChipSize } from './Chip';
export { Alert, type AlertProps, type AlertVariant } from './Alert';
export { ToastProvider, useToast, type ToastOptions, type ToastVariant } from './Toast';
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  type SkeletonProps,
  type SkeletonVariant,
} from './Skeleton';

// State Components
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { ErrorState, type ErrorStateProps, type ErrorType } from './ErrorState';

// GeminiApp-Inspired Components (New Design System)
export { HeroHeader, type HeroHeaderProps } from './HeroHeader';
export { GlassCard, type GlassCardProps, type GlassVariant } from './GlassCard';
// ⚠️ MoodSelector foi movido para @/components/features/home/MoodSelector
// Use: import { MoodSelector } from '@/components/features/home';
export { AIModePicker, type AIModePickerProps, type AIMode, AI_MODE_OPTIONS } from './AIModePicker';
export {
  FloatingTabBar,
  type FloatingTabBarProps,
  type TabName,
  TAB_CONFIG,
} from './FloatingTabBar';
export { BabyTrackerCard, type BabyTrackerCardProps } from './BabyTrackerCard';

// ⭐ Cotton Candy Tech Blue Version Components
export { CottonCandyCard, type CottonCandyCardProps } from './CottonCandyCard';
export { CottonCandyButton, type CottonCandyButtonProps } from './CottonCandyButton';

// Atomic Components - Re-exportar de atoms/ para facilitar imports
export * from './atoms';
