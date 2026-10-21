import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultSchedule } from '@/features/shared/scheduleData';
import { getDaySelectedCount } from '../activityHierarchy';
import { HierarchicalActivityModal } from './HierarchicalActivityModal';

export function VisitorActivitySelector({
  selectedActivityIds = [],
  onToggleActivity,
  onSwitchActivity,
  onBack,
  onContinue,
  feeConfig = {},
  formData = {},
  currentUser = null,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState('Day 1');

  // Selected counts
  const day1Count = useMemo(
    () => getDaySelectedCount('Day 1', selectedActivityIds),
    [selectedActivityIds]
  );
  const day2Count = useMemo(
    () => getDaySelectedCount('Day 2', selectedActivityIds),
    [selectedActivityIds]
  );

  // Selected activities list
  const selectedActivities = useMemo(() => {
    return selectedActivityIds
      .map((id) => defaultSchedule.find((act) => act.id === id || act.title === id))
      .filter(Boolean);
  }, [selectedActivityIds]);

  const handleOpenDayModal = (day) => {
    setModalDay(day);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Select Conference Activities
        </h2>
      </div>

      {/* Two Primary Day Selection Cards (Initial Level as requested) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {/* DAY 1 CARD */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleOpenDayModal('Day 1')}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleOpenDayModal('Day 1');
            }
          }}
          className={`group relative rounded-3xl border-2 p-6 cursor-pointer transition-all duration-200 text-left outline-none flex flex-col justify-between ${day1Count > 0
            ? 'border-emerald-600 bg-gradient-to-br from-emerald-50/90 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 ring-2 ring-emerald-600/60 shadow-lg shadow-emerald-700/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-1'
            }`}
        >
          <div>
            {/* Top row: Calendar Date Badge & Selected Counter */}
            <div className="flex items-start justify-between gap-3 mb-4">
              {day1Count > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{day1Count} {day1Count === 1 ? 'Selected' : 'Selected'}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                  0 Selected
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
              Day 1 — Tuesday, 22 Dec 2026
            </h3>


            {/* Venue & Tracks Pill List */}
            {/* <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">KICS Seminar Complex & Main Auditorium, UET Lahore</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">Opening Ceremony</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">Industrial Expo</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">Invited Talks</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">AI Workshops</span>
              </div>
            </div> */}
          </div>

          {/* Action Button at bottom */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">10 Categories Available</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              <span>{day1Count > 0 ? 'Edit Day 1 Selections' : 'Open Day 1 Categories'}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* DAY 2 CARD */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleOpenDayModal('Day 2')}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleOpenDayModal('Day 2');
            }
          }}
          className={`group relative rounded-3xl border-2 p-6 cursor-pointer transition-all duration-200 text-left outline-none flex flex-col justify-between ${day2Count > 0
            ? 'border-emerald-600 bg-gradient-to-br from-emerald-50/90 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 ring-2 ring-emerald-600/60 shadow-lg shadow-emerald-700/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-1'
            }`}
        >
          <div>
            {/* Top row: Calendar Date Badge & Selected Counter */}
            <div className="flex items-start justify-between gap-3 mb-4">
              {day2Count > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{day2Count} {day2Count === 1 ? 'Selected' : 'Selected'}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                  0 Selected
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
              Day 2 — Wednesday, 23 Dec 2026
            </h3>

            {/* Venue & Tracks Pill List */}
            {/* <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">KICS Seminar Complex & Main Auditorium, UET Lahore</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">Technofest 2026</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">Brainiac Project</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">NCAI Workshop</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">Closing & Awards</span>
              </div>
            </div> */}
          </div>

          {/* Action Button at bottom */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">8 Categories Available</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              <span>{day2Count > 0 ? 'Edit Day 2 Selections' : 'Open Day 2 Categories'}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Selected Activities Overview Strip */}
      {/* <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Selected Activities ({selectedActivities.length})
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDayModal('Day 1')}
              className="h-8 text-xs font-semibold rounded-lg"
            >
              Browse Day 1
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDayModal('Day 2')}
              className="h-8 text-xs font-semibold rounded-lg"
            >
              Browse Day 2
            </Button>
          </div>
        </div>

        {selectedActivities.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
            No conference activities selected yet. Click either <strong className="text-slate-700 dark:text-slate-300">Day 1</strong> or <strong className="text-slate-700 dark:text-slate-300">Day 2</strong> above to select your sessions.
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedActivities.map((act) => (
              <div
                key={act.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
              >
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold py-0 px-1.5 ${act.day === 'Day 1'
                    ? 'border-emerald-500 text-emerald-800 dark:text-emerald-300'
                    : 'border-blue-500 text-blue-800 dark:text-blue-300'
                    }`}
                >
                  {act.day}
                </Badge>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {act.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">({act.time})</span>
                <button
                  type="button"
                  onClick={() => onToggleActivity(act)}
                  aria-label={`Remove ${act.title}`}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 sm:h-12 text-sm font-semibold px-6 border-slate-200 dark:border-slate-700 gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        <Button
          type="button"
          onClick={onContinue}
          disabled={selectedActivityIds.length === 0}
          className="h-11 sm:h-12 text-sm sm:text-base px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          <span>Continue with {selectedActivityIds.length} {selectedActivityIds.length === 1 ? 'Activity' : 'Activities'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Hierarchical Activity Selection Modal */}
      <HierarchicalActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialDay={modalDay}
        selectedActivityIds={selectedActivityIds}
        onToggleActivity={onToggleActivity}
        onSwitchActivity={onSwitchActivity}
        feeConfig={feeConfig}
        formData={formData}
        currentUser={currentUser}
        onContinue={() => {
          setModalOpen(false);
          if (onContinue) onContinue();
        }}
      />
    </div>
  );
}
