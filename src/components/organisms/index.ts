/**
 * Organisms Index
 * 
 * Exporta todos os componentes organism do design system.
 * Inspirado no Lofee - Health Woman UI Kit.
 * 
 * @see https://www.figma.com/design/fqH3Ro3Ll8sL2s3EJuW22H/Lofee---Woman-Health-UI-Mobile-Design-Kit
 */

// Period & Cycle
export { PeriodCard, type PeriodCardProps } from './PeriodCard';

// Mood Tracking
export { 
  MoodSelector, 
  MOOD_OPTIONS,
  type MoodSelectorProps, 
  type MoodType, 
  type MoodOption 
} from './MoodSelector';

// Calendar
export { 
  CalendarStrip, 
  type CalendarStripProps, 
  type CalendarDay, 
  type DayType 
} from './CalendarStrip';

// Content & Articles
export { 
  ArticleCard, 
  type ArticleCardProps, 
  type ArticleCategory 
} from './ArticleCard';

// Notifications
export { 
  NotificationItem, 
  type NotificationItemProps, 
  type NotificationType 
} from './NotificationItem';

// Existing exports (if any)
export * from './MaternalCard';
