import { z } from 'zod';

export const createRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(7, 'Valid contact number is required'),
  organization: z.string().trim().min(2, 'Organization or University is required'),
  isIeeeMember: z.boolean().default(false),
  ieeeMembershipNumber: z.string().trim().optional(),
  participantCategory: z.enum(['IEEE_MEMBER_STUDENT', 'NON_IEEE_PROFESSIONAL']),
  attendanceMode: z.enum(['PHYSICAL', 'VIRTUAL']).default('PHYSICAL'),
  selectedActivities: z.array(z.string()).default([]),
  attendDinner: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.isIeeeMember && (!data.ieeeMembershipNumber || data.ieeeMembershipNumber.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'IEEE Membership Number is required when indicating IEEE membership',
    path: ['ieeeMembershipNumber'],
  }
);

export const submitPaymentSchema = z.object({
  transactionReference: z.string().trim().min(3, 'Transaction or reference number is required'),
  paymentDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid payment date is required'),
  amountPaid: z.coerce.number().positive('Amount paid must be greater than 0'),
});

export const reviewPaymentSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_RESUBMISSION']),
  notes: z.string().trim().optional().default(''),
  rejectionReason: z.string().trim().optional().default(''),
}).refine(
  (data) => {
    if ((data.action === 'REJECT' || data.action === 'REQUEST_RESUBMISSION') && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Rejection reason or explanation is required when rejecting or requesting resubmission',
    path: ['rejectionReason'],
  }
);

export const reviewRegistrationSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  notes: z.string().trim().optional().default(''),
  rejectionReason: z.string().trim().optional().default(''),
}).refine(
  (data) => {
    if (data.action === 'REJECT' && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Rejection reason is required when rejecting a registration',
    path: ['rejectionReason'],
  }
);

export const updateFeeSettingsSchema = z.object({
  ieeeStudentPhysical: z.coerce.number().min(0),
  ieeeStudentVirtual: z.coerce.number().min(0),
  nonIeeeProfessionalPhysical: z.coerce.number().min(0),
  nonIeeeProfessionalVirtual: z.coerce.number().min(0),
  dinnerFee: z.coerce.number().min(0),
});
