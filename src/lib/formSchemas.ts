import { z } from 'zod';

export const expenseFormSchema = z.object({
  description: z.string().trim().min(1, 'Description is required'),
  amount: z
    .string()
    .trim()
    .refine(value => Number(value) > 0, 'Amount must be greater than 0'),
  expense_date: z.string().min(1, 'Date is required'),
  payment_status: z.enum(['unpaid', 'paid', 'reimbursed']),
  coa_id: z.string().optional(),
});

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email').or(z.literal('')),
  phone: z.string().optional(),
  billing_address: z.string().optional(),
});

export const billFormSchema = z.object({
  vendor_id: z.string().min(1, 'Vendor is required'),
  line_items: z
    .array(
      z.object({
        description: z.string().optional(),
        total: z.string(),
        coa_id: z.string().optional(),
      })
    )
    .refine(
      items => items.some(item => Number(item.total) > 0),
      'Add at least one line with an amount'
    ),
});
