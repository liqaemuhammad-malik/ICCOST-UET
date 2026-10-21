import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MapPin,
  Utensils,
  Compass,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultSchedule } from '@/features/shared/scheduleData';

export function ActivitySummarySidebar({
  participationType,
  selectedActivityIds = [],
  presenterData = {},
  formData = {},
  currentStep = 1,
  onContinue,
  canContinue = true,
  continueText = 'Continue',
  feeConfig = {
    ieeeStudentPhysical: 1000,
    ieeeStudentVirtual: 1000,
    nonIeeeProfessionalPhysical: 2000,
    nonIeeeProfessionalVirtual: 2000,
    dinnerFee: 5000,
    currency: 'PKR',
  },
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Separate selected activities into Day 1 & Day 2
  const selectedActivities = defaultSchedule.filter(
    (act) => selectedActivityIds.includes(act.id) || selectedActivityIds.includes(act.title)
  );

  const day1Activities = selectedActivities.filter((act) => act.day === 'Day 1');
  const day2Activities = selectedActivities.filter((act) => act.day === 'Day 2');

  // Authoritative fee calculation preview
  const isStudent = (formData.participantCategory || 'IEEE_MEMBER_STUDENT') === 'IEEE_MEMBER_STUDENT';
  const isVirtual = formData.attendanceMode === 'VIRTUAL';

  const baseRegistrationFee = isStudent
    ? isVirtual
      ? feeConfig?.ieeeStudentVirtual ?? 1000
      : feeConfig?.ieeeStudentPhysical ?? 1000
    : isVirtual
    ? feeConfig?.nonIeeeProfessionalVirtual ?? 2000
    : feeConfig?.nonIeeeProfessionalPhysical ?? 2000;

  const dinnerFee = formData.attendDinner ? (feeConfig?.dinnerFee ?? 5000) : 0;
  const totalPayable = (baseRegistrationFee || 0) + (dinnerFee || 0);
  const currency = feeConfig?.currency || 'PKR';

  return (
    <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 min-w-0">
      {/* Mobile Collapsible Header */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-900 dark:text-white">
              Itinerary ({selectedActivities.length} {selectedActivities.length === 1 ? 'event' : 'events'})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono text-base">
              {currency} {totalPayable.toLocaleString()}
            </span>
            {mobileExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>
      </div>

      {/* Main Summary Card (Always visible on desktop, toggleable on mobile) */}
      <div
        className={`${
          mobileExpanded ? 'block' : 'hidden'
        } lg:block rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sticky top-24 space-y-5`}
      >
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registration Summary
            </span>
            <Badge variant="outline" className="text-xs font-bold border-emerald-500 text-emerald-800 dark:text-emerald-300 py-0.5 px-2">
              Live Itinerary
            </Badge>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
            {participationType === 'PRESENTER' ? (
              <>
                <Award className="w-5 h-5 text-amber-600" />
                Presenter Track
              </>
            ) : (
              <>
                <Compass className="w-5 h-5 text-emerald-600" />
                Visitor Registration
              </>
            )}
          </h3>
        </div>

        {/* Presenter Track Info */}
        {participationType === 'PRESENTER' && presenterData.stream && (
          <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm">
            <p className="font-bold text-amber-950 dark:text-amber-200">
              {presenterData.stream === 'PAPER_PRESENTATION'
                ? 'Paper Presentation Track'
                : presenterData.stream === 'WORKSHOPS'
                ? 'Workshop Session Instructor'
                : 'Brainiac 2026 Project Showcase'}
            </p>
            {presenterData.paperTitle && (
              <p className="text-xs text-amber-900 dark:text-amber-300 truncate mt-1">
                Title: {presenterData.paperTitle}
              </p>
            )}
            {presenterData.teamName && (
              <p className="text-xs text-amber-900 dark:text-amber-300 truncate mt-1">
                Team: {presenterData.teamName}
              </p>
            )}
          </div>
        )}

        {/* Selected Activities List */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {/* Day 1 Selections */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Day 1 · 22 Dec 2026
              </span>
              <Badge variant="outline" className="text-[10px] font-bold">
                {day1Activities.length} {day1Activities.length === 1 ? 'event' : 'events'}
              </Badge>
            </div>

            {day1Activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-5">No Day 1 sessions selected yet</p>
            ) : (
              <ul className="space-y-2">
                {day1Activities.map((act) => (
                  <li
                    key={act.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {act.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {act.time}
                      </span>
                      <span className="truncate max-w-[120px]">{act.venue.split('·')[0].trim()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Day 2 Selections */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Day 2 · 23 Dec 2026
              </span>
              <Badge variant="outline" className="text-[10px] font-bold">
                {day2Activities.length} {day2Activities.length === 1 ? 'event' : 'events'}
              </Badge>
            </div>

            {day2Activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-5">No Day 2 sessions selected yet</p>
            ) : (
              <ul className="space-y-2">
                {day2Activities.map((act) => (
                  <li
                    key={act.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {act.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {act.time}
                      </span>
                      <span className="truncate max-w-[120px]">{act.venue.split('·')[0].trim()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
            <span className="truncate">Admission ({isStudent ? 'Student / IEEE' : 'Professional'}):</span>
            <span className="font-bold text-slate-900 dark:text-white shrink-0 font-mono text-sm sm:text-base">
              {currency} {Number(baseRegistrationFee || 0).toLocaleString()}
            </span>
          </div>

          {formData.attendDinner && (
            <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 truncate">
                <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Gala Dinner Pass:
              </span>
              <span className="font-bold text-slate-900 dark:text-white shrink-0 font-mono text-sm sm:text-base">
                {currency} {Number(dinnerFee || 0).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
            <span className="font-extrabold text-sm sm:text-base">Total Payable:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-300 font-mono shrink-0">
              {currency} {Number(totalPayable || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Continue button inside sidebar if step is 2 or 3 */}
        {onContinue && currentStep < 4 && (
          <Button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full h-11 sm:h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            {continueText}
          </Button>
        )}
      </div>
    </aside>
  );
}
