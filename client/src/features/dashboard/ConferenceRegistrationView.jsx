import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  getMyRegistrationApi,
  createOrUpdateRegistrationApi,
  getRegistrationConfigApi,
} from '@/api/registration';
import {
  ClipboardCheck,
  Building2,
  Mail,
  Phone,
  User,
  CheckCircle2,
  CreditCard,
  Utensils,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const ACTIVITIES = [
  'Paper Presentation Session',
  'Invited Speakers Tutorials',
  'Industrial Exposition',
  'Student Competition / Career Fair',
  'Opening / Closing Ceremony',
];

export function ConferenceRegistrationView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingReg, setExistingReg] = useState(null);
  const [feeConfig, setFeeConfig] = useState({
    ieeeStudentPhysical: 1000,
    ieeeStudentVirtual: 1000,
    nonIeeeProfessionalPhysical: 2000,
    nonIeeeProfessionalVirtual: 2000,
    dinnerFee: 5000,
    currency: 'PKR',
  });

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    organization: user?.profile?.institution || '',
    isIeeeMember: false,
    ieeeMembershipNumber: '',
    participantCategory: 'IEEE_MEMBER_STUDENT',
    attendanceMode: 'PHYSICAL',
    selectedActivities: ['Opening / Closing Ceremony', 'Keynote Addresses'],
    attendDinner: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [configRes, myRegRes] = await Promise.all([
          getRegistrationConfigApi().catch(() => null),
          getMyRegistrationApi().catch(() => null),
        ]);

        if (configRes?.data?.feeSettings) {
          setFeeConfig(configRes.data.feeSettings);
        }

        if (myRegRes?.data) {
          const reg = myRegRes.data;
          setExistingReg(reg);
          setFormData({
            fullName: reg.fullName || user?.name || '',
            email: reg.email || user?.email || '',
            phone: reg.phone || '',
            organization: reg.organization || user?.profile?.institution || '',
            isIeeeMember: reg.isIeeeMember || false,
            ieeeMembershipNumber: reg.ieeeMembershipNumber || '',
            participantCategory: reg.participantCategory || 'IEEE_MEMBER_STUDENT',
            attendanceMode: reg.attendanceMode || 'PHYSICAL',
            selectedActivities: reg.selectedActivities || [],
            attendDinner: reg.attendDinner || false,
          });
        } else {
          // prefill from user session
          setFormData((prev) => ({
            ...prev,
            fullName: user?.name || '',
            email: user?.email || '',
            organization: user?.profile?.institution || '',
            phone: user?.profile?.phone || '',
          }));
        }
      } catch (err) {
        console.error('Failed to load registration data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Dynamic fee calculation
  const calculatedRegFee =
    formData.participantCategory === 'IEEE_MEMBER_STUDENT'
      ? formData.attendanceMode === 'VIRTUAL'
        ? feeConfig.ieeeStudentVirtual
        : feeConfig.ieeeStudentPhysical
      : formData.attendanceMode === 'VIRTUAL'
      ? feeConfig.nonIeeeProfessionalVirtual
      : feeConfig.nonIeeeProfessionalPhysical;

  const calculatedDinnerFee = formData.attendDinner ? feeConfig.dinnerFee : 0;
  const calculatedGrandTotal = calculatedRegFee + calculatedDinnerFee;

  const handleActivityToggle = (act) => {
    setFormData((prev) => {
      const exists = prev.selectedActivities.includes(act);
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter((a) => a !== act)
          : [...prev.selectedActivities, act],
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) errs.email = 'Email Address is required';
    if (!formData.phone.trim()) errs.phone = 'Contact Phone Number is required';
    if (!formData.organization.trim()) errs.organization = 'University or Organization is required';
    if (formData.isIeeeMember && !formData.ieeeMembershipNumber.trim()) {
      errs.ieeeMembershipNumber = 'IEEE Membership Number is required when IEEE member is selected';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setSuccessMessage('');
      const res = await createOrUpdateRegistrationApi(formData);
      setExistingReg(res.data);
      setSuccessMessage('Registration successfully saved! Proceed to payment submission.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit registration';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  const isApproved = existingReg?.registrationStatus === 'APPROVED';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Conference Registration Portal
              </h2>
              <Badge variant="uet">ICOSST 2026</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete your formal delegate registration for the 20th IEEE ICOSST (22–23 December 2026).
            </p>
          </div>

          {existingReg && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Badge
                variant={
                  existingReg.registrationStatus === 'APPROVED'
                    ? 'success'
                    : existingReg.registrationStatus === 'REJECTED'
                    ? 'destructive'
                    : 'warning'
                }
                className="text-xs font-bold py-1 px-3"
              >
                {existingReg.registrationNumber} • {existingReg.registrationStatus.replaceAll('_', ' ')}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/dashboard/status')}
                className="text-xs gap-1 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                Track Status <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold">{successMessage}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Registration record <strong>{existingReg?.registrationNumber}</strong> has been locked in the database.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/dashboard/payment')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shrink-0"
          >
            Submit Payment Proof <CreditCard className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {errors.form && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Personal Details & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Personal Details */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Step 1: Personal Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Prefilled from your authenticated account. Kept synchronized with delegate verification records.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <Input
                      disabled={isApproved}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Engr. Haris Khan"
                      className="text-xs h-10"
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <Input
                      disabled
                      value={formData.email}
                      className="text-xs h-10 bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Verified account email (authoritative identifier)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Number *
                    </label>
                    <Input
                      disabled={isApproved}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="text-xs h-10"
                    />
                    {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Organization / Institute / University *
                    </label>
                    <Input
                      disabled={isApproved}
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. UET Lahore, NUST, FAST-NUCES, Systems Ltd"
                      className="text-xs h-10"
                    />
                    {errors.organization && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.organization}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Conference Activities */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  Step 2: Conference Activities
                </CardTitle>
                <CardDescription className="text-xs">
                  Select all activities you intend to attend during 22–23 December 2026.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTIVITIES.map((act) => {
                    const isChecked = formData.selectedActivities.includes(act);
                    return (
                      <button
                        type="button"
                        key={act}
                        disabled={isApproved}
                        onClick={() => handleActivityToggle(act)}
                        className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold block">{act}</span>
                          <span className="text-[10px] text-slate-500">Official ICOSST Track</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Registration Category & Dinner */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Step 3: Registration Category & Attendance Mode
                </CardTitle>
                <CardDescription className="text-xs">
                  Tier rates for IEEE members, students, and industry professionals.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* IEEE Member Question */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Are you an IEEE Member? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isApproved}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isIeeeMember: true,
                          participantCategory: 'IEEE_MEMBER_STUDENT',
                        })
                      }
                      className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                        formData.isIeeeMember
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                      }`}
                    >
                      Yes, I am an IEEE Member
                    </button>
                    <button
                      type="button"
                      disabled={isApproved}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isIeeeMember: false,
                          ieeeMembershipNumber: '',
                        })
                      }
                      className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                        !formData.isIeeeMember
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                      }`}
                    >
                      No, Non-Member
                    </button>
                  </div>

                  {formData.isIeeeMember && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg">
                      <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                        IEEE Membership Number *
                      </label>
                      <Input
                        disabled={isApproved}
                        value={formData.ieeeMembershipNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, ieeeMembershipNumber: e.target.value })
                        }
                        placeholder="e.g. 98234102"
                        className="text-xs h-9 bg-white dark:bg-slate-900 border-amber-300"
                      />
                      {errors.ieeeMembershipNumber && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.ieeeMembershipNumber}</p>
                      )}
                      <p className="text-[10px] text-amber-800 dark:text-amber-400 mt-1">
                        Stored for administrative verification before final registration approval.
                      </p>
                    </div>
                  )}
                </div>

                {/* Participant Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Participant Registration Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isApproved}
                      onClick={() =>
                        setFormData({ ...formData, participantCategory: 'IEEE_MEMBER_STUDENT' })
                      }
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.participantCategory === 'IEEE_MEMBER_STUDENT'
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Badge className="bg-emerald-600 text-white text-[10px] mb-1">DISCOUNT TIER</Badge>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">IEEE Member / Student</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Enrolled student or IEEE member in good standing.</p>
                      <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-2">
                        PKR {feeConfig.ieeeStudentPhysical.toLocaleString()}
                      </p>
                    </button>

                    <button
                      type="button"
                      disabled={isApproved}
                      onClick={() =>
                        setFormData({ ...formData, participantCategory: 'NON_IEEE_PROFESSIONAL' })
                      }
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.participantCategory === 'NON_IEEE_PROFESSIONAL'
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Badge variant="outline" className="text-[10px] mb-1">STANDARD TIER</Badge>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Non-IEEE Member / Professional</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Faculty, industrial practitioners & general delegates.</p>
                      <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-2">
                        PKR {feeConfig.nonIeeeProfessionalPhysical.toLocaleString()}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Attendance Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Attendance Mode *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isApproved}
                      onClick={() => setFormData({ ...formData, attendanceMode: 'PHYSICAL' })}
                      className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                        formData.attendanceMode === 'PHYSICAL'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                      }`}
                    >
                      🏢 Physical Attendance (UET Lahore)
                    </button>
                    <button
                      type="button"
                      disabled={isApproved}
                      onClick={() => setFormData({ ...formData, attendanceMode: 'VIRTUAL' })}
                      className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                        formData.attendanceMode === 'VIRTUAL'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                      }`}
                    >
                      🌐 Virtual Attendance
                    </button>
                  </div>
                </div>

                {/* Conference Dinner */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Will you attend the Official Conference Dinner?
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Networking banquet with keynote guests and steering committee (22 Dec evening). Additional Fee: PKR 5,000.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isApproved}
                        onClick={() => setFormData({ ...formData, attendDinner: true })}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                          formData.attendDinner
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Yes (+ PKR 5,000)
                      </button>
                      <button
                        type="button"
                        disabled={isApproved}
                        onClick={() => setFormData({ ...formData, attendDinner: false })}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                          !formData.attendDinner
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        No Thanks
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1 Col): Live Calculation Summary Card */}
          <div className="space-y-6">
            <Card className="border-emerald-300 dark:border-emerald-800 shadow-md sticky top-6">
              <CardHeader className="bg-emerald-900 text-white rounded-t-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      Fee Calculation Summary
                    </CardTitle>
                    <p className="text-[11px] text-emerald-200 mt-0.5">
                      Real-time authoritative fee snapshot
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500">Selected Tier:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formData.participantCategory === 'IEEE_MEMBER_STUDENT'
                        ? 'IEEE Member / Student'
                        : 'Non-IEEE Member / Professional'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Attendance Mode:</span>
                    <Badge variant="outline" className="text-[10px]">
                      {formData.attendanceMode}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Registration Fee:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      PKR {calculatedRegFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Conference Dinner:</span>
                    <span className={`font-bold ${formData.attendDinner ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'}`}>
                      {formData.attendDinner ? `+ PKR ${calculatedDinnerFee.toLocaleString()}` : 'PKR 0'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block font-heading">
                        Grand Total Payable
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Immutable Backend Verification Snapshot
                      </span>
                    </div>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                      PKR {calculatedGrandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  {!isApproved ? (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs gap-2 shadow-md"
                    >
                      {submitting ? 'Saving Registration...' : existingReg ? 'Update Registration' : 'Complete Conference Registration'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-center font-bold">
                      Registration Approved & Locked
                    </div>
                  )}

                  {existingReg && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard/payment')}
                      className="w-full mt-2 text-xs h-9 border-slate-300"
                    >
                      Proceed to Payment & Verification
                    </Button>
                  )}
                </div>

                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Administrative Guarantee:
                  </p>
                  <p>
                    Backend independently computes payable fees against authenticated category criteria. Submitting creates a draft order ready for bank transfer upload.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
