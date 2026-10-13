import { z } from 'zod';
import { ACTIVITY_TYPES } from '../../config/constants.js';

export const createCategorySchema = {
  body: z.object({
    code: z.string().min(2).max(50),
    name: z.string().min(2).max(100),
    description: z.string().optional().default(''),
    requiresApproval: z.boolean().default(false),
    requiresInvitation: z.boolean().default(false),
    allowedActivityTypes: z.array(z.nativeEnum(ACTIVITY_TYPES)).default([ACTIVITY_TYPES.KEYNOTE, ACTIVITY_TYPES.TECHNICAL_SESSION]),
    requiredProfileFields: z
      .array(
        z.object({
          fieldName: z.string(),
          label: z.string(),
          type: z.enum(['text', 'number', 'email', 'select', 'file', 'checkbox', 'textarea']).default('text'),
          required: z.boolean().default(false),
          placeholder: z.string().optional().default(''),
          options: z.array(z.string()).optional().default([]),
          helpText: z.string().optional().default(''),
        })
      )
      .default([]),
    badgeColor: z.string().optional().default('#0b4f35'),
    isActive: z.boolean().default(true),
  }),
};

export const updateCategorySchema = {
  params: z.object({
    id: z.string(),
  }),
  body: createCategorySchema.body.partial(),
};
