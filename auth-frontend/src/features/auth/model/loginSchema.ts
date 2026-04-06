import { z } from 'zod';

/** Общие правила email для входа, регистрации и сброса пароля */
export const emailSchema = z
  .string()
  .min(1, 'Введите email')
  .email('Некорректный email');

export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(6, 'Минимум 6 символов'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Те же поля и правила, что и при входе */
export const registerSchema = loginSchema;
export type RegisterFormValues = z.infer<typeof registerSchema>;