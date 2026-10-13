import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    category: z.string().optional().default('ATTENDEE_PARTICIPANT'),
    institution: z.string().optional().default(''),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const verifyEmailSchema = {
  body: z.object({
    token: z.string().min(10, 'Verification token is required'),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(10, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    categoryCode: z.string().optional(),
    phone: z.string().optional(),
    cnicOrPassport: z.string().optional(),
    institution: z.string().optional(),
    studentOrEmployeeId: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    tShirtSize: z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'NONE']).optional(),
    dietaryPreference: z.enum(['STANDARD', 'VEGETARIAN', 'HALAL_CHICKEN', 'SPECIAL_DIET']).optional(),
    customFieldData: z.record(z.any()).optional(),
  }),
};
