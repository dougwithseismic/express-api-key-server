// @@filename: src/models/license-model.ts
import { z } from "zod";

export const licenseSchema = z.object({
  id: z.string().uuid(),
  apiKeyId: z.string().uuid(),
  productId: z.string(),
  expiresAt: z.date(),
  isActive: z.boolean(),
});

export const createLicenseSchema = licenseSchema.omit({ id: true });
export const updateLicenseSchema = licenseSchema
  .partial()
  .omit({ id: true, apiKeyId: true });

export type License = z.infer<typeof licenseSchema>;
export type CreateLicenseDto = z.infer<typeof createLicenseSchema>;
export type UpdateLicenseDto = z.infer<typeof updateLicenseSchema>;
