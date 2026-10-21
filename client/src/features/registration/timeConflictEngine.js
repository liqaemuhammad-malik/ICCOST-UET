/**
 * ICOSST 2026 Registration Time Conflict Validation Engine
 * 
 * Implements strict mathematical overlap detection for conference activities:
 * Overlap condition: startA < endB && startB < endA on the same calendar day.
 * 
 * Rules:
 * 1. Activities on different calendar dates never conflict.
 * 2. Back-to-back activities (endA === startB) do NOT conflict.
 * 3. Parallel exhibitions ('All day' or track 'Exhibition') are non-exclusive and do not conflict.
 * 4. Exclusive overlapping sessions (e.g. parallel tracks or competitions) conflict.
 */

/**
 * Parses time strings such as "11:00–12:20", "09:30–11:00", "10:00-14:00", or "All day".
 * Returns minutes from midnight for start and end.
 *
 * @param {string} timeStr
 * @returns {{ isAllDay: boolean, startMin: number | null, endMin: number | null }}
 */
export function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') {
    return { isAllDay: true, startMin: null, endMin: null };
  }

  const normalized = timeStr.trim();
  if (normalized.toLowerCase() === 'all day' || normalized.toLowerCase() === 'full-day') {
    return { isAllDay: true, startMin: null, endMin: null };
  }

  // Support both en-dash (–) and standard hyphen (-)
  const parts = normalized.split(/[–\-]/);
  if (parts.length !== 2) {
    return { isAllDay: true, startMin: null, endMin: null };
  }

  const parseTimePart = (part) => {
    const match = part.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  };

  const startMin = parseTimePart(parts[0]);
  const endMin = parseTimePart(parts[1]);

  if (startMin === null || endMin === null) {
    return { isAllDay: true, startMin: null, endMin: null };
  }

  return { isAllDay: false, startMin, endMin };
}

/**
 * Checks whether two time intervals overlap.
 * Strictly adheres to: startA < endB && startB < endA
 *
 * @param {{ isAllDay: boolean, startMin: number, endMin: number }} intervalA
 * @param {{ isAllDay: boolean, startMin: number, endMin: number }} intervalB
 * @returns {boolean}
 */
export function doIntervalsOverlap(intervalA, intervalB) {
  if (intervalA.isAllDay || intervalB.isAllDay) {
    return false;
  }
  return intervalA.startMin < intervalB.endMin && intervalB.startMin < intervalA.endMin;
}

/**
 * Determines whether an activity is non-exclusive (e.g. parallel open exhibition).
 *
 * @param {object} activity
 * @returns {boolean}
 */
export function isNonExclusiveActivity(activity) {
  if (!activity) return true;
  if (activity.isParallel || activity.isExclusive === false) return true;
  if (activity.track?.toLowerCase() === 'exhibition') return true;
  if (activity.time?.toLowerCase() === 'all day') return true;
  return false;
}

/**
 * Finds if a candidate activity conflicts with any currently selected activities.
 *
 * @param {object} candidateActivity - Activity to be evaluated
 * @param {string[]} selectedIds - Array of activity IDs already selected
 * @param {Record<string, object> | object[]} allActivities - Map or array of all activity objects
 * @returns {object | null} Conflicting activity object or null if valid
 */
export function findConflictingActivity(candidateActivity, selectedIds, allActivities) {
  if (!candidateActivity || !selectedIds || !selectedIds.length) {
    return null;
  }

  // Non-exclusive parallel events do not conflict
  if (isNonExclusiveActivity(candidateActivity)) {
    return null;
  }

  const candidateInterval = parseTimeString(candidateActivity.time);
  if (candidateInterval.isAllDay) {
    return null;
  }

  // Build lookup map if allActivities is an array
  const activityMap = Array.isArray(allActivities)
    ? allActivities.reduce((acc, act) => {
        acc[act.id || act.title] = act;
        return acc;
      }, {})
    : allActivities;

  for (const selectedId of selectedIds) {
    // Ignore self-comparison
    if (selectedId === candidateActivity.id || selectedId === candidateActivity.title) {
      continue;
    }

    const selectedActivity = activityMap[selectedId];
    if (!selectedActivity) continue;

    // Different calendar dates never conflict
    if (selectedActivity.day !== candidateActivity.day) {
      continue;
    }

    // Skip non-exclusive activities
    if (isNonExclusiveActivity(selectedActivity)) {
      continue;
    }

    const selectedInterval = parseTimeString(selectedActivity.time);
    if (doIntervalsOverlap(candidateInterval, selectedInterval)) {
      return selectedActivity;
    }
  }

  return null;
}

/**
 * Formats a clean, professional error message for a conflict.
 *
 * @param {object} candidateActivity
 * @param {object} conflictingActivity
 * @returns {string}
 */
export function formatConflictMessage(candidateActivity, conflictingActivity) {
  return `Schedule conflict: "${candidateActivity.title}" (${candidateActivity.time}) overlaps with your selected "${conflictingActivity.title}" (${conflictingActivity.time}). Please choose one activity.`;
}
