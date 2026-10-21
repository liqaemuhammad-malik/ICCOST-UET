import { describe, it, expect } from 'vitest';
import {
  parseTimeString,
  doIntervalsOverlap,
  findConflictingActivity,
  formatConflictMessage,
  isNonExclusiveActivity,
} from '../src/features/registration/timeConflictEngine';

describe('ICOSST 2026 Time Conflict Engine', () => {
  it('parses valid time intervals correctly into minutes from midnight', () => {
    const t1 = parseTimeString('11:00–12:20');
    expect(t1.isAllDay).toBe(false);
    expect(t1.startMin).toBe(11 * 60); // 660
    expect(t1.endMin).toBe(12 * 60 + 20); // 740

    const t2 = parseTimeString('09:30-11:00'); // with standard hyphen
    expect(t2.isAllDay).toBe(false);
    expect(t2.startMin).toBe(9 * 60 + 30); // 570
    expect(t2.endMin).toBe(11 * 60); // 660

    const tAllDay = parseTimeString('All day');
    expect(tAllDay.isAllDay).toBe(true);
  });

  it('allows non-overlapping adjacent activities (endA === startB)', () => {
    const workshop1 = parseTimeString('11:00–12:20');
    const workshop2 = parseTimeString('12:20–13:30');
    expect(doIntervalsOverlap(workshop1, workshop2)).toBe(false);
  });

  it('detects overlap when startA < endB && startB < endA', () => {
    const track1A = parseTimeString('11:00–13:00');
    const workshop1 = parseTimeString('11:00–12:20');
    expect(doIntervalsOverlap(track1A, workshop1)).toBe(true);

    const talkB = parseTimeString('11:30–12:30');
    expect(doIntervalsOverlap(workshop1, talkB)).toBe(true);
  });

  it('does not conflict when activities are on different calendar days', () => {
    const allActivities = [
      { id: 'd1-session', day: 'Day 1', time: '11:00–13:00', title: 'Day 1 Track' },
      { id: 'd2-session', day: 'Day 2', time: '11:00–13:00', title: 'Day 2 Track' },
    ];

    const conflict = findConflictingActivity(allActivities[1], ['d1-session'], allActivities);
    expect(conflict).toBeNull();
  });

  it('identifies Technofest vs Brainiac overlap on Day 2', () => {
    const allActivities = [
      { id: 'd2-showcase', day: 'Day 2', time: '10:00–14:00', title: 'Technofest 2026 · Innovation Showcase' },
      { id: 'd2-brainiac', day: 'Day 2', time: '10:00–14:00', title: 'Brainiac 2026 · Project Showcase Competition' },
    ];

    const conflict = findConflictingActivity(allActivities[1], ['d2-showcase'], allActivities);
    expect(conflict).not.toBeNull();
    expect(conflict.id).toBe('d2-showcase');

    const msg = formatConflictMessage(allActivities[1], conflict);
    expect(msg).toContain('Schedule conflict');
    expect(msg).toContain('Brainiac 2026');
    expect(msg).toContain('Technofest 2026');
  });

  it('allows Industrial Projects Exhibition to run in parallel without conflicts', () => {
    const allActivities = [
      { id: 'd1-exhibition', day: 'Day 1', time: 'All day', track: 'Exhibition', title: 'Industrial Projects Exhibition' },
      { id: 'd1-workshop-1', day: 'Day 1', time: '11:00–12:20', track: 'Session I', title: 'Workshop 1 · SaaS Development by AI' },
    ];

    expect(isNonExclusiveActivity(allActivities[0])).toBe(true);

    // Trying to select exhibition while workshop is selected -> no conflict
    const conflict1 = findConflictingActivity(allActivities[0], ['d1-workshop-1'], allActivities);
    expect(conflict1).toBeNull();

    // Trying to select workshop while exhibition is selected -> no conflict
    const conflict2 = findConflictingActivity(allActivities[1], ['d1-exhibition'], allActivities);
    expect(conflict2).toBeNull();
  });

  it('allows back-to-back Day 2 competitions (Gaming 10:00-11:20 & Speed 11:20-12:40)', () => {
    const gaming = { id: 'd2-gaming', day: 'Day 2', time: '10:00–11:20', title: 'Gaming Competition' };
    const speed = { id: 'd2-speed', day: 'Day 2', time: '11:20–12:40', title: 'Speed Programming' };
    const all = [gaming, speed];

    const conflict = findConflictingActivity(speed, ['d2-gaming'], all);
    expect(conflict).toBeNull();
  });
});
