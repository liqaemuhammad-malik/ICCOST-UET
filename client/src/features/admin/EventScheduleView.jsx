import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Edit3, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSettingsApi, updateSettingApi } from '@/api/settings';
import { defaultSchedule, emptyScheduleItem, normalizeSchedule } from '@/features/shared/scheduleData';

const fields = [['day', 'Day'], ['date', 'Date'], ['time', 'Time'], ['title', 'Event title'], ['track', 'Track / group'], ['venue', 'Venue'], ['speaker', 'Speaker / host']];

export function EventScheduleView() {
  const [sessions, setSessions] = useState(defaultSchedule);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('All days');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSettingsApi().then((res) => {
      const setting = res.data?.find((item) => item.key === 'EVENT_SCHEDULE');
      if (setting?.value) setSessions(normalizeSchedule(setting.value));
    }).catch(() => setStatus('Showing the built-in timetable until the server is available.'));
  }, []);

  const filtered = useMemo(() => sessions.filter((item) => {
    const text = `${item.title} ${item.track} ${item.venue} ${item.speaker}`.toLowerCase();
    return (day === 'All days' || item.day === day) && text.includes(query.toLowerCase());
  }), [sessions, query, day]);
  const updateSession = (index, key, value) => setSessions((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addSession = () => { const next = sessions.length; setSessions((items) => [...items, { ...emptyScheduleItem, id: `new-${Date.now()}` }]); setEditing(next); };
  const removeSession = (index) => { setSessions((items) => items.filter((_, itemIndex) => itemIndex !== index)); setEditing(null); };
  const save = async (event) => {
    event.preventDefault();
    setStatus('Publishing timetable…');
    try { await updateSettingApi('EVENT_SCHEDULE', sessions, 'Complete ICOSST 2026 programme with editable event details.'); setStatus('Timetable published. All portals now use the updated schedule.'); }
    catch (error) { setStatus(error.response?.data?.error?.message || 'Unable to publish the timetable.'); }
  };

  return <form onSubmit={save} className="space-y-6">
    <div className="overflow-hidden rounded-2xl bg-[#062c57] p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-amber-300"><CalendarDays className="h-4 w-4" /><span className="text-[11px] font-bold uppercase tracking-[0.2em]">Programme control centre</span></div><h1 className="font-heading text-2xl font-extrabold sm:text-3xl">Events &amp; venue timetable</h1><p className="mt-2 max-w-2xl text-sm text-slate-200">Manage every ICOSST session from one place. Changes published here are reflected on the public schedule and every participant dashboard.</p></div><div className="flex gap-2"><Badge className="border-white/20 bg-white/10 text-white">{sessions.length} events</Badge><Badge className="border-white/20 bg-emerald-500/20 text-emerald-200">Live sync</Badge></div></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, track, venue or speaker" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900" /></div><div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">{['All days', 'Day 1', 'Day 2'].map((item) => <button key={item} type="button" onClick={() => setDay(item)} className={`rounded-md px-3 py-1.5 text-xs font-bold ${day === item ? 'bg-[#062c57] text-white' : 'text-slate-500'}`}>{item}</button>)}</div></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"><div className="hidden grid-cols-[1.1fr_1fr_1.6fr_1.3fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 sm:grid"><span>When</span><span>Event</span><span>Track / venue</span><span>Speaker / host</span><span>Status</span><span>Actions</span></div><div className="divide-y divide-slate-100 dark:divide-slate-800">{filtered.map((session) => { const index = sessions.indexOf(session); return <div key={session.id || index} className="grid gap-3 px-5 py-4 sm:grid-cols-[1.1fr_1fr_1.6fr_1.3fr_1fr_auto] sm:items-center sm:gap-4"><div><p className="text-xs font-extrabold text-[#062c57] dark:text-emerald-300">{session.day}</p><p className="text-[11px] font-semibold text-slate-500">{session.date}</p><p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{session.time}</p></div><div><p className="font-heading text-sm font-extrabold text-slate-900 dark:text-white">{session.title || 'Untitled event'}</p><Badge variant="outline" className="mt-1 text-[10px]">{session.track}</Badge></div><p className="text-xs text-slate-600 dark:text-slate-300">{session.venue}</p><p className="text-xs text-slate-600 dark:text-slate-300">{session.speaker || '—'}</p><Badge variant={session.title ? 'success' : 'warning'} className="w-fit text-[10px]">{session.title ? 'Published' : 'Needs details'}</Badge><div className="flex gap-1 sm:justify-end"><Button type="button" size="icon" variant="outline" onClick={() => setEditing(index)} aria-label={`Edit ${session.title}`}><Edit3 className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" onClick={() => removeSession(index)} aria-label={`Remove ${session.title}`} className="text-rose-600"><Trash2 className="h-4 w-4" /></Button></div></div>; })}</div>{!filtered.length && <div className="p-10 text-center text-sm text-slate-500">No events match the current filters.</div>}</div>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><Button type="button" variant="outline" onClick={addSession} className="gap-2"><Plus className="h-4 w-4" />Add event</Button>{status && <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{status}</p>}</div><Button type="submit" className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"><Save className="h-4 w-4" />Publish complete timetable</Button></div>

    {editing !== null && sessions[editing] && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label="Edit event details"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Editing event {editing + 1}</p><h2 className="mt-1 font-heading text-xl font-extrabold text-slate-900 dark:text-white">Event details</h2><p className="mt-1 text-xs text-slate-500">Update the fields below, then publish the complete timetable.</p></div><Button type="button" size="icon" variant="ghost" onClick={() => setEditing(null)} aria-label="Close editor"><X className="h-5 w-5" /></Button></div><div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="space-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"><span>{label}</span><input value={sessions[editing][key] || ''} onChange={(e) => updateSession(editing, key, e.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" required={['title', 'date', 'time', 'venue'].includes(key)} /></label>)}</div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="button" className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => setEditing(null)}><Check className="h-4 w-4" />Save event changes</Button></div></div></div>}
  </form>;
}
