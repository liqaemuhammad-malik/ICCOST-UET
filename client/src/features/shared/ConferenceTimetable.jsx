import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Sparkles, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSettingsApi } from '@/api/settings';
import { normalizeSchedule } from './scheduleData';

const colorClasses = {
  navy: 'border-l-slate-900 bg-slate-50', mint: 'border-l-emerald-500 bg-emerald-50/70', blue: 'border-l-sky-500 bg-sky-50/70', pink: 'border-l-fuchsia-500 bg-fuchsia-50/70', peach: 'border-l-orange-400 bg-orange-50/80', gold: 'border-l-amber-500 bg-amber-50/80', lilac: 'border-l-violet-500 bg-violet-50/80',
};

const visualThemes = {
  ATTENDEE_PARTICIPANT: { hero: 'bg-gradient-to-br from-[#062c57] via-[#075985] to-emerald-900', glow: 'bg-emerald-300/20', active: 'bg-emerald-700', line: 'bg-emerald-200/30', label: 'text-emerald-200' },
  ORGANIZER: { hero: 'bg-gradient-to-br from-slate-950 via-slate-800 to-cyan-900', glow: 'bg-cyan-300/20', active: 'bg-cyan-700', line: 'bg-cyan-200/30', label: 'text-cyan-200' },
  WORKSHOP_PRESENTER: { hero: 'bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900', glow: 'bg-fuchsia-300/20', active: 'bg-violet-700', line: 'bg-fuchsia-200/30', label: 'text-fuchsia-200' },
  MEDIA_PERSON: { hero: 'bg-gradient-to-br from-rose-950 via-pink-900 to-orange-800', glow: 'bg-orange-300/20', active: 'bg-rose-700', line: 'bg-orange-200/30', label: 'text-orange-200' },
  INVITED_SPEAKER: { hero: 'bg-gradient-to-br from-amber-950 via-orange-800 to-red-900', glow: 'bg-amber-300/20', active: 'bg-amber-700', line: 'bg-amber-200/30', label: 'text-amber-200' },
  PRESENTER_CO_PRESENTER: { hero: 'bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-900', glow: 'bg-cyan-300/20', active: 'bg-indigo-700', line: 'bg-cyan-200/30', label: 'text-cyan-200' },
  PAPER_PRESENTER: { hero: 'bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-900', glow: 'bg-emerald-300/20', active: 'bg-teal-700', line: 'bg-emerald-200/30', label: 'text-emerald-200' },
};

export function useConferenceSchedule() {
  const [schedule, setSchedule] = useState(normalizeSchedule());
  useEffect(() => {
    getSettingsApi().then((res) => {
      const setting = res.data?.find((item) => item.key === 'EVENT_SCHEDULE');
      if (setting?.value) setSchedule(normalizeSchedule(setting.value));
    }).catch(() => {});
  }, []);
  return schedule;
}

export function ConferenceTimetable({ compact = false, title = 'Complete conference timetable', themeKey = 'ATTENDEE_PARTICIPANT' }) {
  const schedule = useConferenceSchedule();
  const theme = visualThemes[themeKey] || visualThemes.ATTENDEE_PARTICIPANT;
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('All days');
  const filtered = useMemo(() => schedule.filter((item) => {
    const matchesDay = day === 'All days' || item.day === day;
    const text = `${item.title} ${item.track} ${item.venue} ${item.speaker}`.toLowerCase();
    return matchesDay && text.includes(query.toLowerCase());
  }), [schedule, day, query]);
  const groups = ['Day 1', 'Day 2'].map((group) => ({ day: group, items: filtered.filter((item) => item.day === group) })).filter((group) => group.items.length);

  return <section className={compact ? 'mt-6' : 'container mx-auto max-w-7xl px-4 py-10'}>
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900">
      <div className={`relative overflow-hidden px-5 py-7 text-white shadow-inner sm:px-8 ${theme.hero}`}>
        <div className={`absolute -right-16 -top-24 h-56 w-56 rounded-full blur-3xl ${theme.glow}`} />
        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><div className={`mb-2 flex items-center gap-2 ${theme.label}`}><Sparkles className="h-4 w-4" /><span className="text-[11px] font-bold uppercase tracking-[0.22em]">ICOSST 2026 · Premium programme</span></div><h2 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2><p className="mt-2 max-w-2xl text-sm text-slate-200">20th IEEE International Conference on Open Source Systems and Technologies · 22–23 December 2026 · UET Lahore</p></div>
          <div className="flex flex-wrap gap-2 text-xs"><Badge className="border-white/20 bg-white/10 text-white shadow-sm">{schedule.length} events</Badge><Badge className="border-white/20 bg-white/10 text-white shadow-sm">2 days</Badge></div>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search event, track, venue..." className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900" /></div>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-900">{['All days', 'Day 1', 'Day 2'].map((item) => <button key={item} type="button" onClick={() => setDay(item)} className={`rounded-md px-3 py-1.5 font-semibold transition ${day === item ? `${theme.active} text-white shadow-sm` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{item}</button>)}</div>
      </div>
      <div className="space-y-7 p-4 sm:p-6">{groups.map((group) => <div key={group.day}><div className="mb-3 flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold text-white shadow-sm ${theme.active}`}>{group.day.replace('Day ', 'D')}</div><div><p className="text-sm font-extrabold text-slate-900 dark:text-white">{group.day}</p><p className="text-[11px] text-slate-500">{group.items[0].date}</p></div><div className={`h-px flex-1 ${theme.line}`} /></div><div className="grid gap-3 lg:grid-cols-2">{group.items.map((item) => <article key={item.id || `${item.title}-${item.time}`} className={`rounded-2xl border border-slate-200 border-l-4 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 ${colorClasses[item.color] || colorClasses.blue}`}><div className="flex items-start justify-between gap-3"><div><Badge variant="outline" className="mb-2 bg-white/70 text-[10px] uppercase tracking-wide dark:bg-slate-900/60">{item.track}</Badge><h3 className="font-heading text-sm font-extrabold text-slate-900 dark:text-white">{item.title}</h3></div><span className="shrink-0 rounded-lg bg-white/80 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm dark:bg-slate-900/60 dark:text-slate-200">{item.time}</span></div><div className="mt-3 grid gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 sm:grid-cols-2"><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600" />{item.venue}</span><span className="flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5 text-emerald-600" />{item.speaker || 'All registered delegates'}</span></div></article>)}</div></div>)}{!groups.length && <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No timetable events match your search.</div>}</div>
    </div>
  </section>;
}
