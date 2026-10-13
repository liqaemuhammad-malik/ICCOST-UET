import React from 'react';
import { NumberTicker } from '@/components/magic/NumberTicker';
import { Users, BookOpen, Trophy, Sparkles } from 'lucide-react';

export function StatTicker() {
  const stats = [
    {
      icon: Sparkles,
      value: 20,
      suffix: 'th',
      label: 'Annual Conference Edition',
      sublabel: 'Established in 2006 by KICS UET',
    },
    {
      icon: Users,
      value: 800,
      suffix: '+',
      label: 'Delegates & Attendees',
      sublabel: 'Academia, Researchers & Industry',
    },
    {
      icon: BookOpen,
      value: 12,
      suffix: '',
      label: 'Specialized Workshops',
      sublabel: 'AI, Cloud, Embedded & Security',
    },
    {
      icon: Trophy,
      value: 4,
      suffix: '',
      label: 'National Competitions',
      sublabel: 'Hackathons & Software Challenges',
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 py-12 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-all hover:shadow-md"
              >
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                    <NumberTicker value={s.value} suffix={s.suffix} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{s.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
