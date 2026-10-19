import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getMyRegistrationApi,
  downloadMyDelegateSlipApi,
} from '@/api/registration';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  CreditCard,
  QrCode,
  Calendar,
  Building,
  User,
  ShieldCheck,
  ArrowRight,
  FileText,
  RotateCcw,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'REG_SUBMITTED', label: 'Registration Submitted', desc: 'Category and activities recorded' },
  { key: 'PAY_SUBMITTED', label: 'Payment Submitted', desc: 'Bank receipt uploaded by attendee' },
  { key: 'UNDER_REVIEW', label: 'Payment Under Review', desc: 'Finance reviewing deposit reference' },
  { key: 'PAY_VERIFIED', label: 'Payment Verified', desc: 'Receipt reconciled and verified' },
  { key: 'REG_APPROVED', label: 'Registration Approved', desc: 'Credential & QR pass activated' },
];

export function RegistrationStatusView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const loadRegistration = async () => {
    try {
      setLoading(true);
      const res = await getMyRegistrationApi();
      if (res?.data) {
        setRegistration(res.data);
      }
    } catch (err) {
      console.error('Failed to load registration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistration();
  }, []);

  const handleDownloadSlip = async () => {
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
      console.error('Failed to download delegate slip:', err);
      alert('Could not download delegate slip. Ensure your registration is approved.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!registration) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 p-8 text-center dark:border-amber-800 dark:bg-amber-950/20">
        <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-amber-600" />
        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          No Conference Registration Found
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
          You have not submitted a conference registration yet. Start your registration now to reserve your seat and calculate required fees.
        </p>
        <Button
          onClick={() => navigate('/dashboard/registration')}
          className="mt-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
        >
          Begin Registration <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    );
  }

  const isApproved = registration.registrationStatus === 'APPROVED';
  const isRegRejected = registration.registrationStatus === 'REJECTED';
  const isPayRejected = registration.paymentStatus === 'REJECTED';
  const isResubmission = registration.paymentStatus === 'RESUBMISSION_REQUESTED';
  const isPayVerified = registration.paymentStatus === 'VERIFIED';
  const isPaySubmitted =
    registration.paymentStatus === 'PENDING_VERIFICATION' ||
    registration.registrationStatus === 'PAYMENT_SUBMITTED' ||
    isPayVerified ||
    isApproved;

  // Determine current active step index (0 to 4)
  let activeStepIndex = 0;
  if (isApproved) {
    activeStepIndex = 4;
  } else if (isPayVerified) {
    activeStepIndex = 3;
  } else if (registration.paymentStatus === 'PENDING_VERIFICATION') {
    activeStepIndex = 2;
  } else if (isPaySubmitted) {
    activeStepIndex = 1;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'UNDER_REVIEW':
      case 'PENDING_VERIFICATION':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300';
      case 'PENDING_PAYMENT':
      case 'NOT_SUBMITTED':
      case 'RESUBMISSION_REQUESTED':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Registration & Approval Tracking
              </h2>
              <Badge variant="uet">ICOSST 2026</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authoritative live progress ledger from submission through payment verification and gate clearance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">ID:</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {registration.registrationNumber}
            </span>
            <Badge
              variant="outline"
              className={`text-xs font-bold py-1 px-2.5 ${getStatusColor(registration.registrationStatus)}`}
            >
              {registration.registrationStatus.replaceAll('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Visual Step Progression Tracker */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Verification Lifecycle Progression
          </CardTitle>
          <CardDescription className="text-xs">
            Stages required to generate and activate your confirmed conference gate credential.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Connecting progress line */}
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 z-0">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${(activeStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                const isFailed = (isRegRejected || isPayRejected) && isCurrent;

                return (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? isFailed
                          ? 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/40'
                          : 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                        : isPassed
                        ? 'border-slate-200 bg-white dark:bg-slate-800'
                        : 'border-slate-200 bg-slate-50/60 dark:bg-slate-900/40 opacity-75'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                        isFailed
                          ? 'bg-rose-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isFailed ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Action Banner if Rejected or Resubmission Requested */}
      {(isPayRejected || isResubmission || isRegRejected) && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                  {isPayRejected
                    ? 'Payment Proof Rejected'
                    : isResubmission
                    ? 'Payment Resubmission Requested'
                    : 'Registration Application Rejected'}
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                  <strong>Remarks:</strong>{' '}
                  {registration.rejectionReason ||
                    registration.resubmissionNotes ||
                    registration.adminRemarks ||
                    'Please review your details and re-upload proof.'}
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/dashboard/payment')}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold gap-1.5 shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Resubmit Payment Evidence
            </Button>
          </div>
        </div>
      )}

      {/* Approved Success Banner with Download and Pass Access */}
      {isApproved && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                  Conference Registration Officially Confirmed & Approved!
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Your credentials have been validated by the steering committee. Digital gate pass and delegate voucher are activated.
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                  Approved on:{' '}
                  {registration.approvedAt
                    ? new Date(registration.approvedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Verified'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                onClick={handleDownloadSlip}
                disabled={downloading}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Generating PDF...' : 'Download Delegate Slip'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-100"
              >
                <QrCode className="w-4 h-4" /> View Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Details 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Participant & Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Registration ID</span>
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {registration.registrationNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Participant Full Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {registration.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Registered Category</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {registration.participantCategory === 'IEEE_MEMBER_STUDENT'
                      ? 'IEEE Member / Student'
                      : 'Non-IEEE Member / Professional'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Attendance Mode</span>
                  <Badge variant="outline" className="text-[10px] mt-0.5">
                    {registration.attendanceMode}
                  </Badge>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">IEEE Membership</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {registration.isIeeeMember
                      ? `Yes (${registration.ieeeMembershipNumber || 'Verified'})`
                      : 'No'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Affiliation / Institution</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {registration.organization}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Registration Date</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {registration.createdAt
                      ? new Date(registration.createdAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Conference Dinner</span>
                  <span
                    className={`font-bold ${
                      registration.attendDinner
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {registration.attendDinner ? 'Yes (Confirmed & Included)' : 'Not Included'}
                  </span>
                </div>
              </div>

              {/* Selected Activities List */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Enrolled Conference Activities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {registration.selectedActivities?.map((act, i) => (
                    <Badge key={i} variant="secondary" className="text-[11px] py-1">
                      {act}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit History Timeline */}
          {registration.approvalHistory && registration.approvalHistory.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Audit Trail & History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3 text-xs">
                  {registration.approvalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.action?.replaceAll('_', ' ')}
                          </span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            by {item.actorRole || 'System'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          {item.reason || 'Operational record logged'}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (1 Col): Financial Settlement Card */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl p-5">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Financial Settlement
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Registration Fee:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  PKR {registration.registrationFee?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Conference Dinner:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  PKR {registration.dinnerFee?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Total Payable:
                </span>
                <span className="font-mono text-base font-black text-emerald-700 dark:text-emerald-400">
                  PKR {registration.totalFee?.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Status:</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${getStatusColor(registration.paymentStatus)}`}
                  >
                    {registration.paymentStatus.replaceAll('_', ' ')}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Registration Status:</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${getStatusColor(registration.registrationStatus)}`}
                  >
                    {registration.registrationStatus.replaceAll('_', ' ')}
                  </Badge>
                </div>

                {registration.paymentSubmission && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Submitted Transaction
                    </span>
                    <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      Ref: {registration.paymentSubmission.transactionReference}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Paid: {registration.currency} {registration.paymentSubmission.amountPaid?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2">
                {registration.paymentStatus !== 'VERIFIED' && (
                  <Button
                    onClick={() => navigate('/dashboard/payment')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 shadow"
                  >
                    Go to Payment Submission <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}

                {!isApproved && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/registration')}
                    className="w-full text-xs h-9"
                  >
                    Edit Registration Info
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
