import { z } from 'zod';

export const createTransferRequestSchema = z.object({
  assetId: z.string().trim().min(1, 'assetId is required'),
  toUserId: z.string().trim().min(1, 'toUserId is required'),
  reason: z.string().trim().max(1000).optional(),
});

export const listTransfersQuerySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'EXECUTED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const rejectTransferSchema = z.object({
  reason: z.string().trim().max(1000).optional(),
});

export default { createTransferRequestSchema, listTransfersQuerySchema, rejectTransferSchema };
