import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  X,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Tag,
  CreditCard,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultSchedule } from '@/features/shared/scheduleData';
import {
  getCategoriesForDay,
  getCategorySelectedCount,
  getDaySelectedCount,
  findActivityInSchedule,
} from '../activityHierarchy';
import {
  findConflictingActivity,
  formatConflictMessage,
  isNonExclusiveActivity,
} from '../timeConflictEngine';

export function HierarchicalActivityModal({
  isOpen,
  onClose,
  initialDay = 'Day 1',
  selectedActivityIds = [],
  onToggleActivity,
  onSwitchActivity,
  feeConfig = {},
  formData = {},
  currentUser = null,
  onContinue,
}) {
  const [activeDay, setActiveDay] = useState(initialDay);
  const [activeCategory, setActiveCategory] = useState(null);
  const [conflictAlert, setConflictAlert] = useState(null);
  const [mobileInvoiceOpen, setMobileInvoiceOpen] = useState(false);

  // Sync activeDay if initialDay changes when opened
  useEffect(() => {
    if (isOpen) {
      setActiveDay(initialDay);
      setActiveCategory(null);
      setConflictAlert(null);
      setMobileInvoiceOpen(false);
    }
  }, [isOpen, initialDay]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (activeCategory) {
          setActiveCategory(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeCategory, onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const categories = useMemo(() => getCategoriesForDay(activeDay), [activeDay]);

  // Counts
  const day1Count = useMemo(() => getDaySelectedCount('Day 1', selectedActivityIds), [selectedActivityIds]);
  const day2Count = useMemo(() => getDaySelectedCount('Day 2', selectedActivityIds), [selectedActivityIds]);

  // Get full activity objects for selected IDs
  const selectedActivitiesList = useMemo(() => {
    return selectedActivityIds
      .map((id) => defaultSchedule.find((act) => act.id === id || act.title === id))
      .filter(Boolean);
  }, [selectedActivityIds]);

  const day1Selected = useMemo(
    () => selectedActivitiesList.filter((a) => a.day === 'Day 1'),
    [selectedActivitiesList]
  );
  const day2Selected = useMemo(
    () => selectedActivitiesList.filter((a) => a.day === 'Day 2'),
    [selectedActivitiesList]
  );

  // Pricing calculation
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
  const totalPayable = (Number(baseRegistrationFee) || 1000) + dinnerFee;
  const currency = feeConfig?.currency || 'PKR';

  if (!isOpen) return null;

  // Session selection handler
  const handleSessionClick = (session) => {
    // Find canonical schedule item
    const canonicalActivity = findActivityInSchedule(session.id) || session;
    const isSelected =
      selectedActivityIds.includes(canonicalActivity.id) ||
      selectedActivityIds.includes(canonicalActivity.title);

    // Deselect if already selected
    if (isSelected) {
      setConflictAlert(null);
      onToggleActivity(canonicalActivity);
      return;
    }

    // Check for schedule conflict
    const conflicting = findConflictingActivity(
      canonicalActivity,
      selectedActivityIds,
      defaultSchedule
    );

    if (conflicting) {
      setConflictAlert({
        candidate: canonicalActivity,
        conflicting,
        message: formatConflictMessage(canonicalActivity, conflicting),
      });
      return;
    }

    setConflictAlert(null);
    onToggleActivity(canonicalActivity);
  };

  const handleResolveConflict = () => {
    if (!conflictAlert) return;
    const { candidate, conflicting } = conflictAlert;
    onSwitchActivity?.(candidate, conflicting);
    setConflictAlert(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Row */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Day Switcher Segmented Tabs */}
            <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveDay('Day 1');
                  setActiveCategory(null);
                  setConflictAlert(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeDay === 'Day 1'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Day 1 (22 Dec)</span>
                {day1Count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-black ${
                      activeDay === 'Day 1' ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {day1Count}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveDay('Day 2');
                  setActiveCategory(null);
                  setConflictAlert(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeDay === 'Day 2'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Day 2 (23 Dec)</span>
                {day2Count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-black ${
                      activeDay === 'Day 2' ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {day2Count}
                  </span>
                )}
              </button>
            </div>

            {/* Breadcrumb Indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              <span>{activeDay === 'Day 1' ? 'Tuesday, 22 Dec' : 'Wednesday, 23 Dec'}</span>
              {activeCategory && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {activeCategory.title}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile itinerary toggle button */}
            <button
              type="button"
              onClick={() => setMobileInvoiceOpen(!mobileInvoiceOpen)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedActivitiesList.length} Selected</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close activity selector"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conflict Warning Banner (if triggered) */}
        {conflictAlert && (
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/50 border-b-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 animate-in slide-in-from-top-1">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold">Schedule Overlap Detected: </span>
                <span>{conflictAlert.message}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setConflictAlert(null)}
                className="h-8 text-xs font-semibold border-amber-300 dark:border-amber-700 hover:bg-amber-100"
              >
                Keep Current
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleResolveConflict}
                className="h-8 text-xs bg-amber-700 hover:bg-amber-800 text-white gap-1 font-bold shadow-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Switch to This
              </Button>
            </div>
          </div>
        )}

        {/* Main Modal Body: Two-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* LEFT COLUMN: Categories (Level 1) or Sessions (Level 2) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
            {/* LEVEL 1: Category Selection Grid */}
            {!activeCategory ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3
                      id="modal-title"
                      className="text-lg sm:text-xl font-extrabold font-heading text-slate-900 dark:text-white"
                    >
                      {activeDay} Schedule Categories
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Click a category below to explore sessions, keynotes, and workshops.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold shrink-0">
                    {categories.length} Categories
                  </Badge>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {categories.map((cat) => {
                    const selCount = getCategorySelectedCount(cat, selectedActivityIds);
                    const isSelected = selCount > 0;

                    return (
                      <div
                        key={cat.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setActiveCategory(cat);
                          setConflictAlert(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            setActiveCategory(cat);
                          }
                        }}
                        className={`group relative rounded-2xl border-2 p-4 text-left cursor-pointer transition-all duration-200 outline-none flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-emerald-600 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <div>
                          {/* Badges Row */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider py-0.5 px-2 ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 bg-slate-50 dark:bg-slate-800'
                              }`}
                            >
                              {cat.badge}
                            </Badge>

                            <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="whitespace-nowrap">{cat.time}</span>
                            </span>
                          </div>

                          {/* Category Title */}
                          <h4 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                            {cat.title}
                          </h4>
                        </div>

                        {/* Card Footer: Venue and Action */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{cat.venue.split('·')[0].trim()}</span>
                          </span>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{selCount} Selected</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 transition-colors">
                              <span>Select</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* LEVEL 2: Sessions Inside Selected Category */
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Back to Categories Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setConflictAlert(null);
                  }}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to {activeDay} Categories</span>
                </button>

                {/* Category Header Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-slate-50 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Badge variant="outline" className="text-xs font-bold border-emerald-600 text-emerald-800 dark:text-emerald-300 bg-white/80">
                      {activeCategory.track}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {activeCategory.time}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {activeCategory.venue}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {activeCategory.title}
                  </h3>
                </div>

                {/* Available Sessions List */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                    Available Sessions / Activity Entries:
                  </h4>

                  {activeCategory.sessions?.map((session) => {
                    const canonical = findActivityInSchedule(session.id) || session;
                    const isSelected =
                      selectedActivityIds.includes(canonical.id) ||
                      selectedActivityIds.includes(canonical.title);
                    const conflictWith = !isSelected
                      ? findConflictingActivity(canonical, selectedActivityIds, defaultSchedule)
                      : null;

                    return (
                      <div
                        key={session.id}
                        className={`rounded-2xl border-2 p-5 text-left transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-600/60 shadow-sm'
                            : conflictWith
                            ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3 text-emerald-600" />
                                {session.time}
                              </span>
                              <Badge variant="outline" className="text-[10px] font-bold border-emerald-400 text-emerald-800 dark:text-emerald-300">
                                Included in Pass
                              </Badge>
                            </div>

                            <h5 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
                              {session.title}
                            </h5>
                          </div>

                          {/* Select / Deselect Button */}
                          <div className="shrink-0">
                            {session.isInformational ? (
                              <Badge variant="outline" className="text-xs font-bold bg-slate-100 text-slate-600">
                                Informational Session
                              </Badge>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleSessionClick(session)}
                                className={`h-10 px-5 font-bold rounded-xl text-xs sm:text-sm gap-2 transition-all ${
                                  isSelected
                                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                    : conflictWith
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <Check className="w-4 h-4 stroke-[3]" />
                                    <span>Selected</span>
                                  </>
                                ) : conflictWith ? (
                                  <>
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Switch to This</span>
                                  </>
                                ) : (
                                  <span>Select Activity</span>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Venue & Speaker Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{session.venue}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{session.speaker}</span>
                          </div>
                        </div>

                        {/* Sub-Sessions Breakdown (e.g. for Track 1A, 1B, 2A, 2B, 3A, 3B) */}
                        {session.subSessions && session.subSessions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl">
                            <span className="text-[11px] uppercase font-extrabold tracking-wider text-slate-500 block">
                              Track Programme Details ({session.subSessions.length} Scheduled Parts):
                            </span>
                            <div className="space-y-1.5">
                              {session.subSessions.map((sub, idx) => (
                                <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                      {sub.title}
                                    </p>
                                    <p className="text-[11px] text-slate-500">{sub.speaker} · {sub.venue}</p>
                                  </div>
                                  <span className="font-mono text-slate-600 dark:text-slate-400 shrink-0 text-[11px]">
                                    {sub.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Conflict Note if present */}
                        {conflictWith && !isSelected && (
                          <div className="mt-3 pt-2 border-t border-amber-200/80 dark:border-amber-900/60 flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                            <span className="truncate">
                              Overlaps with your selected: {conflictWith.title.split('·')[0].trim()} ({conflictWith.time})
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Invoice & Selection Summary (Desktop) */}
          <div
            className={`${
              mobileInvoiceOpen ? 'block' : 'hidden lg:flex'
            } w-full lg:w-[320px] xl:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 p-4 sm:p-5 flex-col justify-between overflow-y-auto`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Live Itinerary
                  </span>
                  <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                    Selected Sessions
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs font-bold border-emerald-500 text-emerald-800 dark:text-emerald-300">
                  {selectedActivitiesList.length} {selectedActivitiesList.length === 1 ? 'Event' : 'Events'}
                </Badge>
              </div>

              {/* Day 1 Selections */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Day 1 (22 Dec)
                  </span>
                  <span className="text-[11px] text-slate-400">{day1Selected.length} selected</span>
                </div>

                {day1Selected.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pl-5">No Day 1 sessions selected yet</p>
                ) : (
                  <ul className="space-y-1.5">
                    {day1Selected.map((act) => (
                      <li
                        key={act.id}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {act.title}
                          </p>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {act.time}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleActivity(act)}
                          aria-label={`Remove ${act.title}`}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Day 2 Selections */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Day 2 (23 Dec)
                  </span>
                  <span className="text-[11px] text-slate-400">{day2Selected.length} selected</span>
                </div>

                {day2Selected.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pl-5">No Day 2 sessions selected yet</p>
                ) : (
                  <ul className="space-y-1.5">
                    {day2Selected.map((act) => (
                      <li
                        key={act.id}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {act.title}
                          </p>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {act.time}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleActivity(act)}
                          aria-label={`Remove ${act.title}`}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Selected Sessions:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  {selectedActivitiesList.length} {selectedActivitiesList.length === 1 ? 'session' : 'sessions'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Conference registration fee and invoice details will be displayed in Step 3 (Personal Details).
              </p>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs"
                >
                  Done with Activity Selection
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Compact status & done action) */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="font-bold">{selectedActivitiesList.length}</span>
            <span>{selectedActivitiesList.length === 1 ? 'activity' : 'activities'} selected across Day 1 & Day 2</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 text-xs font-semibold rounded-xl"
            >
              Close Popup
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => {
                onClose();
                if (selectedActivitiesList.length > 0 && onContinue) {
                  onContinue();
                }
              }}
              disabled={selectedActivitiesList.length === 0}
              className="h-9 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 disabled:opacity-50"
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
