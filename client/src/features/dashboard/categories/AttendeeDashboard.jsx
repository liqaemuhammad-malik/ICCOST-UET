import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import {
  getMyRegistrationApi,
  downloadMyDelegateSlipApi,
} from '@/api/registration';
import {
  Ticket,
  Calendar,
  Coffee,
  Clock,
  CheckCircle2,
  Download,
  AlertCircle,
  Lock,
  CreditCard,
  FileCheck,
  ShieldAlert,
  QrCode,
} from 'lucide-react';

export function AttendeeDashboard({ user }) {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchReg() {
      try {
        setLoading(true);
        const res = await getMyRegistrationApi();
        if (res?.data) {
          setRegistration(res.data);
        }
      } catch (err) {
        console.error('Failed to load attendee registration:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReg();
  }, []);

  const isRegistered = !!registration;
  const isApproved = registration?.registrationStatus === 'APPROVED';
  const isPayVerified = registration?.paymentStatus === 'VERIFIED';
  const isPaySubmitted =
    registration?.paymentStatus === 'PENDING_VERIFICATION' ||
    registration?.registrationStatus === 'PAYMENT_SUBMITTED';
  const isRejected =
    registration?.registrationStatus === 'REJECTED' ||
    registration?.paymentStatus === 'REJECTED';

  const handleDownloadSlip = async () => {
    if (!isApproved) return;
    try {
      setDownloading(true);
      const blob = await downloadMyDelegateSlipApi();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `ICOSST-2026-Delegate-Slip-${registration?.registrationNumber || 'PASS'}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download slip:', err);
      alert('Could not download delegate slip.');
    } finally {
      setDownloading(false);
    }
  };

  const qrValue = isApproved
    ? `${window.location.origin}/verify-card?cardId=${encodeURIComponent(
        registration.registrationNumber
      )}&name=${encodeURIComponent(registration.fullName)}&category=${encodeURIComponent(
        registration.participantCategory
      )}`
    : '';

  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-emerald-500 text-slate-950 font-bold text-xs uppercase">
                  Attendee / Participant Portal
                </Badge>
                {isApproved ? (
                  <Badge variant="outline" className="text-emerald-300 border-emerald-400 text-xs font-bold gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ICOSST 2026 Confirmed Delegate
                  </Badge>
                ) : isPaySubmitted ? (
                  <Badge variant="outline" className="text-amber-300 border-amber-400 text-xs font-bold gap-1">
                    <Clock className="w-3 h-3" /> Payment Under Verification
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-300 border-slate-500 text-xs font-bold gap-1">
                    <AlertCircle className="w-3 h-3" /> Registration Incomplete
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Welcome, {user.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {isApproved
                  ? `Your official registration (${registration.registrationNumber}) is fully approved. Your delegate pass grants full access to keynotes, tracks, open source exposition, and refreshment tokens at KICS, UET Lahore (22–23 Dec 2026).`
                  : isRegistered
                  ? `Your registration (${registration.registrationNumber}) has been submitted. Complete payment verification to activate your official delegate pass and gate clearance.`
                  : 'Welcome to the 20th IEEE ICOSST 2026. Please submit your conference registration to select tracks, calculate official fees, and reserve your delegate seat.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              {isApproved ? (
                <Button
                  size="sm"
                  onClick={handleDownloadSlip}
                  disabled={downloading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  {downloading ? 'Downloading...' : 'Download Delegate Slip'}
                </Button>
              ) : !isRegistered ? (
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard/registration')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow"
                >
                  <Ticket className="w-4 h-4" /> Complete Registration
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard/payment')}
                  className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5 shadow"
                >
                  <CreditCard className="w-4 h-4" /> Submit Payment Proof
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Metrics Row */}
      <div className="hidden">
        {/* Card 1: Conference Pass */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                isApproved
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {isApproved ? <Ticket className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Conference Pass</span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isApproved
                  ? 'Delegate Pass (Confirmed)'
                  : isRegistered
                  ? 'Pass Awaiting Approval'
                  : 'Pass Not Available'}
              </p>
              <span
                className={`text-[10px] font-semibold ${
                  isApproved
                    ? 'text-emerald-600'
                    : isPaySubmitted
                    ? 'text-amber-600'
                    : 'text-slate-400'
                }`}
              >
                {isApproved
                  ? 'Active for 22–23 Dec'
                  : isPaySubmitted
                  ? 'Finance Review in Progress'
                  : 'Registration & Payment Required'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Payment Status */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                isPayVerified
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : isPaySubmitted
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : isRejected
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Payment Settlement</span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isPayVerified
                  ? 'Payment Verified'
                  : isPaySubmitted
                  ? 'Under Verification'
                  : isRejected
                  ? 'Payment Rejected'
                  : 'Not Submitted'}
              </p>
              <span
                className={`text-[10px] font-semibold ${
                  isPayVerified
                    ? 'text-emerald-600'
                    : isPaySubmitted
                    ? 'text-blue-600'
                    : isRejected
                    ? 'text-rose-600'
                    : 'text-slate-400'
                }`}
              >
                {isPayVerified
                  ? `PKR ${registration?.totalFee?.toLocaleString()} Received`
                  : isRegistered
                  ? `Payable: PKR ${registration?.totalFee?.toLocaleString()}`
                  : 'Fee Pending Registration'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Refreshment Tokens */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                isApproved
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Refreshment Tokens</span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isApproved
                  ? registration?.attendDinner
                    ? 'Day 1 & 2 + Gala Dinner'
                    : 'Day 1 & Day 2 Meals'
                  : 'Tokens Locked'}
              </p>
              <span
                className={`text-[10px] font-semibold ${
                  isApproved ? 'text-amber-600' : 'text-slate-400'
                }`}
              >
                {isApproved
                  ? registration?.attendDinner
                    ? 'Lunch + High Tea + Dinner Included'
                    : 'Lunch + High Tea Entitled'
                  : 'Unlocked Upon Admin Approval'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digital QR Pass & Gate Clearance */}
      <div className="hidden">
        {/* Digital QR Pass & Gate Clearance Card */}
        <Card className="hidden">
          <CardContent>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">08:30 AM – 09:30 AM</span>
                <span className="text-slate-500">Registration Desk & Delegate Badge Collection</span>
              </div>
              <Badge variant="outline" className="text-emerald-700 border-emerald-500">Main Foyer</Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">09:30 AM – 10:45 AM</span>
                <span className="text-slate-500">Inaugural Ceremony & Opening Keynote Address</span>
              </div>
              <Badge variant="uet">Main Auditorium</Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">01:00 PM – 02:00 PM</span>
                <span className="text-slate-500">Networking Lunch & Exhibition Arena Walkthrough</span>
              </div>
              <Badge className="bg-amber-600 text-white">Dining Complex</Badge>
            </div>

            {registration?.attendDinner && isApproved && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex justify-between items-center">
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">07:30 PM – 10:00 PM</span>
                  <span className="text-amber-700 dark:text-amber-300">Official ICOSST 2026 Gala Dinner</span>
                </div>
                <Badge className="bg-amber-600 text-white">Banquet Hall</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Digital QR Pass & Gate Clearance Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              Digital QR Pass & Gate Clearance
            </CardTitle>
            <CardDescription className="text-xs">
              Present this token at UET security gates and hall entrances for scanner clearance.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center p-6 space-y-4">
            {isApproved ? (
              <div className="space-y-3">
                <div className="inline-block p-4 bg-white dark:bg-slate-900 border-2 border-dashed border-emerald-600 rounded-xl shadow-sm">
                  <QRCodeSVG value={qrValue} size={130} level="H" includeMargin />
                  <p className="text-[11px] font-mono font-bold mt-2 text-emerald-700 dark:text-emerald-400">
                    {registration.registrationNumber}
                  </p>
                </div>
                <div>
                  <Badge variant="success" className="gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Gate Clearance Active
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Auto-verified by staff scanners for entrance to KICS Auditorium and refreshment redemption.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    QR Clearance Pass Not Yet Available
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {isPaySubmitted
                      ? 'Payment is currently under verification. Once confirmed by finance and approved by admin, your official QR badge will activate.'
                      : isRegistered
                      ? 'Submit payment verification to unlock gate credentials.'
                      : 'Complete conference registration to generate your gate pass.'}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(isRegistered ? '/dashboard/payment' : '/dashboard/registration')}
                  className="text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50 mt-2"
                >
                  {isRegistered ? 'Go to Payment Submission' : 'Register Now'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
