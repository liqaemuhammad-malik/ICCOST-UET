import React, { useState, useEffect } from 'react';
import { QrCode, Printer, ShieldCheck, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '@/store/useAuthStore';
import { uploadProfilePhotoApi } from '@/api/auth';
import { getMyRegistrationApi, downloadMyDelegateSlipApi } from '@/api/registration';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function getCardId(user, registration) {
  if (registration?.registrationStatus === 'APPROVED' && registration?.registrationNumber) {
    return registration.registrationNumber;
  }
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
  const [registration, setRegistration] = useState(null);
  const [cardName, setCardName] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getMyRegistrationApi()
      .then((res) => {
        if (res?.data) {
          setRegistration(res.data);
          if (res.data.fullName) setCardName(res.data.fullName);
        }
      })
      .catch(() => {});
  }, []);

  if (!user) return null;

  const isApproved = registration?.registrationStatus === 'APPROVED';
  const cardId = getCardId(user, registration);
  const category = user.category || user.profile?.categoryCode || 'ATTENDEE_PARTICIPANT';
  const theme = CARD_THEMES[category] || CARD_THEMES.ATTENDEE_PARTICIPANT;
  const profilePhotoUrl = user.profile?.profileImageUrl;
  const photoUrl = profilePhotoUrl ? new URL(profilePhotoUrl, window.location.origin).href : '';
  const printedName = cardName || user.name || 'Enter Name';
  const qrValue = `${window.location.origin}/verify-card?cardId=${encodeURIComponent(cardId)}&name=${encodeURIComponent(printedName)}&category=${encodeURIComponent(category)}&photo=${encodeURIComponent(photoUrl)}`;

  const handlePrint = () => {
    document.body.classList.add('printing-holding-card');
    window.addEventListener(
      'afterprint',
      () => {
        document.body.classList.remove('printing-holding-card');
      },
      { once: true }
    );
    window.print();
  };

  const handleDownloadSlip = async () => {
    if (!isApproved) return;
    try {
      setDownloading(true);
      const blob = await downloadMyDelegateSlipApi();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ICOSST-2026-Delegate-Slip-${cardId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download delegate slip.');
    } finally {
      setDownloading(false);
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading">My Holding Card</h2>
            {isApproved ? (
              <Badge variant="success" className="text-[10px] gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Officially Approved
              </Badge>
            ) : (
              <Badge variant="warning" className="text-[10px] gap-1 font-bold">
                <AlertTriangle className="w-3 h-3" /> Pending Final Approval
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Official conference identification credential for gate clearance, workshops, and refreshment tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isApproved && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadSlip}
              disabled={downloading}
              className="gap-1.5 text-xs border-emerald-600 text-emerald-800"
            >
              <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Delegate Slip'}
            </Button>
          )}
          <Button type="button" onClick={handlePrint} className="gap-2 text-xs bg-slate-900 hover:bg-slate-800">
            <Printer className="w-4 h-4" /> Print Card
          </Button>
        </div>
      </div>

      {!isApproved && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 print:hidden">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Notice:</strong> Your conference registration is awaiting official finance verification and administrative approval. Your authoritative delegate ID and gate clearance token will become active once approved.
          </div>
        </div>
      )}

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
          Identification number, category, and QR details are linked to your authoritative conference registration.
        </p>
        <label
          htmlFor="profile-photo"
          className="mt-4 flex cursor-pointer items-center justify-center rounded-md border border-dashed border-emerald-300 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
        >
          {uploadingPhoto ? 'Uploading photo...' : profilePhotoUrl ? 'Change verification photo' : 'Upload verification photo'}
        </label>
        <input
          id="profile-photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handlePhotoUpload}
          disabled={uploadingPhoto}
        />
      </div>

      <div
        className="holding-card max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-xl print:shadow-none"
        style={{ borderColor: theme.secondary }}
      >
        <div className="border-b-4 border-amber-400 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <img src="/uet-logo.png" alt="UET Lahore" className="h-16 w-16 object-contain" />
            <img src="/icosst-logo.png" alt="20th IEEE ICOSST 2026" className="h-16 flex-1 object-contain" />
            <img src="/kics-logo.png" alt="KICS UET Lahore" className="h-16 w-16 object-contain" />
          </div>
        </div>

        <div
          className="px-6 py-5 text-white"
          style={{ background: `linear-gradient(115deg, ${theme.primary}, ${theme.secondary})` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
                Official Digital Credential
              </p>
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
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    className="h-14 w-14 rounded-full border-2 border-emerald-700 object-cover"
                  />
                ) : null}
                <p className="mt-1 break-words text-2xl font-extrabold text-slate-900">
                  {printedName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Identification Number</p>
                <p className="mt-1 break-all font-mono text-sm font-bold text-emerald-900">{cardId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Credential Type</p>
                <p className="mt-1 font-semibold capitalize text-slate-800">
                  {registration
                    ? registration.participantCategory === 'IEEE_MEMBER_STUDENT'
                      ? 'IEEE Member / Student'
                      : 'Non-IEEE Professional'
                    : category.replaceAll('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
            <p className="border-l-2 border-amber-400 pl-3 text-xs leading-relaxed text-slate-500">
              Present this credential at registration, entry, and official conference activities.
            </p>
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
