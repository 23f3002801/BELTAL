import { z } from 'zod';

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const ROLE_VALUES = ['ADMIN', 'MANAGER', 'AUDITOR', 'USER', 'SYSTEM_CONNECTOR'];
const SBU_VALUES = ['SBU_RADAR', 'SBU_EW', 'SBU_MILCOMM', 'SBU_CYBER'];

export const registerIdentitySchema = z.object({
  walletAddress: z
    .string({ required_error: 'walletAddress is required' })
    .trim()
    .regex(ethAddressRegex, 'Invalid Ethereum wallet address format (must be 0x followed by 40 hex characters)'),
  externalId: z.string({ required_error: 'externalId (employee code) is required' }).trim().min(1),
  fullName: z.string({ required_error: 'fullName is required' }).trim().min(1),
  displayName: z.string().trim().min(1).optional(),
  role: z.enum(ROLE_VALUES).optional(),
  clearanceLevel: z
    .number({ required_error: 'clearanceLevel is required' })
    .int()
    .min(1)
    .max(4),
  sbu: z.enum(SBU_VALUES, { required_error: 'sbu is required' }),
  piiDossier: z.record(z.string(), z.any()).optional(),
});

export const updateRoleSchema = z
  .object({
    role: z.enum(ROLE_VALUES).optional(),
    clearanceLevel: z.number().int().min(1).max(4).optional(),
  })
  .refine((data) => data.role !== undefined || data.clearanceLevel !== undefined, {
    message: 'At least one of role or clearanceLevel must be provided',
  });
