/**
 * features/auth/schemas/auth.schema.ts
 *
 * Zod validation schema for the login form.
 *
 * Zod checks that the data is correct BEFORE we send it to the server.
 * The TypeScript type is derived from the schema so they always stay in sync.
 */

import { z } from "zod";
import { APP_TEXT } from "@/lib/messages";

// Define the shape and rules for the login form fields
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, APP_TEXT.VALIDATION.EMAIL_REQUIRED) // Must not be empty
    .email(APP_TEXT.VALIDATION.EMAIL_INVALID), // Must look like an email

  password: z
    .string()
    .min(1, APP_TEXT.VALIDATION.PASSWORD_REQUIRED) // Must not be empty
    .min(6, APP_TEXT.VALIDATION.PASSWORD_MIN_LENGTH),
});

// Derive the TypeScript type automatically from the schema
// This means you only define the shape once — no duplication!
export type LoginFormValues = z.infer<typeof loginSchema>;
