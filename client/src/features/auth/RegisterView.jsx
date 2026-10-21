import React from 'react';
import { RegistrationWizard } from '@/features/registration/RegistrationWizard';

/**
 * RegisterView
 * 
 * Official ICOSST 2026 Academic Registration Experience:
 * - 5-Step Streamlined Wizard (Participation Type -> Activities -> Personal Info -> Review -> Confirmation)
 * - Mutually Exclusive Time Overlap Detection across Day 1 & Day 2
 * - One-time account registration with integrated conference registration
 * - Preserves existing authentication, backend API contracts, and admin approval workflows
 */
export function RegisterView() {
  return <RegistrationWizard />;
}
