import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSettingsApi, updateSettingApi } from '@/api/settings';
import { DEFAULT_EVENT_DETAILS } from '@/features/public/EventDetailsBanner';

export function EventSettingsView() {
  const [form, setForm] = useState(DEFAULT_EVENT_DETAILS);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSettingsApi().then((res) => {
      const setting = res.data?.find((item) => item.key === 'EVENT_DETAILS');
      if (setting?.value) setForm({ ...DEFAULT_EVENT_DETAILS, ...setting.value });
    }).catch(() => setStatus('Unable to load event details.'));
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setStatus('Saving…');
    try {
      await updateSettingApi('EVENT_DETAILS', form, 'Public event details displayed across login and registration pages.');
      setStatus('Event details published successfully.');
    } catch (error) {
      setStatus(error.response?.data?.error?.message || 'Unable to save event details.');
    }
  };

  return (
    <form onSubmit={save} className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div>
        <h2 className="text-xl font-bold font-heading">Event Details &amp; Public Information</h2>
        <p className="mt-1 text-xs text-slate-500">These details appear on every login and registration page after publishing.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['title', 'Event title'], ['subtitle', 'Subtitle'], ['dates', 'Event dates'], ['registrationDeadline', 'Registration deadline'],
          ['venue', 'Venue'], ['address', 'Venue address'], ['email', 'Contact email'], ['phone', 'Contact phone'],
        ].map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input id={key} value={form[key] || ''} onChange={(e) => update(key, e.target.value)} />
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Public event description</Label>
        <textarea id="description" value={form.description || ''} onChange={(e) => update('description', e.target.value)} className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-emerald-700 dark:text-emerald-300">{status}</p>
        <Button type="submit" className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"><Save className="h-4 w-4" />Publish Details</Button>
      </div>
    </form>
  );
}
