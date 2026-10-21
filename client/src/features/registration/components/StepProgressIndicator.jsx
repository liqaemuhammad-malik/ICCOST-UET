import React from 'react';
import { Check, UserCheck, Calendar, User, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Participation Type', shortName: 'Type', icon: UserCheck },
  { id: 2, name: 'Activity Selection', shortName: 'Activities', icon: Calendar },
  { id: 3, name: 'Personal Details', shortName: 'Details', icon: User },
  { id: 4, name: 'Confirmation', shortName: 'Done', icon: CheckCircle2 },
];

export function StepProgressIndicator({ currentStep, onStepClick, maxReachableStep = 1 }) {
  return (
    <nav aria-label="Registration Progress" className="w-full">
      {/* Desktop & Tablet Progress Bar */}
      <ol className="hidden sm:flex items-center justify-between w-full">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = step.id <= maxReachableStep && step.id !== currentStep && currentStep !== STEPS.length;
          const StepIcon = step.icon;

          return (
            <li
              key={step.id}
              className={`flex-1 relative flex items-center ${
                index !== STEPS.length - 1
                  ? 'after:content-[""] after:w-full after:h-[2px] after:border-b-2 after:border-slate-200 dark:after:border-slate-700 after:inline-block after:mx-3 after:transition-all after:duration-300'
                  : ''
              } ${isCompleted ? 'after:!border-emerald-600' : ''}`}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(step.id)}
                className={`group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl p-1.5 transition-all ${
                  isClickable ? 'cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/60' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-700 text-white shadow-emerald-700/30'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/80 shadow-md shadow-emerald-600/30 scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <StepIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Step {step.id}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-emerald-800 dark:text-emerald-400 font-extrabold'
                        : isCompleted
                        ? 'text-slate-800 dark:text-slate-200 font-semibold'
                        : 'text-slate-400 dark:text-slate-500 font-medium'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Mobile Compact Progress Bar */}
      <div className="sm:hidden flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
            {currentStep}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {STEPS.find((s) => s.id === currentStep)?.name}
            </span>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.id === currentStep
                  ? 'w-6 bg-emerald-600'
                  : s.id < currentStep
                  ? 'w-2.5 bg-emerald-400'
                  : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
