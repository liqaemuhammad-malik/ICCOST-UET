import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock3, MapPin, UserRound } from 'lucide-react';
import { getSettingsApi } from '@/api/settings';

const fallbackSchedule = [
  { day: 'Day 1', date: '22 December 2026', time: '09:00–10:00', title: 'Opening Ceremony & Keynote', venue: 'KICS Main Auditorium', speaker: 'ICOSST Steering Committee', description: '' },
  { day: 'Day 1', date: '22 December 2026', time: '10:30–12:00', title: 'Technical Track Sessions', venue: 'Session Hall A', speaker: '', description: '' },
  { day: 'Day 2', date: '23 December 2026', time: '09:30–11:00', title: 'Research Presentations', venue: 'Session Hall B', speaker: '', description: '' },
];

export function PublicScheduleView() {
  const [sessions, setSessions] = useState(fallbackSchedule);
  useEffect(() => { getSettingsApi().then((res) => { const setting = res.data?.find((item) => item.key === 'EVENT_SCHEDULE'); if (Array.isArray(setting?.value) && setting.value.length) setSessions(setting.value); }).catch(() => {}); }, []);
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">ICOSST 2026 Programme</p><h1 className="mt-2 text-3xl font-bold font-heading">Events, Sessions &amp; Venues</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Explore the published conference timetable and find the correct hall for every event.</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        {sessions.map((session, index) => <article key={`${session.date}-${session.time}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">{session.day}</p><h2 className="mt-1 text-lg font-bold">{session.title}</h2></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">{session.date}</span></div><div className="mt-4 grid gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-emerald-600" />{session.time}</span><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" />{session.venue}</span>{session.speaker && <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-emerald-600" />{session.speaker}</span>}</div>{session.description && <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500 dark:border-slate-800">{session.description}</p>}</article>)}
      </div>
    </div>
  );
}
