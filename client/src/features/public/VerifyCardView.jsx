import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { verifyPassApi } from '@/api/registration';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const paramName = params.get('name') || 'Delegate';
  const paramCategory = params.get('category') || 'ATTENDEE_PARTICIPANT';
  const photo = params.get('photo');

  const [loading, setLoading] = useState(true);
  const [serverVerification, setServerVerification] = useState(null);

  useEffect(() => {
    async function verify() {
      try {
        setLoading(true);
        const res = await verifyPassApi(cardId);
        if (res?.data) {
          setServerVerification(res.data);
        }
      } catch (err) {
        console.error('Verification query failed:', err);
        setServerVerification({
          isValid: false,
          status: 'UNVERIFIED',
          title: 'UNVERIFIED CREDENTIAL',
          message: 'Unable to reach verification service or invalid credential identifier.',
        });
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [cardId]);

  const isConfirmed = serverVerification?.isValid && serverVerification?.status === 'CONFIRMED';
  const displayName = serverVerification?.attendee || paramName;
  const displayCategory = serverVerification?.category || paramCategory.replaceAll('_', ' ');
  const theme = CARD_THEMES.ATTENDEE_PARTICIPANT;

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-100 px-4 py-10">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-2xl"
        style={{ borderColor: isConfirmed ? theme.secondary : '#e11d48' }}
      >
        {/* Header logos */}
        <div className="border-b-4 border-amber-400 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <img src="/uet-logo.png" alt="UET Lahore" className="h-16 w-16 object-contain" />
            <img src="/icosst-logo.png" alt="20th IEEE ICOSST 2026" className="h-16 flex-1 object-contain" />
            <img src="/kics-logo.png" alt="KICS UET Lahore" className="h-16 w-16 object-contain" />
          </div>
        </div>

        {/* Verification Title Banner */}
        <div
          className="flex items-center justify-between px-6 py-5 text-white"
          style={{
            background: isConfirmed
              ? `linear-gradient(115deg, ${theme.primary}, ${theme.secondary})`
              : 'linear-gradient(115deg, #881337, #be123c)',
          }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
              Authoritative Security Verification
            </p>
            <h1 className="mt-1 text-2xl font-extrabold">
              {isConfirmed ? 'Verified & Approved Delegate' : 'Gate Clearance Restricted'}
            </h1>
          </div>
          {isConfirmed ? (
            <ShieldCheck className="h-11 w-11 text-amber-300" />
          ) : (
            <XCircle className="h-11 w-11 text-amber-300" />
          )}
        </div>

        {/* Verification Body */}
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4 flex-1">
            {loading ? (
              <p className="text-sm text-slate-500 font-semibold">Verifying against ICOSST 2026 database...</p>
            ) : isConfirmed ? (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Card Holder & Institution
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-14 w-14 rounded-full border-2 border-emerald-700 object-cover" />
                    ) : null}
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900">{displayName}</p>
                      <p className="text-xs text-slate-500">{serverVerification?.organization}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Registration Number</p>
                    <p className="mt-0.5 break-all font-mono text-sm font-bold text-emerald-900">
                      {serverVerification?.registrationNumber || cardId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Credential Type</p>
                    <p className="mt-0.5 capitalize font-semibold text-slate-800">{displayCategory}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ACCESS GRANTED
                  </div>
                  {serverVerification?.dinnerIncluded && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      🍽️ GALA DINNER ENTITLED
                    </div>
                  )}
                </div>

                {serverVerification?.mealsEntitled && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Entitlements Confirmed:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                      {serverVerification.mealsEntitled.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1">
                  <p className="font-bold text-sm text-rose-900">
                    {serverVerification?.title || 'Unapproved Credential'}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {serverVerification?.message ||
                      'Registration is pending payment verification or has not been approved by the administrative committee. Entry to session halls is restricted.'}
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Identifier queried: <code className="font-mono font-bold text-slate-700">{cardId}</code>
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Participant Dashboard Login
                </Link>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="rounded-2xl border-2 border-slate-900 bg-white p-3">
              <QRCodeSVG value={window.location.href} size={130} level="H" includeMargin />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-700">
              ICOSST 2026 GATE
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
