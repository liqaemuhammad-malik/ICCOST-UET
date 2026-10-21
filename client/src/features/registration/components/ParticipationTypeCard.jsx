import React from 'react';
import { Compass, Award, ArrowRight, CheckCircle2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ParticipationTypeCard({ selectedType, onSelectType, onContinue }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Heading */}
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {/* OPTION A - VISITOR */}
        <div
          role="radio"
          aria-checked={selectedType === 'VISITOR'}
          tabIndex={0}
          onClick={() => onSelectType('VISITOR')}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onSelectType('VISITOR');
            }
          }}
          className={`group relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 text-left outline-none ${selectedType === 'VISITOR'
            ? 'border-emerald-600 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 ring-2 ring-emerald-600/60 shadow-lg shadow-emerald-700/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-1'
            }`}
        >
          {/* Card Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${selectedType === 'VISITOR'
                ? 'bg-emerald-700 text-white shadow-emerald-700/30 scale-105'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                }`}
            >
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className={`text-xs font-bold uppercase tracking-wider py-1 px-3 ${selectedType === 'VISITOR'
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800'
                  }`}
              >
                General Delegate
              </Badge>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedType === 'VISITOR'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-slate-400'
                  }`}
              >
                {selectedType === 'VISITOR' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
            Visitor
          </h3>
        </div>

        {/* OPTION B - PRESENTER */}
        <div
          role="radio"
          aria-checked={selectedType === 'PRESENTER'}
          tabIndex={0}
          onClick={() => onSelectType('PRESENTER')}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onSelectType('PRESENTER');
            }
          }}
          className={`group relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 text-left outline-none ${selectedType === 'PRESENTER'
            ? 'border-emerald-600 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 ring-2 ring-emerald-600/60 shadow-lg shadow-emerald-700/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-1'
            }`}
        >
          {/* Card Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${selectedType === 'PRESENTER'
                ? 'bg-emerald-700 text-white shadow-emerald-700/30 scale-105'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}
            >
              <Award className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className={`text-xs font-bold uppercase tracking-wider py-1 px-3 ${selectedType === 'PRESENTER'
                  ? 'border-amber-500 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800'
                  }`}
              >
                Author & Lead
              </Badge>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedType === 'PRESENTER'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-slate-400'
                  }`}
              >
                {selectedType === 'PRESENTER' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
            Presenter
          </h3>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          onClick={onContinue}
          disabled={!selectedType}
          className="h-12 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all gap-2.5 disabled:opacity-50"
        >
          <span>Continue to Activity Selection</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
