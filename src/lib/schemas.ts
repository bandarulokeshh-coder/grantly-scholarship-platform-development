import { z } from "zod";

import {
  APPLICATION_STATUSES,
  CATEGORIES,
  EDUCATION_LEVELS,
  GENDERS,
  INCOME_BRACKETS,
  INDIAN_STATES,
} from "@/types";

/**
 * Removes control characters, collapses whitespace and caps the length.
 * React escapes rendered text, so this is defence in depth for stored input.
 */
export function sanitizeText(value: string, maxLength: number): string {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Caps length for free-text search without changing its meaning. */
export function sanitizeSearchQuery(value: string): string {
  return sanitizeText(value, 80);
}

export const studentProfileSchema = z.object({
  level: z.enum(EDUCATION_LEVELS),
  course: z.string().trim().max(60),
  state: z.enum(INDIAN_STATES),
  category: z.enum(CATEGORIES),
  income: z.enum(INCOME_BRACKETS),
  gender: z.enum(GENDERS).optional(),
});

export const trackerEntrySchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  updatedAt: z.string().max(40),
});

export const trackerSchema = z.record(
  z.string().min(1).max(80),
  trackerEntrySchema,
);

export const savedDocumentsSchema = z.array(z.string().min(1).max(160)).max(200);

export const themePreferenceSchema = z.enum(["light", "dark", "system"]);

export type ThemePreference = z.infer<typeof themePreferenceSchema>;
