import React, { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { getSettingsApi } from '@/api/settings';

const DEFAULT_DEADLINE = '2026-12-15T23:59:59+05:00';

function getRemaining(deadline) {
  const difference = new Date(deadline).getTime() - Date.now();
  if (difference <= 0) return null;
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function RegistrationCountdown() {
  const [deadline, setDeadline] = useState(DEFAULT_DEADLINE);
  const [remaining, setRemaining] = useState(() => getRemaining(DEFAULT_DEADLINE));

  useEffect(() => {
    getSettingsApi().then((res) => {
      const setting = res.data?.find((item) => item.key === 'EVENT_DETAILS');
      if (setting?.value?.registrationDeadline) setDeadline(setting.value.registrationDeadline);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setRemaining(getRemaining(deadline));
    const timer = window.setInterval(() => setRemaining(getRemaining(deadline)), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const deadlineLabel = new Date(deadline).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="relative mx-auto mb-6 w-full max-w-xl overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-[#071b1a] text-white shadow-[0_18px_50px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-300 via-amber-500 to-emerald-400" />
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border-[18px] border-emerald-400/10" />
      <div className="relative grid items-center gap-5 px-5 py-5 sm:grid-cols-[1fr_auto] sm:px-7">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-[#071b1a] shadow-lg shadow-amber-500/20"><Clock3 className="h-4 w-4" /></span>
            <div><p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-300">ICOSST 2026</p><p className="text-sm font-extrabold tracking-tight">Registration is open</p></div>
          </div>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-amber-300 to-transparent" />
          <p className="mt-3 text-[11px] leading-5 text-slate-300">Complete your registration before the official deadline.</p>
          <p className="mt-1 text-xs font-bold text-emerald-300">Closes {deadlineLabel}</p>
        </div>
        <div className="sm:border-l sm:border-white/15 sm:pl-5">
          <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">Time remaining</p>
          {remaining ? (
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(remaining).map(([unit, value]) => <div key={unit} className="min-w-[3.25rem] rounded-xl border border-white/15 bg-white/[0.07] px-2 py-2 text-center shadow-inner shadow-white/5"><p className="text-xl font-black leading-none tabular-nums text-white">{String(value).padStart(2, '0')}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-amber-200">{unit.slice(0, 3)}</p></div>)}
            </div>
          ) : <p className="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-200">Registration closed</p>}
        </div>
      </div>
    </div>
  );
}
