import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, TimerReset } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getMyRegistrationApi } from '@/api/registration';
import { useConferenceSchedule } from '@/features/shared/ConferenceTimetable';
import { defaultPortalTheme } from './portalThemes';

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

export function RegisteredEventsView() {
  const schedule = useConferenceSchedule();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMyRegistrationApi().then((res) => setRegistration(res?.data || null)).catch(() => setRegistration(null)).finally(() => setLoading(false));
  }, []);
  const registered = useMemo(() => {
    const selected = registration?.selectedActivities || [];
    return schedule.filter((event) => selected.includes(event.id) || selected.includes(event.title));
  }, [schedule, registration]);
  const theme = defaultPortalTheme;
  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div>;
  return <div className="space-y-6">
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${theme.shell} p-6 text-white shadow-lg`}><div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" /><div className="relative flex items-start gap-3"><div className="rounded-xl bg-white/10 p-3"><CalendarCheck2 className="h-6 w-6 text-white" /></div><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">{theme.eyebrow}</p><h1 className="mt-1 font-heading text-2xl font-extrabold">My registered events</h1><p className="mt-2 text-sm text-white/80">Only countdowns for the events selected in your registration are shown here.</p></div></div></div>
    {!registration && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900">Complete your registration to see your event countdowns.</div>}
    {registration && !registered.length && <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">Your registration does not contain any timetable events.</div>}
    <div className="grid gap-4 md:grid-cols-2">{registered.map((event) => <article key={event.id} className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 ${theme.card}`}><div className="flex items-center justify-between gap-3"><div><Badge className={`mb-2 text-[10px] ${theme.soft} ${theme.accent}`}>Registered</Badge><h2 className="font-heading text-base font-extrabold text-slate-900 dark:text-white">{event.title}</h2></div><TimerReset className="h-5 w-5 shrink-0 text-amber-500 transition group-hover:rotate-45" /></div><div className="mt-4"><EventCountdown event={event} /></div></article>)}</div>
  </div>;
}
