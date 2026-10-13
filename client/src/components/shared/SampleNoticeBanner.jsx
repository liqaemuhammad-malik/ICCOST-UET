import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SampleNoticeBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs md:text-sm text-amber-900 dark:text-amber-200">
      <div className="container mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="sample" className="uppercase font-bold text-[10px] px-2 py-0.5">
            SAMPLE POLICY
          </Badge>
          <span className="font-medium">
            Official ICOSST 2026 fee schedules & packages are awaiting final Steering Committee approval.
          </span>
        </div>
        <span className="text-amber-800 dark:text-amber-300 text-xs hidden sm:inline">
          All pricing, workshop charges & waivers displayed are hypothetical examples for evaluation.
        </span>
      </div>
    </div>
  );
}
