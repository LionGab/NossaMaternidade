/**
 * Validation Schemas - Nossa Maternidade
 * Schemas Zod para validação de formulários e inputs
 * @version 1.0.0
 */

import { z } from 'zod';

// ======================
// 🔐 LOGIN
// ======================

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ======================
// 👤 PERFIL
// ======================

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (00) 00000-0000')
    .optional()
    .or(z.literal('')),
  pregnancyWeek: z
    .number()
    .min(1, 'Semana deve ser entre 1 e 42')
    .max(42, 'Semana deve ser entre 1 e 42')
    .optional()
    .nullable(),
  babyBirthDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato: DD/MM/AAAA')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ======================
// 🎯 ONBOARDING
// ======================

export const onboardingNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome muito longo')
    .trim(),
});

export type OnboardingNameFormData = z.infer<typeof onboardingNameSchema>;

// ======================
// 💬 CHAT
// ======================

export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(2000, 'Mensagem muito longa (máximo 2000 caracteres)')
    .trim(),
});

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;

// ======================
// 💛 EMOÇÕES
// ======================

export const emotionValues = ['bem', 'calma', 'cansada', 'triste', 'ansiosa'] as const;
export type EmotionValueSchema = (typeof emotionValues)[number];

export const emotionCheckInSchema = z.object({
  emotion: z.enum(emotionValues, {
    errorMap: () => ({ message: 'Selecione uma emoção válida' }),
  }),
  notes: z.string().max(500, 'Notas muito longas (máximo 500 caracteres)').optional(),
});

export type EmotionCheckInFormData = z.infer<typeof emotionCheckInSchema>;

// ======================
// 📋 HÁBITOS
// ======================

export const habitSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome do hábito deve ter no mínimo 2 caracteres')
    .max(100, 'Nome muito longo'),
  description: z.string().max(300, 'Descrição muito longa').optional(),
  category: z.enum(['saude', 'autocuidado', 'bebe', 'sono', 'alimentacao', 'exercicio'], {
    errorMap: () => ({ message: 'Selecione uma categoria válida' }),
  }),
  frequency: z.enum(['daily', 'weekly', 'custom'], {
    errorMap: () => ({ message: 'Selecione uma frequência válida' }),
  }),
  targetDays: z.array(z.number().min(0).max(6)).optional(),
  reminderTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)')
    .optional(),
});

export type HabitFormData = z.infer<typeof habitSchema>;

export const habitEntrySchema = z.object({
  habitId: z.string().uuid('ID do hábito inválido'),
  completed: z.boolean(),
  value: z.number().min(0).optional(),
  notes: z.string().max(200, 'Notas muito longas').optional(),
  mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible']).optional(),
});

export type HabitEntryFormData = z.infer<typeof habitEntrySchema>;

// ======================
// 🤝 COMUNIDADE
// ======================

export const communityPostSchema = z.object({
  content: z
    .string()
    .min(10, 'Post deve ter no mínimo 10 caracteres')
    .max(2000, 'Post muito longo (máximo 2000 caracteres)')
    .trim(),
  isAnonymous: z.boolean().default(false),
  category: z.enum(['desabafo', 'dica', 'pergunta', 'celebracao', 'apoio']).optional(),
});

export type CommunityPostFormData = z.infer<typeof communityPostSchema>;

export const communityCommentSchema = z.object({
  content: z
    .string()
    .min(2, 'Comentário muito curto')
    .max(500, 'Comentário muito longo (máximo 500 caracteres)')
    .trim(),
  isAnonymous: z.boolean().default(false),
});

export type CommunityCommentFormData = z.infer<typeof communityCommentSchema>;

// ======================
// 😴 SONO
// ======================

export const sleepEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  bedtime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  wakeTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  quality: z.number().min(1, 'Qualidade mínima é 1').max(5, 'Qualidade máxima é 5'),
  interruptions: z.number().min(0, 'Interrupções não pode ser negativo').max(20).optional(),
  notes: z.string().max(300, 'Notas muito longas').optional(),
});

export type SleepEntryFormData = z.infer<typeof sleepEntrySchema>;

// ======================
// 📝 DIÁRIO
// ======================

export const diaryEntrySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo').optional(),
  content: z
    .string()
    .min(10, 'Entrada deve ter no mínimo 10 caracteres')
    .max(5000, 'Entrada muito longa (máximo 5000 caracteres)')
    .trim(),
  emotion: z.enum(emotionValues).optional(),
  isPrivate: z.boolean().default(true),
  tags: z.array(z.string().max(30)).max(5, 'Máximo de 5 tags').optional(),
});

export type DiaryEntryFormData = z.infer<typeof diaryEntrySchema>;

// ======================
// 🛠️ HELPERS
// ======================

/**
 * Valida dados com schema Zod e retorna resultado tipado
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
}

/**
 * Valida e retorna apenas os erros (útil para exibir em UI)
 */
export function validateSchemaErrors<T>(schema: z.ZodSchema<T>, data: unknown): string[] {
  const result = schema.safeParse(data);

  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => issue.message);
}
