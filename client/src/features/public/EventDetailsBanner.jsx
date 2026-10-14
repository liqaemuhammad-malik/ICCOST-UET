import React from 'react';
import { CalendarDays, MapPin, Mail, Phone } from 'lucide-react';

export const DEFAULT_EVENT_DETAILS = {
  title: '20th IEEE ICOSST 2026',
  subtitle: 'International Conference on Open Source Systems & Technologies',
  dates: '22–23 December 2026',
  venue: 'KICS Seminar Complex, UET Lahore',
  address: 'GT Road, Lahore, Pakistan',
  description: 'Join researchers, professionals, students, and technology leaders for two days of ideas, innovation, and collaboration.',
  email: 'icosst@kics.edu.pk',
  phone: '+92 (42) 99029450',
};

export function EventDetailsBanner({ details = DEFAULT_EVENT_DETAILS }) {
  const event = { ...DEFAULT_EVENT_DETAILS, ...(details || {}) };

  return (
    <section className="mb-6 w-full rounded-2xl border border-white/40 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">Official Event Information</p>
          <h2 className="mt-1 text-lg font-extrabold">{event.title}</h2>
          <p className="text-xs text-slate-300">{event.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-200 sm:grid-cols-2 sm:gap-x-5">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-amber-300" />{event.dates}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-amber-300" />{event.venue}</span>
          <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-emerald-300" />{event.email}</span>
          <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-emerald-300" />{event.phone}</span>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-300">{event.description} <span className="text-slate-400">{event.address}</span></p>
    </section>
  );
}
