import { z } from 'zod';

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export const nonceSchema = z.object({
  walletAddress: z
    .string({ required_error: 'walletAddress is required' })
    .trim()
    .regex(ethAddressRegex, 'Invalid Ethereum wallet address format (must be 0x followed by 40 hex characters)'),
});

export const verifySchema = z.object({
  walletAddress: z
    .string({ required_error: 'walletAddress is required' })
    .trim()
    .regex(ethAddressRegex, 'Invalid Ethereum wallet address format (must be 0x followed by 40 hex characters)'),
  signature: z
    .string({ required_error: 'signature is required' })
    .trim()
    .min(10, 'Signature is too short or malformed')
    .refine((sig) => sig.startsWith('0x'), {
      message: 'Signature must start with 0x prefix',
    }),
});
