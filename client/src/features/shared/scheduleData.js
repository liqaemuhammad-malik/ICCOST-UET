export const defaultSchedule = [
  { id: 'd1-opening', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '09:30–11:00', title: 'Opening Ceremony', track: 'Opening', venue: 'Transport Seminar Hall', speaker: 'ICOSST Organizing Committee', color: 'navy' },
  { id: 'd1-exhibition', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: 'All day', title: 'Industrial Projects Exhibition', track: 'Exhibition', venue: 'Main Auditorium Corridor', speaker: 'Runs in parallel with Day 1 sessions', color: 'mint' },
  { id: 'd1-talk-1', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '11:00–13:00', title: 'Track 1A · Invited Talks', track: 'Session I', venue: 'UET Main Auditorium · CR2 Room', speaker: 'Talks 1–3 · Invited speakers', color: 'blue' },
  { id: 'd1-paper-1', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '11:00–13:00', title: 'Track 1B · Technical Papers', track: 'Session I', venue: 'UET Main Auditorium · CR1 Room', speaker: 'Papers 1–6 · Paper presenters', color: 'blue' },
  { id: 'd1-workshop-1', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '11:00–12:20', title: 'Workshop 1 · SaaS Development by AI', track: 'Session I', venue: 'KICS-5 Room / Main Auditorium', speaker: 'Workshop facilitator', color: 'pink' },
  { id: 'd1-workshop-2', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '12:20–13:30', title: 'Workshop 2 · Quantum Computing', track: 'Session I', venue: 'KICS-5 Room / Main Auditorium', speaker: 'Workshop facilitator', color: 'pink' },
  { id: 'd1-talk-2', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '14:00–16:00', title: 'Track 2A · Invited Talks', track: 'Session II', venue: 'UET Main Auditorium · CR2 Room', speaker: 'Talks 4–6 · Invited speakers', color: 'blue' },
  { id: 'd1-paper-2', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '14:00–16:00', title: 'Track 2B · Technical Papers', track: 'Session II', venue: 'UET Main Auditorium · CR1 Room', speaker: 'Papers 8–14 · Paper presenters', color: 'blue' },
  { id: 'd1-workshop-3', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '14:00–16:00', title: 'Workshop 3 · Generative AI', track: 'Session II', venue: 'KICS-5 Room / Main Auditorium', speaker: 'Workshop facilitator', color: 'pink' },
  { id: 'd1-close', day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '16:00–16:30', title: 'Day 1 at a Glance', track: 'Closing note', venue: 'Transport Seminar Hall', speaker: '6 invited talks · 7 technical papers · 3 workshops', color: 'gold' },
  { id: 'd2-showcase', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '10:00–14:00', title: 'Technofest 2026 · Innovation Showcase', track: 'Technofest', venue: 'Smart Classroom', speaker: 'Innovation showcase teams', color: 'mint' },
  { id: 'd2-brainiac', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '10:00–14:00', title: 'Brainiac 2026 · Project Showcase Competition', track: 'Competition', venue: 'Main Auditorium Corridor', speaker: 'Student project teams', color: 'pink' },
  { id: 'd2-workshop', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '09:00–10:00', title: 'NCAI Team Workshop', track: 'Workshop / Competitions', venue: 'KICS-5 Room / Main Auditorium', speaker: 'NCAI team', color: 'peach' },
  { id: 'd2-gaming', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '10:00–11:20', title: 'Gaming Competition', track: 'Workshop / Competitions', venue: 'KICS-5 Room', speaker: 'Competition participants', color: 'peach' },
  { id: 'd2-speed', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '11:20–12:40', title: 'Speed Programming', track: 'Workshop / Competitions', venue: 'KICS-5 Room', speaker: 'Competition participants', color: 'peach' },
  { id: 'd2-talks', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '10:00–12:00', title: 'Track 3A · Invited Talks', track: 'Session III', venue: 'UET Main Auditorium · CR2 Room', speaker: 'Talks 7–10 · Invited speakers', color: 'blue' },
  { id: 'd2-papers', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '10:00–12:00', title: 'Track 3B · Technical Papers', track: 'Session III', venue: 'UET Main Auditorium · CR1 Room', speaker: 'Papers 15–23 · Paper presenters', color: 'blue' },
  { id: 'd2-closing', day: 'Day 2', date: 'Wednesday, 23 December 2026', time: '14:00–16:30', title: 'Conference Closing & Prize Distribution', track: 'Session IV', venue: 'Transport Seminar Hall', speaker: 'Brainiac & Technofest awards · group photo and tea', color: 'lilac' },
];

export const emptyScheduleItem = {
  day: 'Day 1', date: 'Tuesday, 22 December 2026', time: '09:00–10:00', title: '', track: 'New event', venue: '', speaker: '', description: '', color: 'blue',
};

export function normalizeSchedule(value) {
  return Array.isArray(value) && value.length ? value : defaultSchedule;
}
