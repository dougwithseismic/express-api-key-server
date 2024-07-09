// @@filename: src/models/api-key-model.ts
import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  userId: z.string().uuid(),
  credits: z.number().int().nonnegative(),
  createdAt: z.date(),
  lastUsed: z.date().optional(),
  isActive: z.boolean(),
});

export const createApiKeySchema = apiKeySchema.omit({
  id: true,
  key: true,
  createdAt: true,
  lastUsed: true,
  isActive: true,
});
export const updateApiKeySchema = apiKeySchema
  .partial()
  .omit({ id: true, key: true, userId: true, createdAt: true });

export type ApiKey = z.infer<typeof apiKeySchema>;
export type CreateApiKeyDto = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyDto = z.infer<typeof updateApiKeySchema>;
