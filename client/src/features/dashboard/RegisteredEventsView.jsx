import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, Clock3, MapPin, TimerReset } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useConferenceSchedule } from '@/features/shared/ConferenceTimetable';
import { defaultPortalTheme, portalThemes } from './portalThemes';

const categoryEventIds = {
  ATTENDEE_PARTICIPANT: ['d1-opening', 'd1-exhibition', 'd1-talk-1', 'd2-showcase', 'd2-closing'],
  PAPER_PRESENTER: ['d1-opening', 'd1-paper-1', 'd1-paper-2', 'd2-papers', 'd2-closing'],
  PRESENTER_CO_PRESENTER: ['d1-opening', 'd1-paper-1', 'd1-paper-2', 'd2-papers', 'd2-closing'],
  WORKSHOP_PRESENTER: ['d1-opening', 'd1-workshop-1', 'd1-workshop-2', 'd1-workshop-3', 'd2-closing'],
  INVITED_SPEAKER: ['d1-opening', 'd1-talk-1', 'd2-talks', 'd2-closing'],
  ORGANIZER: ['d1-opening', 'd1-exhibition', 'd1-close', 'd2-showcase', 'd2-brainiac', 'd2-closing'],
  MEDIA_PERSON: ['d1-opening', 'd1-exhibition', 'd2-showcase', 'd2-closing'],
};

function eventStart(event) {
  const date = event.date?.includes('23') ? '2026-12-23' : '2026-12-22';
  const time = event.time?.match(/\d{1,2}:\d{2}/)?.[0] || '00:00';
  return new Date(`${date}T${time}:00+05:00`);
}

function EventCountdown({ event }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const remaining = Math.max(0, eventStart(event).getTime() - now);
  if (remaining === 0) return <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 px-4 py-3 text-xs text-emerald-100 shadow-inner"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />Event day / started</div>;
  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const blocks = [['DAYS', days], ['HRS', hours], ['MIN', minutes], ['SEC', secs]];
  return <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#031a35] via-[#062c57] to-slate-900 p-3 text-white shadow-[0_10px_25px_-12px_rgba(3,26,53,0.8)]"><div className="mb-2 flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-300">Live countdown</span><span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />Updating</span></div><div className="grid grid-cols-4 gap-1.5">{blocks.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.08] px-1 py-2 text-center shadow-inner"><div className="font-mono text-xl font-bold leading-none tracking-tight text-white sm:text-2xl">{String(value).padStart(2, '0')}</div><div className="mt-1 text-[8px] font-semibold tracking-[0.16em] text-slate-400">{label}</div></div>)}</div></div>;
}

function getRegisteredEvents(schedule, user) {
  const explicit = user?.registeredEvents || user?.profile?.registeredEvents;
  if (Array.isArray(explicit) && explicit.length) return schedule.filter((event) => explicit.includes(event.id) || explicit.includes(event.title) || explicit.some((item) => item?.id === event.id || item?.title === event.title));
  const ids = categoryEventIds[user?.category || user?.profile?.categoryCode] || categoryEventIds.ATTENDEE_PARTICIPANT;
  return schedule.filter((event) => ids.includes(event.id));
}

export function RegisteredEventsView() {
  const { user } = useAuthStore();
  const schedule = useConferenceSchedule();
  const registered = useMemo(() => getRegisteredEvents(schedule, user), [schedule, user]);
  const theme = portalThemes[user?.category || user?.profile?.categoryCode] || defaultPortalTheme;
  return <div className="space-y-6">
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${theme.shell} p-6 text-white shadow-lg`}><div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" /><div className="relative flex items-start gap-3"><div className="rounded-xl bg-white/10 p-3"><CalendarCheck2 className="h-6 w-6 text-white" /></div><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">{theme.eyebrow}</p><h1 className="mt-1 font-heading text-2xl font-extrabold">My registered events</h1><p className="mt-2 text-sm text-white/80">Your confirmed event access, live countdowns, times, and venues in one view.</p></div></div></div>
    <div className="grid gap-4 md:grid-cols-2">{registered.map((event) => <article key={event.id} className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 ${theme.card}`}><div className="flex items-start justify-between gap-3"><div><Badge className={`mb-2 text-[10px] ${theme.soft} ${theme.accent}`}>Registered</Badge><h2 className="font-heading text-base font-extrabold text-slate-900 dark:text-white">{event.title}</h2><p className={`mt-1 text-[11px] font-semibold ${theme.accent}`}>{event.track}</p></div><TimerReset className="h-5 w-5 shrink-0 text-amber-500 transition group-hover:rotate-45" /></div><div className="mt-4 grid gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="flex items-center gap-2"><Clock3 className={`h-4 w-4 ${theme.icon}`} />{event.date} · {event.time}</span><span className="flex items-center gap-2"><MapPin className={`h-4 w-4 ${theme.icon}`} />{event.venue}</span></div><div className="mt-4"><EventCountdown event={event} /></div></article>)}</div>
  </div>;
}
