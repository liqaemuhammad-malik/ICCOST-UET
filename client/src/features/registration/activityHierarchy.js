import { defaultSchedule } from '@/features/shared/scheduleData';

/**
 * Official ICOSST 2026 Conference Schedule Categories Hierarchy
 * 
 * Maps Conference Day -> Event Categories -> Sessions/Activities
 * Each category links to the canonical activity ID in defaultSchedule
 * so existing backend database APIs, payment flows, and validation remain 100% intact.
 */

export const day1Categories = [
  {
    id: 'cat-d1-opening',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Opening Ceremony',
    time: '09:30–11:00',
    venue: 'Transport Seminar Hall',
    track: 'Opening',
    badge: 'Ceremony',
    activityId: 'd1-opening',
    sessions: [
      {
        id: 'd1-opening',
        title: 'Opening Ceremony & Keynote Address',
        time: '09:30–11:00',
        venue: 'Transport Seminar Hall',
        speaker: 'ICOSST Organizing Committee & UET Leadership',
        track: 'Opening',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d1-exhibition',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Industrial Projects Exhibition',
    time: 'All day',
    venue: 'Main Auditorium Corridor',
    track: 'Exhibition',
    badge: 'Parallel Expo',
    activityId: 'd1-exhibition',
    isParallel: true,
    sessions: [
      {
        id: 'd1-exhibition',
        title: 'Industrial Projects Exhibition (All-Day Expo)',
        time: 'All day',
        venue: 'Main Auditorium Corridor',
        speaker: 'Industry Partners & Exhibitors',
        track: 'Exhibition',
        isMain: true,
        isParallel: true,
      },
    ],
  },
  {
    id: 'cat-d1-track1a',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Track 1A — Invited Talks',
    time: '11:00–13:00',
    venue: 'UET Main Auditorium · CR2 Room',
    track: 'Session I',
    badge: 'Invited Talks',
    activityId: 'd1-talk-1',
    sessions: [
      {
        id: 'd1-talk-1',
        title: 'Track 1A · Invited Talks (All 3 Keynotes)',
        time: '11:00–13:00',
        venue: 'UET Main Auditorium · CR2 Room',
        speaker: 'Talks 1–3 · Invited Keynote Speakers',
        track: 'Session I',
        isMain: true,
        subSessions: [
          { title: 'Talk 1 · Keynote: Edge Intelligence & Distributed Computing Systems', speaker: 'Invited Keynote Speaker 1', time: '11:00–11:40', venue: 'CR2 Room' },
          { title: 'Talk 2 · Keynote: Open Source Infrastructure & Scalable LLM Deployments', speaker: 'Invited Keynote Speaker 2', time: '11:40–12:20', venue: 'CR2 Room' },
          { title: 'Talk 3 · Keynote: Cyber Resilience & Microservice Zero-Trust Architectures', speaker: 'Invited Keynote Speaker 3', time: '12:20–13:00', venue: 'CR2 Room' },
        ],
      },
    ],
  },
  {
    id: 'cat-d1-track1b',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Track 1B — Technical Papers',
    time: '11:00–13:00',
    venue: 'UET Main Auditorium · CR1 Room',
    track: 'Session I',
    badge: 'Technical Papers',
    activityId: 'd1-paper-1',
    sessions: [
      {
        id: 'd1-paper-1',
        title: 'Track 1B · Technical Papers (Papers 1–6)',
        time: '11:00–13:00',
        venue: 'UET Main Auditorium · CR1 Room',
        speaker: 'Papers 1–6 · Research Paper Presenters',
        track: 'Session I',
        isMain: true,
        subSessions: [
          { title: 'Paper 1–2 · AI & Intelligent Computer Vision Systems', speaker: 'Authors & Co-Authors', time: '11:00–11:40', venue: 'CR1 Room' },
          { title: 'Paper 3–4 · Decentralized Cloud & Distributed Computing', speaker: 'Authors & Co-Authors', time: '11:40–12:20', venue: 'CR1 Room' },
          { title: 'Paper 5–6 · Secure Software Engineering & Open Platforms', speaker: 'Authors & Co-Authors', time: '12:20–13:00', venue: 'CR1 Room' },
        ],
      },
    ],
  },
  {
    id: 'cat-d1-workshop1',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Workshop 1 — SaaS Development by AI',
    time: '11:00–12:20',
    venue: 'KICS-5 Room / Main Auditorium',
    track: 'Session I',
    badge: 'Workshop',
    activityId: 'd1-workshop-1',
    sessions: [
      {
        id: 'd1-workshop-1',
        title: 'Workshop 1 · SaaS Development by AI',
        time: '11:00–12:20',
        venue: 'KICS-5 Room / Main Auditorium',
        speaker: 'AI Lab Technical Facilitators',
        track: 'Session I',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d1-workshop2',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Workshop 2 — Quantum Computing',
    time: '12:20–13:30',
    venue: 'KICS-5 Room / Main Auditorium',
    track: 'Session I',
    badge: 'Workshop',
    activityId: 'd1-workshop-2',
    sessions: [
      {
        id: 'd1-workshop-2',
        title: 'Workshop 2 · Quantum Computing',
        time: '12:20–13:30',
        venue: 'KICS-5 Room / Main Auditorium',
        speaker: 'Quantum Computing Research Facilitator',
        track: 'Session I',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d1-track2a',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Track 2A — Invited Talks',
    time: '14:00–16:00',
    venue: 'UET Main Auditorium · CR2 Room',
    track: 'Session II',
    badge: 'Invited Talks',
    activityId: 'd1-talk-2',
    sessions: [
      {
        id: 'd1-talk-2',
        title: 'Track 2A · Invited Talks (Talks 4–6)',
        time: '14:00–16:00',
        venue: 'UET Main Auditorium · CR2 Room',
        speaker: 'Talks 4–6 · Invited Keynote Speakers',
        track: 'Session II',
        isMain: true,
        subSessions: [
          { title: 'Talk 4 · Keynote: Safe AI & Multimodal Agent Frameworks', speaker: 'Invited Keynote Speaker 4', time: '14:00–14:40', venue: 'CR2 Room' },
          { title: 'Talk 5 · Keynote: High-Performance Distributed Open Source Systems', speaker: 'Invited Keynote Speaker 5', time: '14:40–15:20', venue: 'CR2 Room' },
          { title: 'Talk 6 · Keynote: Autonomous Edge Sensors and IoT Security', speaker: 'Invited Keynote Speaker 6', time: '15:20–16:00', venue: 'CR2 Room' },
        ],
      },
    ],
  },
  {
    id: 'cat-d1-track2b',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Track 2B — Technical Papers',
    time: '14:00–16:00',
    venue: 'UET Main Auditorium · CR1 Room',
    track: 'Session II',
    badge: 'Technical Papers',
    activityId: 'd1-paper-2',
    sessions: [
      {
        id: 'd1-paper-2',
        title: 'Track 2B · Technical Papers (Papers 8–14)',
        time: '14:00–16:00',
        venue: 'UET Main Auditorium · CR1 Room',
        speaker: 'Papers 8–14 · Research Paper Presenters',
        track: 'Session II',
        isMain: true,
        subSessions: [
          { title: 'Papers 8–10 · NLP, Large Language Models & Speech', speaker: 'Authors & Co-Authors', time: '14:00–14:40', venue: 'CR1 Room' },
          { title: 'Papers 11–12 · Cryptography & Blockchain Infrastructure', speaker: 'Authors & Co-Authors', time: '14:40–15:20', venue: 'CR1 Room' },
          { title: 'Papers 13–14 · Cyber-Physical Systems & Cloud Networks', speaker: 'Authors & Co-Authors', time: '15:20–16:00', venue: 'CR1 Room' },
        ],
      },
    ],
  },
  {
    id: 'cat-d1-workshop3',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Workshop 3 — Generative AI',
    time: '14:00–16:00',
    venue: 'KICS-5 Room / Main Auditorium',
    track: 'Session II',
    badge: 'Workshop',
    activityId: 'd1-workshop-3',
    sessions: [
      {
        id: 'd1-workshop-3',
        title: 'Workshop 3 · Generative AI',
        time: '14:00–16:00',
        venue: 'KICS-5 Room / Main Auditorium',
        speaker: 'Generative AI Lab Facilitators',
        track: 'Session II',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d1-close',
    day: 'Day 1',
    date: 'Tuesday, 22 December 2026',
    title: 'Day 1 at a Glance',
    time: '16:00–16:30',
    venue: 'Transport Seminar Hall',
    track: 'Closing note',
    badge: 'Summary',
    activityId: 'd1-close',
    isInformational: true,
    sessions: [
      {
        id: 'd1-close',
        title: 'Day 1 at a Glance (Daily Wrap-Up)',
        time: '16:00–16:30',
        venue: 'Transport Seminar Hall',
        speaker: '6 invited talks · 7 technical papers · 3 workshops',
        track: 'Closing note',
        isMain: true,
        isInformational: true,
      },
    ],
  },
];

export const day2Categories = [
  {
    id: 'cat-d2-showcase',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Technofest 2026 — Innovation Showcase',
    time: '10:00–14:00',
    venue: 'Smart Classroom',
    track: 'Technofest',
    badge: 'Showcase',
    activityId: 'd2-showcase',
    sessions: [
      {
        id: 'd2-showcase',
        title: 'Technofest 2026 · Innovation Showcase',
        time: '10:00–14:00',
        venue: 'Smart Classroom',
        speaker: 'Innovation Showcase Project Teams',
        track: 'Technofest',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d2-brainiac',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Brainiac 2026 — Project Showcase Competition',
    time: '10:00–14:00',
    venue: 'Main Auditorium Corridor',
    track: 'Competition',
    badge: 'Competition',
    activityId: 'd2-brainiac',
    sessions: [
      {
        id: 'd2-brainiac',
        title: 'Brainiac 2026 · Project Showcase Competition',
        time: '10:00–14:00',
        venue: 'Main Auditorium Corridor',
        speaker: 'Brainiac 2026 Finalist Teams',
        track: 'Competition',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d2-ncai',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'NCAI Team Workshop',
    time: '09:00–10:00',
    venue: 'KICS-5 Room / Main Auditorium',
    track: 'Workshop / Competitions',
    badge: 'Workshop',
    activityId: 'd2-workshop',
    sessions: [
      {
        id: 'd2-workshop',
        title: 'NCAI Team Workshop',
        time: '09:00–10:00',
        venue: 'KICS-5 Room / Main Auditorium',
        speaker: 'National Center of Artificial Intelligence (NCAI)',
        track: 'Workshop / Competitions',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d2-gaming',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Gaming Competition',
    time: '10:00–11:20',
    venue: 'KICS-5 Room',
    track: 'Workshop / Competitions',
    badge: 'Competition',
    activityId: 'd2-gaming',
    sessions: [
      {
        id: 'd2-gaming',
        title: 'Gaming Competition',
        time: '10:00–11:20',
        venue: 'KICS-5 Room',
        speaker: 'Gaming Tournament Participants',
        track: 'Workshop / Competitions',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d2-speed',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Speed Programming',
    time: '11:20–12:40',
    venue: 'KICS-5 Room',
    track: 'Workshop / Competitions',
    badge: 'Competition',
    activityId: 'd2-speed',
    sessions: [
      {
        id: 'd2-speed',
        title: 'Speed Programming',
        time: '11:20–12:40',
        venue: 'KICS-5 Room',
        speaker: 'Speed Programming Competitors',
        track: 'Workshop / Competitions',
        isMain: true,
      },
    ],
  },
  {
    id: 'cat-d2-track3a',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Track 3A — Invited Talks',
    time: '10:00–12:00',
    venue: 'UET Main Auditorium · CR2 Room',
    track: 'Session III',
    badge: 'Invited Talks',
    activityId: 'd2-talks',
    sessions: [
      {
        id: 'd2-talks',
        title: 'Track 3A · Invited Talks (Talks 7–10)',
        time: '10:00–12:00',
        venue: 'UET Main Auditorium · CR2 Room',
        speaker: 'Talks 7–10 · Invited Keynote Speakers',
        track: 'Session III',
        isMain: true,
        subSessions: [
          { title: 'Talk 7 · Keynote: Ethical AI & Algorithmic Accountability', speaker: 'Invited Keynote Speaker 7', time: '10:00–10:30', venue: 'CR2 Room' },
          { title: 'Talk 8 · Keynote: Cyber Security in Critical Infrastructure', speaker: 'Invited Keynote Speaker 8', time: '10:30–11:00', venue: 'CR2 Room' },
          { title: 'Talk 9 · Keynote: High-Performance Heterogeneous Computing', speaker: 'Invited Keynote Speaker 9', time: '11:00–11:30', venue: 'CR2 Room' },
          { title: 'Talk 10 · Keynote: Open Source Scientific Computing Frameworks', speaker: 'Invited Keynote Speaker 10', time: '11:30–12:00', venue: 'CR2 Room' },
        ],
      },
    ],
  },
  {
    id: 'cat-d2-track3b',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Track 3B — Technical Papers',
    time: '10:00–12:00',
    venue: 'UET Main Auditorium · CR1 Room',
    track: 'Session III',
    badge: 'Technical Papers',
    activityId: 'd2-papers',
    sessions: [
      {
        id: 'd2-papers',
        title: 'Track 3B · Technical Papers (Papers 15–23)',
        time: '10:00–12:00',
        venue: 'UET Main Auditorium · CR1 Room',
        speaker: 'Papers 15–23 · Research Paper Presenters',
        track: 'Session III',
        isMain: true,
        subSessions: [
          { title: 'Papers 15–17 · Machine Learning & Optimization', speaker: 'Authors & Co-Authors', time: '10:00–10:40', venue: 'CR1 Room' },
          { title: 'Papers 18–20 · Software Testing & Quality Assurance', speaker: 'Authors & Co-Authors', time: '10:40–11:20', venue: 'CR1 Room' },
          { title: 'Papers 21–23 · Embedded & Distributed Systems', speaker: 'Authors & Co-Authors', time: '11:20–12:00', venue: 'CR1 Room' },
        ],
      },
    ],
  },
  {
    id: 'cat-d2-closing',
    day: 'Day 2',
    date: 'Wednesday, 23 December 2026',
    title: 'Conference Closing & Prize Distribution',
    time: '14:00–16:30',
    venue: 'Transport Seminar Hall',
    track: 'Session IV',
    badge: 'Awards Ceremony',
    activityId: 'd2-closing',
    sessions: [
      {
        id: 'd2-closing',
        title: 'Conference Closing & Prize Distribution',
        time: '14:00–16:30',
        venue: 'Transport Seminar Hall',
        speaker: 'Brainiac & Technofest awards · group photo and tea',
        track: 'Session IV',
        isMain: true,
      },
    ],
  },
];

/**
 * Returns all categories for a given conference day
 */
export function getCategoriesForDay(day) {
  return day === 'Day 2' ? day2Categories : day1Categories;
}

/**
 * Finds a category by its unique ID
 */
export function getCategoryById(categoryId) {
  return [...day1Categories, ...day2Categories].find((c) => c.id === categoryId) || null;
}

/**
 * Returns whether any activity in a category is currently selected
 */
export function isCategorySelected(category, selectedActivityIds = []) {
  if (!category || !category.sessions) return false;
  return category.sessions.some(
    (s) => selectedActivityIds.includes(s.id) || selectedActivityIds.includes(s.title)
  );
}

/**
 * Returns the count of selected activities in a category
 */
export function getCategorySelectedCount(category, selectedActivityIds = []) {
  if (!category || !category.sessions) return 0;
  return category.sessions.filter(
    (s) => selectedActivityIds.includes(s.id) || selectedActivityIds.includes(s.title)
  ).length;
}

/**
 * Returns the total count of selected activities for a day
 */
export function getDaySelectedCount(day, selectedActivityIds = []) {
  const categories = getCategoriesForDay(day);
  return categories.reduce((total, cat) => total + getCategorySelectedCount(cat, selectedActivityIds), 0);
}

/**
 * Finds the canonical activity object for an ID from defaultSchedule
 */
export function findActivityInSchedule(activityId) {
  return defaultSchedule.find((a) => a.id === activityId || a.title === activityId) || null;
}
