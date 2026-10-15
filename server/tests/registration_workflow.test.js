import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/modules/users/user.model.js';
import { ROLES } from '../src/config/constants.js';

describe('ICOSST 2026: End-to-End Registration, Payment & Approval Flow', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  const timestamp = Date.now();
  const participantUser = {
    name: 'Engr. Haris Test',
    email: `haris.test.${timestamp}@uet.edu.pk`,
    password: 'Password123!',
  };

  const adminUser = {
    name: 'ICOSST Admin Tester',
    email: `admin.test.${timestamp}@icosst.kics.edu.pk`,
    password: 'AdminPassword123!',
  };

  let participantToken = '';
  let adminToken = '';
  let registrationId = '';
  let registrationNumber = '';

  it('1. Prepares test participant and admin accounts', async () => {
    // Register participant
    const regRes = await request(app).post('/api/auth/register').send(participantUser);
    expect(regRes.status).toBe(201);
    const token = regRes.body.data.rawVerificationToken;
    await request(app).post('/api/auth/verify-email').send({ token });

    // Participant login
    const loginRes = await request(app).post('/api/auth/login').send({
      email: participantUser.email,
      password: participantUser.password,
    });
    expect(loginRes.status).toBe(200);
    participantToken = loginRes.body.data.accessToken;
    expect(participantToken).toBeDefined();

    // Create & verify Super Admin
    const adminDoc = await User.create({
      name: adminUser.name,
      email: adminUser.email,
      passwordHash: adminUser.password,
      role: ROLES.SUPER_ADMIN,
      isEmailVerified: true,
    });
    expect(adminDoc).toBeDefined();

    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: adminUser.email,
      password: adminUser.password,
    });
    expect(adminLoginRes.status).toBe(200);
    adminToken = adminLoginRes.body.data.accessToken;
    expect(adminToken).toBeDefined();
  });

  it('2. Queries public bank and fee configuration', async () => {
    const res = await request(app).get('/api/registrations/config');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bankDetails.iban).toContain('PK93UNIL');
    expect(res.body.data.feeSettings.ieeeStudentPhysical).toBe(1000);
    expect(res.body.data.feeSettings.nonIeeeProfessionalPhysical).toBe(2000);
    expect(res.body.data.feeSettings.dinnerFee).toBe(5000);
  });

  it('3. Computes authoritative real-time fees', async () => {
    // IEEE Student + Dinner
    const res1 = await request(app).post('/api/registrations/calculate-fee').send({
      participantCategory: 'IEEE_MEMBER_STUDENT',
      attendanceMode: 'PHYSICAL',
      attendDinner: true,
    });
    expect(res1.status).toBe(200);
    expect(res1.body.data.registrationFee).toBe(1000);
    expect(res1.body.data.dinnerFee).toBe(5000);
    expect(res1.body.data.totalFee).toBe(6000);

    // Professional without Dinner
    const res2 = await request(app).post('/api/registrations/calculate-fee').send({
      participantCategory: 'NON_IEEE_PROFESSIONAL',
      attendanceMode: 'PHYSICAL',
      attendDinner: false,
    });
    expect(res2.status).toBe(200);
    expect(res2.body.data.registrationFee).toBe(2000);
    expect(res2.body.data.dinnerFee).toBe(0);
    expect(res2.body.data.totalFee).toBe(2000);
  });

  it('4. Participant submits conference registration with validation', async () => {
    // Failing case: IEEE Member selected but no IEEE number provided
    const failRes = await request(app)
      .post('/api/registrations')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        fullName: 'Engr. Haris Test',
        email: participantUser.email,
        phone: '+92 300 1234567',
        organization: 'UET Lahore',
        isIeeeMember: true,
        ieeeMembershipNumber: '', // missing
        participantCategory: 'IEEE_MEMBER_STUDENT',
        attendanceMode: 'PHYSICAL',
        selectedActivities: ['Opening / Closing Ceremony', 'Keynote Addresses'],
        attendDinner: true,
      });
    expect(failRes.status).toBe(422);
    expect(failRes.body.error.code).toBe('VALIDATION_ERROR');

    // Successful submission
    const res = await request(app)
      .post('/api/registrations')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        fullName: 'Engr. Haris Test',
        email: participantUser.email,
        phone: '+92 300 1234567',
        organization: 'UET Lahore Main Campus',
        isIeeeMember: true,
        ieeeMembershipNumber: 'IEEE-998822',
        participantCategory: 'IEEE_MEMBER_STUDENT',
        attendanceMode: 'PHYSICAL',
        selectedActivities: ['Paper Presentation Session', 'Opening / Closing Ceremony'],
        attendDinner: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.registrationNumber).toMatch(/^ICOSST26-REG-/);
    expect(res.body.data.registrationStatus).toBe('PENDING_PAYMENT');
    expect(res.body.data.paymentStatus).toBe('NOT_SUBMITTED');
    expect(res.body.data.totalFee).toBe(6000);

    registrationId = res.body.data._id;
    registrationNumber = res.body.data.registrationNumber;
  });

  it('5. Queries participant portal status (Not Approved yet)', async () => {
    const res = await request(app)
      .get('/api/registrations/my')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.registrationNumber).toBe(registrationNumber);
    expect(res.body.data.registrationStatus).toBe('PENDING_PAYMENT');
    expect(res.body.data.paymentStatus).toBe('NOT_SUBMITTED');
    expect(res.body.data.qrCodeToken).toBeNull();
  });

  it('6. Participant uploads bank payment receipt', async () => {
    const fakeReceiptBuffer = Buffer.from('Mock Bank Deposit Slip Content for Testing');

    const res = await request(app)
      .post('/api/registrations/payment')
      .set('Authorization', `Bearer ${participantToken}`)
      .field('transactionReference', 'UBL-FT-991827364')
      .field('paymentDate', '2026-10-15')
      .field('amountPaid', 6000)
      .attach('receipt', fakeReceiptBuffer, 'deposit_slip_receipt.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.registration.paymentStatus).toBe('PENDING_VERIFICATION');
    expect(res.body.data.paymentSubmission.transactionReference).toBe('UBL-FT-991827364');
    expect(res.body.data.paymentSubmission.amountPaid).toBe(6000);
  });

  it('7. Unauthorized participant cannot access admin queue', async () => {
    const res = await request(app)
      .get('/api/registrations/admin/all')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.status).toBe(403);
  });

  it('8. Admin views pending verification requests', async () => {
    const res = await request(app)
      .get('/api/registrations/admin/all?paymentStatus=PENDING_VERIFICATION')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const item = res.body.data.items.find((r) => r._id === registrationId);
    expect(item).toBeDefined();
    expect(item.paymentSubmission.transactionReference).toBe('UBL-FT-991827364');
  });

  it('9. Admin reviews and approves payment', async () => {
    const res = await request(app)
      .post(`/api/registrations/admin/${registrationId}/review-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'APPROVE',
        notes: 'Payment verified against UBL GT Road statement.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.paymentSubmission.verificationStatus).toBe('VERIFIED');
    expect(res.body.data.registration.paymentStatus).toBe('VERIFIED');
    expect(res.body.data.registration.registrationStatus).toBe('UNDER_REVIEW');
  });

  it('10. Admin approves conference registration and activates delegate pass', async () => {
    const res = await request(app)
      .post(`/api/registrations/admin/${registrationId}/review-registration`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'APPROVE',
        notes: 'Delegate verified. Gate access token granted.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.registrationStatus).toBe('APPROVED');
    expect(res.body.data.approvedAt).toBeDefined();
    expect(res.body.data.qrCodeToken).toBeDefined();
  });

  it('11. Participant portal reflects approved registration and active pass', async () => {
    const res = await request(app)
      .get('/api/registrations/my')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.registrationStatus).toBe('APPROVED');
    expect(res.body.data.paymentStatus).toBe('VERIFIED');
    expect(res.body.data.qrCodeToken).toBeDefined();
  });

  it('12. Downloads official Delegate Slip PDF', async () => {
    const res = await request(app)
      .get('/api/registrations/my/delegate-slip')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain(registrationNumber);
    expect(res.body.length).toBeGreaterThan(100);
  });

  it('13. Public / Staff Scanner validates approved delegate pass server-side', async () => {
    // Valid approved pass
    const resValid = await request(app).get(`/api/registrations/verify-pass/${registrationNumber}`);
    expect(resValid.status).toBe(200);
    expect(resValid.body.data.isValid).toBe(true);
    expect(resValid.body.data.status).toBe('CONFIRMED');
    expect(resValid.body.data.attendee).toBe('Engr. Haris Test');
    expect(resValid.body.data.dinnerIncluded).toBe(true);
    expect(resValid.body.data.mealsEntitled).toContain('Official Conference Gala Dinner (Confirmed)');

    // Invalid non-existent pass
    const resInvalid = await request(app).get('/api/registrations/verify-pass/UNKNOWN-PASS-999');
    expect(resInvalid.status).toBe(200);
    expect(resInvalid.body.data.isValid).toBe(false);
    expect(resInvalid.body.data.status).toBe('NOT_FOUND');
  });

  it('14. Tests Payment Rejection & Resubmission workflow for second attendee', async () => {
    // Second attendee
    const user2 = {
      name: 'Dr. Fatima Research',
      email: `fatima.test.${Date.now()}@fast.edu.pk`,
      password: 'Password123!',
    };
    const regRes = await request(app).post('/api/auth/register').send(user2);
    await request(app).post('/api/auth/verify-email').send({ token: regRes.body.data.rawVerificationToken });
    const loginRes = await request(app).post('/api/auth/login').send({ email: user2.email, password: user2.password });
    const user2Token = loginRes.body.data.accessToken;

    // Submit registration
    const rRes = await request(app)
      .post('/api/registrations')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        fullName: user2.name,
        email: user2.email,
        phone: '+92 321 9876543',
        organization: 'FAST-NUCES',
        isIeeeMember: false,
        participantCategory: 'NON_IEEE_PROFESSIONAL',
        attendanceMode: 'PHYSICAL',
        selectedActivities: ['Invited Speakers Tutorials'],
        attendDinner: false,
      });
    const reg2Id = rRes.body.data._id;

    // Submit payment
    await request(app)
      .post('/api/registrations/payment')
      .set('Authorization', `Bearer ${user2Token}`)
      .field('transactionReference', 'INVALID-REF-001')
      .field('paymentDate', '2026-10-15')
      .field('amountPaid', 1000) // underpaid
      .attach('receipt', Buffer.from('Blurred slip'), 'receipt.png');

    // Admin requests resubmission
    const rejRes = await request(app)
      .post(`/api/registrations/admin/${reg2Id}/review-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'REQUEST_RESUBMISSION',
        rejectionReason: 'Deposit receipt is blurred and amount is PKR 1000 instead of required PKR 2000.',
      });
    expect(rejRes.status).toBe(200);
    expect(rejRes.body.data.paymentSubmission.verificationStatus).toBe('RESUBMISSION_REQUESTED');

    // Participant checks status and sees resubmission note
    const myRes = await request(app).get('/api/registrations/my').set('Authorization', `Bearer ${user2Token}`);
    expect(myRes.body.data.paymentStatus).toBe('RESUBMISSION_REQUESTED');
    expect(myRes.body.data.resubmissionNotes).toContain('Deposit receipt is blurred');

    // Participant resubmits corrected payment
    const resubmitRes = await request(app)
      .post('/api/registrations/payment')
      .set('Authorization', `Bearer ${user2Token}`)
      .field('transactionReference', 'CORRECTED-RAAST-772211')
      .field('paymentDate', '2026-10-15')
      .field('amountPaid', 2000)
      .attach('receipt', Buffer.from('Clear bank slip'), 'clear_slip.png');
    expect(resubmitRes.status).toBe(200);
    expect(resubmitRes.body.data.paymentSubmission.verificationStatus).toBe('PENDING_VERIFICATION');
    expect(resubmitRes.body.data.paymentSubmission.attempts.length).toBe(1); // past attempt preserved!
  });
});
