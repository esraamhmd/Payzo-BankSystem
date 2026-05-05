import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name:     z.string({ required_error: 'Name is required' }).min(2, 'At least 2 characters').max(50).trim(),
    email:    z.string({ required_error: 'Email is required' }).email('Invalid email').toLowerCase().trim(),
    password: z.string({ required_error: 'Password is required' })
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must contain one uppercase letter')
      .regex(/[0-9]/, 'Must contain one number'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email:    z.string({ required_error: 'Email is required' }).email('Invalid email').toLowerCase().trim(),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
});


export const transferSchema = z.object({
  body: z.object({
    receiverAccountNumber: z.string({ required_error: 'Account number is required' }).min(1),
    amount: z.number({ required_error: 'Amount is required', invalid_type_error: 'Must be a number' })
      .min(1, 'Minimum $1').max(100000, 'Maximum $100,000'),
    description: z.string().max(200).optional(),
  }),
});

export const depositSchema = z.object({
  body: z.object({
    amount: z.number({ required_error: 'Amount is required', invalid_type_error: 'Must be a number' })
      .min(1, 'Minimum $1').max(50000, 'Maximum $50,000'),
  }),
});

export const withdrawSchema = z.object({
  body: z.object({
    amount: z.number({ required_error: 'Amount is required', invalid_type_error: 'Must be a number' })
      .min(1, 'Minimum $1').max(10000, 'Maximum $10,000'),
  }),
});


export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
  body: z.object({
    isActive: z.boolean().optional(),
    role:     z.enum(['user', 'admin']).optional(),
  }),
});


export type RegisterInput  = z.infer<typeof registerSchema>['body'];
export type LoginInput     = z.infer<typeof loginSchema>['body'];
export type TransferInput  = z.infer<typeof transferSchema>['body'];
export type DepositInput   = z.infer<typeof depositSchema>['body'];
export type WithdrawInput  = z.infer<typeof withdrawSchema>['body'];