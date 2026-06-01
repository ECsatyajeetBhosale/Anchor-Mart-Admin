/**
 * features/auth/schemas/auth.schema.ts
 *
 * Zod validation schema for the login form.
 */

import { z } from "zod";
import { APP_TEXT } from "@/lib/messages";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, APP_TEXT.VALIDATION.EMAIL_REQUIRED)
    .email(APP_TEXT.VALIDATION.EMAIL_INVALID),

  password: z
    .string()
    .min(1, APP_TEXT.VALIDATION.PASSWORD_REQUIRED)
    .min(6, APP_TEXT.VALIDATION.PASSWORD_MIN_LENGTH),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
