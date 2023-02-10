import { z } from 'zod';

export const IdSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export type Id = z.infer<typeof IdSchema>;

export const PageSchema = z.object({});
