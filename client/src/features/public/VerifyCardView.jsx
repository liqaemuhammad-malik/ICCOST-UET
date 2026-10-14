import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const CARD_THEMES = {
  ATTENDEE_PARTICIPANT: { primary: '#064e3b', secondary: '#047857', accent: '#fbbf24' },
  ORGANIZER: { primary: '#0f172a', secondary: '#334155', accent: '#cbd5e1' },
  WORKSHOP_PRESENTER: { primary: '#4c1d95', secondary: '#7c3aed', accent: '#c4b5fd' },
  MEDIA_PERSON: { primary: '#075985', secondary: '#0284c7', accent: '#7dd3fc' },
  INVITED_SPEAKER: { primary: '#881337', secondary: '#be123c', accent: '#fda4af' },
  PRESENTER_CO_PRESENTER: { primary: '#78350f', secondary: '#b45309', accent: '#fcd34d' },
  PAPER_PRESENTER: { primary: '#065f46', secondary: '#059669', accent: '#6ee7b7' },
};

export function VerifyCardView() {
  const [params] = useSearchParams();
  const cardId = params.get('cardId') || 'UNKNOWN-CARD';
  const name = params.get('name') || 'Enter Name';
  const category = (params.get('category') || 'ATTENDEE_PARTICIPANT').replaceAll('_', ' ').toLowerCase();
  const categoryCode = params.get('category') || 'ATTENDEE_PARTICIPANT';
  const theme = CARD_THEMES[categoryCode] || CARD_THEMES.ATTENDEE_PARTICIPANT;
  const photo = params.get('photo');

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-2xl" style={{ borderColor: theme.secondary }}>
        <div className="border-b-4 border-amber-400 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <img src="/uet-logo.png" alt="UET Lahore" className="h-16 w-16 object-contain" />
            <img src="/icosst-logo.png" alt="20th IEEE ICOSST 2026" className="h-16 flex-1 object-contain" />
            <img src="/kics-logo.png" alt="KICS UET Lahore" className="h-16 w-16 object-contain" />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-5 text-white" style={{ background: `linear-gradient(115deg, ${theme.primary}, ${theme.secondary})` }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>Official Credential Verification</p>
            <h1 className="mt-1 text-2xl font-extrabold">Verified Holding Card</h1>
          </div>
          <ShieldCheck className="h-11 w-11 text-amber-300" />
        </div>
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Card Holder</p>
              <div className="flex items-center gap-3">
                {photo ? <img src={photo} alt="Profile" className="h-14 w-14 rounded-full border-2 border-emerald-700 object-cover" /> : null}
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{name}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Identification Number</p>
                <p className="mt-1 break-all font-mono text-sm font-bold text-emerald-900">{cardId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Credential Type</p>
                <p className="mt-1 capitalize font-semibold text-slate-800">{category}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> VERIFIED
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="rounded-2xl border-2 border-emerald-900 bg-white p-3">
              <QRCodeSVG value={window.location.href} size={140} level="H" includeMargin />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">ICOSST 2026</span>
          </div>
        </div>
      </div>
    </main>
  );
}
