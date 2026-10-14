import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSettingsApi, updateSettingApi } from '@/api/settings';

const emptySession = { day: 'Day 1', date: '22 December 2026', time: '09:00–10:00', title: '', venue: '', speaker: '', description: '' };

export function EventScheduleView() {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSettingsApi().then((res) => {
      const setting = res.data?.find((item) => item.key === 'EVENT_SCHEDULE');
      setSessions(Array.isArray(setting?.value) ? setting.value : [emptySession]);
    }).catch(() => setStatus('Unable to load the schedule.'));
  }, []);

  const updateSession = (index, key, value) => setSessions((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addSession = () => setSessions((items) => [...items, { ...emptySession }]);
  const removeSession = (index) => setSessions((items) => items.filter((_, itemIndex) => itemIndex !== index));

  const save = async (event) => {
    event.preventDefault();
    setStatus('Publishing…');
    try {
      await updateSettingApi('EVENT_SCHEDULE', sessions, 'Published conference sessions, dates, times, speakers, and venues.');
      setStatus('Schedule published successfully.');
    } catch (error) {
      setStatus(error.response?.data?.error?.message || 'Unable to publish the schedule.');
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-bold font-heading">Conference Events &amp; Venue Schedule</h2><p className="mt-1 text-xs text-slate-500">Publish sessions for each ICOSST day and assign every event to its hall or venue.</p></div>
        <Button type="button" variant="outline" onClick={addSession} className="gap-2"><Plus className="h-4 w-4" />Add Event</Button>
      </div>
      {sessions.map((session, index) => (
        <div key={`${index}-${session.title}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Event {index + 1}</p><Button type="button" variant="ghost" size="sm" onClick={() => removeSession(index)} className="text-rose-600"><Trash2 className="mr-1 h-4 w-4" />Remove</Button></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[['day', 'Conference day'], ['date', 'Date'], ['time', 'Time'], ['title', 'Event title'], ['venue', 'Hall / venue'], ['speaker', 'Speaker / host']].map(([key, label]) => (
              <div key={key} className="space-y-1.5"><Label htmlFor={`${key}-${index}`}>{label}</Label><Input id={`${key}-${index}`} value={session[key] || ''} onChange={(e) => updateSession(index, key, e.target.value)} placeholder={label} required={['date', 'time', 'title', 'venue'].includes(key)} /></div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5"><Label htmlFor={`description-${index}`}>Event description</Label><textarea id={`description-${index}`} value={session.description || ''} onChange={(e) => updateSession(index, 'description', e.target.value)} className="min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" /></div>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3"><p className="text-xs text-emerald-700 dark:text-emerald-300">{status}</p><Button type="submit" className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"><Save className="h-4 w-4" />Publish Schedule</Button></div>
    </form>
  );
}
