import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Globe,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Utensils,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PersonalInformationForm({
  formData,
  onChangeField,
  errors = {},
  currentUser = null,
  submitting = false,
  serverError = null,
  onBack,
  onContinue,
}) {
  const isAuth = !!currentUser;
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  const handleSubmit = () => {
    if (!agreeTerms) {
      setTermsError('You must acknowledge the conference terms and code of conduct before submitting.');
      return;
    }
    setTermsError('');
    onContinue();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Delegate & Account Information
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {isAuth
            ? `Your verified conference account (${currentUser.email}) is active. Review details below.`
            : 'Enter delegate details for badge generation, official credential verification, and account setup.'}
        </p>
      </div>

      {/* Submission Error Banner */}
      {serverError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-sm sm:text-base">Submission Error</p>
            <p className="mt-1 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Authenticated User Banner */}
      {isAuth && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
            <div>
              <span className="font-extrabold text-sm sm:text-base">Signed in as {currentUser.name}</span>
              <span className="text-emerald-800 dark:text-emerald-300 ml-2 font-medium">({currentUser.email})</span>
            </div>
          </div>
          <Badge variant="outline" className="border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs font-bold py-1 px-3 bg-white/70">
            Account Linked
          </Badge>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Full Name (for Badge & Certificate) *
          </Label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <Input
              id="fullName"
              placeholder="e.g. Engr. Muhammad Haris"
              value={formData.fullName || ''}
              onChange={(e) => onChangeField('fullName', e.target.value)}
              className="pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
            />
          </div>
          {errors.fullName && <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.fullName}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <Input
              id="email"
              type="email"
              placeholder="name@university.edu.pk"
              value={formData.email || ''}
              onChange={(e) => onChangeField('email', e.target.value)}
              disabled={isAuth}
              className={`pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium ${isAuth ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold' : ''
                }`}
            />
          </div>
          {errors.email && <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.email}</p>}
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Contact Phone Number *
          </Label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <Input
              id="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={formData.phone || ''}
              onChange={(e) => onChangeField('phone', e.target.value)}
              className="pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
            />
          </div>
          {errors.phone && <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.phone}</p>}
        </div>

        {/* Organization / University */}
        <div className="space-y-2">
          <Label htmlFor="organization" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Organization / University *
          </Label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <Input
              id="organization"
              placeholder="e.g. UET Lahore, NUST, Systems Ltd"
              value={formData.organization || ''}
              onChange={(e) => onChangeField('organization', e.target.value)}
              className="pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
            />
          </div>
          {errors.organization && (
            <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.organization}</p>
          )}
        </div>

        {/* Designation */}
        {/* <div className="space-y-2">
          <Label htmlFor="designation" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Designation / Student Role
          </Label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <Input
              id="designation"
              placeholder="e.g. Graduate Student, Assistant Professor, ML Engineer"
              value={formData.designation || ''}
              onChange={(e) => onChangeField('designation', e.target.value)}
              className="pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
            />
          </div>
        </div> */}

        {/* Country & City */}
        {/* <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Country
            </Label>
            <Input
              id="country"
              placeholder="Pakistan"
              value={formData.country || 'Pakistan'}
              onChange={(e) => onChangeField('country', e.target.value)}
              className="h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              City
            </Label>
            <Input
              id="city"
              placeholder="Lahore"
              value={formData.city || 'Lahore'}
              onChange={(e) => onChangeField('city', e.target.value)}
              className="h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
            />
          </div>
        </div> */}
      </div>

      {/* Attendance & IEEE Membership Options Panel */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 space-y-5">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
          Attendance Mode & Membership Benefits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Attendance Mode */}
          <div className="space-y-2">
            <Label htmlFor="attendanceMode" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Attendance Mode
            </Label>
            <select
              id="attendanceMode"
              value={formData.attendanceMode || 'PHYSICAL'}
              onChange={(e) => onChangeField('attendanceMode', e.target.value)}
              className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base rounded-xl border border-input bg-background text-foreground font-medium"
            >
              <option value="PHYSICAL">Physical (On-Campus, UET Lahore)</option>
              <option value="VIRTUAL">Virtual (Remote Keynote & Track Stream)</option>
            </select>
            <p className="text-xs text-slate-500">
              Physical includes on-site entry pass, delegate kit, and refreshments.
            </p>
          </div>

          {/* Participant Category (IEEE Student vs Professional) */}
          <div className="space-y-2">
            <Label htmlFor="participantCategory" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Fee Tier
            </Label>
            <select
              id="participantCategory"
              value={formData.participantCategory || 'IEEE_MEMBER_STUDENT'}
              onChange={(e) => onChangeField('participantCategory', e.target.value)}
              className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base rounded-xl border border-input bg-background text-foreground font-medium"
            >
              <option value="IEEE_MEMBER_STUDENT">Student / IEEE Member (PKR 1,000)</option>
              <option value="NON_IEEE_PROFESSIONAL">Non-IEEE Professional / Industry (PKR 2,000)</option>
            </select>
          </div>
        </div>

        {/* IEEE Membership Checkbox & ID */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isIeeeMember || false}
              onChange={(e) => onChangeField('isIeeeMember', e.target.checked)}
              className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              I am an active IEEE Member or Student Member
            </span>
          </label>

          {formData.isIeeeMember && (
            <div className="pl-8 space-y-2 animate-in fade-in duration-200">
              <Label htmlFor="ieeeMembershipNumber" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                IEEE Membership Number *
              </Label>
              <Input
                id="ieeeMembershipNumber"
                placeholder="e.g. 98124810"
                value={formData.ieeeMembershipNumber || ''}
                onChange={(e) => onChangeField('ieeeMembershipNumber', e.target.value)}
                className="h-11 text-sm rounded-xl max-w-sm font-medium"
              />
              {errors.ieeeMembershipNumber && (
                <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.ieeeMembershipNumber}</p>
              )}
            </div>
          )}
        </div>

        {/* Gala Dinner Add-on */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.attendDinner || false}
              onChange={(e) => onChangeField('attendDinner', e.target.checked)}
              className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
            />
            <div>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                Attend Conference Gala Dinner & Cultural Evening (+PKR 5,000)
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Exclusive networking dinner with international keynote speakers, academic leaders, and organizers on 22 December.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Account Security (Password) - ONLY shown for new unauthenticated registrations */}
      {!isAuth && (
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Create Conference Portal Account Password
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your account allows you to track registration status, download your official QR badge, and submit payment proofs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Password (min. 8 characters) *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password || ''}
                onChange={(e) => onChangeField('password', e.target.value)}
                className="h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
              />
              {errors.password && (
                <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword || ''}
                onChange={(e) => onChangeField('confirmPassword', e.target.value)}
                className="h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
              />
              {errors.confirmPassword && (
                <p className="text-xs sm:text-sm text-rose-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Acknowledgment Checkbox */}
      <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-2.5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (e.target.checked) setTermsError('');
            }}
            className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
          />
          <span className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            I confirm that the entered personal information is accurate for official conference indexing, and I agree to adhere to the IEEE ICOSST 2026 Delegate Code of Conduct and attendance policies.
          </span>
        </label>
        {termsError && <p className="text-xs sm:text-sm text-rose-600 font-bold pl-8">{termsError}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="h-11 sm:h-12 text-sm font-semibold px-6 border-slate-200 dark:border-slate-700 gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="h-11 sm:h-12 text-sm sm:text-base px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold gap-2.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Registration...
            </>
          ) : (
            <>
              <span>Confirm & Submit Registration</span>
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
