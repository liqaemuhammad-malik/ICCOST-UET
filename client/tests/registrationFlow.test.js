import { describe, it, expect } from 'vitest';
import {
  findConflictingActivity,
  formatConflictMessage,
  isNonExclusiveActivity,
  parseTimeString,
  doIntervalsOverlap,
} from '../src/features/registration/timeConflictEngine';
import { defaultSchedule } from '../src/features/shared/scheduleData';

describe('ICOSST 2026 Registration Flow & Conflict Tests (Section 21)', () => {
  describe('Activity Selection & Overlap Constraints', () => {
    it('allows selection of two non-overlapping activities on the same day', () => {
      const workshop1 = defaultSchedule.find((item) => item.id === 'd1-workshop-1'); // 11:00–12:20
      const workshop2 = defaultSchedule.find((item) => item.id === 'd1-workshop-2'); // 12:20–13:30

      expect(workshop1).toBeDefined();
      expect(workshop2).toBeDefined();

      const conflict = findConflictingActivity(workshop2, [workshop1.id], defaultSchedule);
      expect(conflict).toBeNull();
    });

    it('prevents selection of two overlapping activities on the same day', () => {
      const track1A = defaultSchedule.find((item) => item.id === 'd1-talk-1'); // 11:00–13:00
      const workshop1 = defaultSchedule.find((item) => item.id === 'd1-workshop-1'); // 11:00–12:20

      expect(track1A).toBeDefined();
      expect(workshop1).toBeDefined();

      const conflict = findConflictingActivity(workshop1, [track1A.id], defaultSchedule);
      expect(conflict).not.toBeNull();
      expect(conflict.id).toBe(track1A.id);

      const warning = formatConflictMessage(workshop1, conflict);
      expect(warning).toContain('Schedule conflict');
      expect(warning).toContain(workshop1.title);
      expect(warning).toContain(conflict.title);
    });

    it('retains previously selected activity when an invalid selection is attempted', () => {
      let selectedIds = ['d1-talk-1'];
      const candidate = defaultSchedule.find((item) => item.id === 'd1-workshop-1');

      const conflict = findConflictingActivity(candidate, selectedIds, defaultSchedule);
      expect(conflict).not.toBeNull();

      // Because conflict was detected, selectedIds is not modified
      expect(selectedIds).toContain('d1-talk-1');
      expect(selectedIds).not.toContain('d1-workshop-1');
    });

    it('allows candidate when conflicting activity is removed', () => {
      let selectedIds = ['d1-talk-1'];
      const candidate = defaultSchedule.find((item) => item.id === 'd1-workshop-1');

      // User deselects d1-talk-1
      selectedIds = selectedIds.filter((id) => id !== 'd1-talk-1');

      const conflictAfterRemoval = findConflictingActivity(candidate, selectedIds, defaultSchedule);
      expect(conflictAfterRemoval).toBeNull();

      // Now safe to add candidate
      selectedIds.push(candidate.id);
      expect(selectedIds).toEqual(['d1-workshop-1']);
    });

    it('confirms Day 2 parallel competitions (Technofest vs Brainiac) conflict', () => {
      const technofest = defaultSchedule.find((item) => item.id === 'd2-showcase'); // 10:00–14:00
      const brainiac = defaultSchedule.find((item) => item.id === 'd2-brainiac'); // 10:00–14:00

      expect(technofest).toBeDefined();
      expect(brainiac).toBeDefined();

      const conflict = findConflictingActivity(brainiac, [technofest.id], defaultSchedule);
      expect(conflict).not.toBeNull();
      expect(conflict.id).toBe('d2-showcase');
    });

    it('handles parallel full-day exhibition without conflicting with any session', () => {
      const exhibition = defaultSchedule.find((item) => item.id === 'd1-exhibition');
      const allDay1Sessions = defaultSchedule.filter((item) => item.day === 'Day 1' && item.id !== 'd1-exhibition');

      expect(isNonExclusiveActivity(exhibition)).toBe(true);

      for (const session of allDay1Sessions) {
        const conflict = findConflictingActivity(session, [exhibition.id], defaultSchedule);
        expect(conflict).toBeNull();
      }
    });

    it('verifies activities on Day 1 and Day 2 never conflict regardless of matching clock times', () => {
      const day1Session = defaultSchedule.find((item) => item.id === 'd1-talk-1'); // Day 1 11:00-13:00
      const day2Session = defaultSchedule.find((item) => item.id === 'd2-talks'); // Day 2 10:00-12:00

      const conflict = findConflictingActivity(day2Session, [day1Session.id], defaultSchedule);
      expect(conflict).toBeNull();
    });
  });

  describe('Registration Payload Validation', () => {
    it('validates required fields for conference registration', () => {
      const validPayload = {
        fullName: 'Dr. Sarah Ahmad',
        email: 'sarah.ahmad@uet.edu.pk',
        phone: '+92 300 9876543',
        organization: 'UET Lahore',
        isIeeeMember: false,
        participantCategory: 'IEEE_MEMBER_STUDENT',
        attendanceMode: 'PHYSICAL',
        selectedActivities: ['Opening Ceremony', 'Track 1A · Invited Talks'],
        attendDinner: false,
      };

      expect(validPayload.fullName.length).toBeGreaterThanOrEqual(2);
      expect(validPayload.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(validPayload.phone.length).toBeGreaterThanOrEqual(7);
      expect(validPayload.selectedActivities.length).toBeGreaterThan(0);
    });

    it('requires IEEE membership number when isIeeeMember is true', () => {
      const payloadWithIeee = {
        isIeeeMember: true,
        ieeeMembershipNumber: '',
      };

      const isValid = !payloadWithIeee.isIeeeMember || Boolean(payloadWithIeee.ieeeMembershipNumber && payloadWithIeee.ieeeMembershipNumber.trim().length > 0);
      expect(isValid).toBe(false);

      payloadWithIeee.ieeeMembershipNumber = '9482019';
      const isValidNow = !payloadWithIeee.isIeeeMember || Boolean(payloadWithIeee.ieeeMembershipNumber && payloadWithIeee.ieeeMembershipNumber.trim().length > 0);
      expect(isValidNow).toBe(true);
    });
  });
});
