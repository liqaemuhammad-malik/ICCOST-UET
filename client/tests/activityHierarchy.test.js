import { describe, it, expect } from 'vitest';
import {
  day1Categories,
  day2Categories,
  getCategoriesForDay,
  getCategoryById,
  getCategorySelectedCount,
  getDaySelectedCount,
  findActivityInSchedule,
} from '../src/features/registration/activityHierarchy';
import { defaultSchedule } from '../src/features/shared/scheduleData';
import { findConflictingActivity } from '../src/features/registration/timeConflictEngine';

describe('ICOSST 2026 Hierarchical Activity Categories & Popup Adapter', () => {
  it('correctly populates Day 1 categories according to official conference schedule', () => {
    const d1 = getCategoriesForDay('Day 1');
    expect(d1.length).toBe(10);

    const titles = d1.map((c) => c.title);
    expect(titles).toContain('Opening Ceremony');
    expect(titles).toContain('Industrial Projects Exhibition');
    expect(titles).toContain('Track 1A — Invited Talks');
    expect(titles).toContain('Track 1B — Technical Papers');
    expect(titles).toContain('Workshop 1 — SaaS Development by AI');
    expect(titles).toContain('Workshop 2 — Quantum Computing');
    expect(titles).toContain('Track 2A — Invited Talks');
    expect(titles).toContain('Track 2B — Technical Papers');
    expect(titles).toContain('Workshop 3 — Generative AI');
    expect(titles).toContain('Day 1 at a Glance');
  });

  it('correctly populates Day 2 categories according to official conference schedule', () => {
    const d2 = getCategoriesForDay('Day 2');
    expect(d2.length).toBe(8);

    const titles = d2.map((c) => c.title);
    expect(titles).toContain('Technofest 2026 — Innovation Showcase');
    expect(titles).toContain('Brainiac 2026 — Project Showcase Competition');
    expect(titles).toContain('NCAI Team Workshop');
    expect(titles).toContain('Gaming Competition');
    expect(titles).toContain('Speed Programming');
    expect(titles).toContain('Track 3A — Invited Talks');
    expect(titles).toContain('Track 3B — Technical Papers');
    expect(titles).toContain('Conference Closing & Prize Distribution');
  });

  it('ensures every category links to an existing canonical activity ID in defaultSchedule', () => {
    const allCategories = [...day1Categories, ...day2Categories];

    for (const cat of allCategories) {
      expect(cat.activityId).toBeDefined();
      const canonical = findActivityInSchedule(cat.activityId);
      expect(canonical).not.toBeNull();
      expect(canonical.id).toBe(cat.activityId);
      expect(canonical.day).toBe(cat.day);
    }
  });

  it('flags informational session (Day 1 at a Glance) properly', () => {
    const glance = getCategoryById('cat-d1-close');
    expect(glance).toBeDefined();
    expect(glance.isInformational).toBe(true);
    expect(glance.sessions[0].isInformational).toBe(true);
  });

  it('calculates selected count per category and per day independently', () => {
    const selectedIds = ['d1-opening', 'd1-talk-1', 'd2-gaming'];

    const openingCat = getCategoryById('cat-d1-opening');
    expect(getCategorySelectedCount(openingCat, selectedIds)).toBe(1);

    const paper1Cat = getCategoryById('cat-d1-track1b');
    expect(getCategorySelectedCount(paper1Cat, selectedIds)).toBe(0);

    expect(getDaySelectedCount('Day 1', selectedIds)).toBe(2);
    expect(getDaySelectedCount('Day 2', selectedIds)).toBe(1);
  });

  it('validates schedule conflict between Category sessions (Track 1A vs Workshop 1)', () => {
    const track1ACat = getCategoryById('cat-d1-track1a');
    const workshop1Cat = getCategoryById('cat-d1-workshop1');

    const track1AActivity = findActivityInSchedule(track1ACat.activityId);
    const workshop1Activity = findActivityInSchedule(workshop1Cat.activityId);

    const conflict = findConflictingActivity(
      workshop1Activity,
      [track1AActivity.id],
      defaultSchedule
    );

    expect(conflict).not.toBeNull();
    expect(conflict.id).toBe('d1-talk-1');
  });
});
