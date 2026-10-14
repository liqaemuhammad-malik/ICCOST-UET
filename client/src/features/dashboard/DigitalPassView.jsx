import React, { useState } from 'react';
import { QrCode, Printer, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '@/store/useAuthStore';
import { uploadProfilePhotoApi } from '@/api/auth';
import { Button } from '@/components/ui/button';

function getCardId(user) {
  const rawId = user?._id || user?.id || user?.email || 'unknown';
  return `ICOSST-${String(rawId).toUpperCase()}`;
}

const CARD_THEMES = {
  ATTENDEE_PARTICIPANT: { primary: '#064e3b', secondary: '#047857', accent: '#fbbf24' },
  ORGANIZER: { primary: '#0f172a', secondary: '#334155', accent: '#cbd5e1' },
  WORKSHOP_PRESENTER: { primary: '#4c1d95', secondary: '#7c3aed', accent: '#c4b5fd' },
  MEDIA_PERSON: { primary: '#075985', secondary: '#0284c7', accent: '#7dd3fc' },
  INVITED_SPEAKER: { primary: '#881337', secondary: '#be123c', accent: '#fda4af' },
  PRESENTER_CO_PRESENTER: { primary: '#78350f', secondary: '#b45309', accent: '#fcd34d' },
  PAPER_PRESENTER: { primary: '#065f46', secondary: '#059669', accent: '#6ee7b7' },
};

export function DigitalPassView() {
  const { user, updateUser } = useAuthStore();
  const [cardName, setCardName] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  if (!user) return null;

  const cardId = getCardId(user);
  const category = user.category || user.profile?.categoryCode || 'ATTENDEE_PARTICIPANT';
  const theme = CARD_THEMES[category] || CARD_THEMES.ATTENDEE_PARTICIPANT;
  const profilePhotoUrl = user.profile?.profileImageUrl;
  const photoUrl = profilePhotoUrl ? new URL(profilePhotoUrl, window.location.origin).href : '';
  const printedName = cardName || 'Enter Name';
  const qrValue = `${window.location.origin}/verify-card?cardId=${encodeURIComponent(cardId)}&name=${encodeURIComponent(printedName)}&category=${encodeURIComponent(category)}&photo=${encodeURIComponent(photoUrl)}`;
  const handlePrint = () => {
    document.body.classList.add('printing-holding-card');
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-holding-card');
    }, { once: true });
    window.print();
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const result = await uploadProfilePhotoApi(file);
      updateUser(result.data);
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-bold font-heading">My Holding Card</h2>
          <p className="text-xs text-slate-500">Your personal conference identification card.</p>
        </div>
        <Button type="button" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Print Card
        </Button>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        <label htmlFor="holding-card-name" className="mb-1.5 block text-xs font-bold text-slate-700">
          Name on Holding Card
        </label>
        <input
          id="holding-card-name"
          type="text"
          value={cardName}
          onChange={(event) => setCardName(event.target.value)}
          maxLength={100}
          className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          placeholder="Enter Name"
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          Identification number, category, and QR details are automatically taken from your login.
        </p>
        <label htmlFor="profile-photo" className="mt-4 flex cursor-pointer items-center justify-center rounded-md border border-dashed border-emerald-300 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50">
          {uploadingPhoto ? 'Uploading photo...' : profilePhotoUrl ? 'Change verification photo' : 'Upload verification photo'}
        </label>
        <input id="profile-photo" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
      </div>

      <div className="holding-card max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-xl print:shadow-none" style={{ borderColor: theme.secondary }}>
        <div className="border-b-4 border-amber-400 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <img src="/uet-logo.png" alt="UET Lahore" className="h-16 w-16 object-contain" />
            <img src="/icosst-logo.png" alt="20th IEEE ICOSST 2026" className="h-16 flex-1 object-contain" />
            <img src="/kics-logo.png" alt="KICS UET Lahore" className="h-16 w-16 object-contain" />
          </div>
        </div>

        <div className="px-6 py-5 text-white" style={{ background: `linear-gradient(115deg, ${theme.primary}, ${theme.secondary})` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>Official Digital Credential</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Conference Holding Card</h1>
            </div>
            <ShieldCheck className="h-10 w-10 text-amber-300" />
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-gradient-to-br from-white to-emerald-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Card Holder</p>
              <div className="flex items-center gap-3">
                {profilePhotoUrl ? <img src={profilePhotoUrl} alt="Profile" className="h-14 w-14 rounded-full border-2 border-emerald-700 object-cover" /> : null}
              <p className="mt-1 break-words text-2xl font-extrabold text-slate-900">{cardName || 'Enter Name'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Identification Number</p>
                <p className="mt-1 break-all font-mono text-sm font-bold text-emerald-900">{cardId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Credential Type</p>
                <p className="mt-1 font-semibold capitalize text-slate-800">{category.replaceAll('_', ' ').toLowerCase()}</p>
              </div>
            </div>
            <p className="border-l-2 border-amber-400 pl-3 text-xs leading-relaxed text-slate-500">Present this credential at registration, entry, and official conference activities.</p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="rounded-2xl border-2 border-emerald-900 bg-white p-3 shadow-md">
              <QRCodeSVG value={qrValue} size={150} level="H" includeMargin />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
              <QrCode className="h-3.5 w-3.5" /> Scan to identify
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 0.35in; }
          body.printing-holding-card * { visibility: hidden !important; }
          body.printing-holding-card .holding-card,
          body.printing-holding-card .holding-card * { visibility: visible !important; }
          body.printing-holding-card .holding-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 720px;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
