/**
 * Primitive Components - Exports
 * Design System primitives para Nossa Maternidade
 */

// =====================
// 📝 Typography
// =====================
export { Heading, H1, H2, H3, H4, H5, H6 } from './Heading';
export type { HeadingProps, HeadingLevel } from './Heading';

export { Text, Body, Caption, Label, Overline, Small } from './Text';
export type { CustomTextProps, TextVariant, TextSize, TextColor } from './Text';

export { Link } from './Link';
export type { LinkProps } from './Link';

// =====================
// 📐 Layout
// =====================
export { Container } from './Container';
export type { ContainerProps } from './Container';

export { Stack } from './Stack';
export type { StackProps } from './Stack';

export { Row } from './Row';
export type { RowProps } from './Row';

export { Box } from './Box';
export type { BoxProps } from './Box';

// =====================
// 🔘 Interactive
// =====================
export { HapticButton } from './HapticButton';
export type {
  HapticButtonProps,
  HapticButtonVariant,
  HapticButtonSize,
} from './HapticButton';

export { IconButton } from './IconButton';
export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
} from './IconButton';

export { Pressable } from './Pressable';
export type { PressableProps } from './Pressable';

export { Divider } from './Divider';
export type {
  DividerProps,
  DividerOrientation,
  DividerVariant,
} from './Divider';

// =====================
// 🛡️ Safe Areas & Wrappers
// =====================
export {
  SafeAreaWrapper,
  ScreenWrapper,
  ModalWrapper,
  useSafeInsets,
} from './SafeAreaWrapper';
export type { SafeAreaWrapperProps } from './SafeAreaWrapper';

export {
  KeyboardAvoidingWrapper,
  FormWrapper,
  ChatWrapper,
} from './KeyboardAvoidingWrapper';
export type { KeyboardAvoidingWrapperProps } from './KeyboardAvoidingWrapper';

// =====================
// 🎨 Cards & Containers
// =====================
export { EmotionalCard } from './EmotionalCard';
export type { EmotionalCardProps, EmotionalVariant } from './EmotionalCard';

// =====================
// 📊 Progress & Feedback
// =====================
export {
  ProgressIndicator,
  StepProgress,
} from './ProgressIndicator';
export type {
  ProgressIndicatorProps,
  ProgressType,
  ProgressSize,
} from './ProgressIndicator';
