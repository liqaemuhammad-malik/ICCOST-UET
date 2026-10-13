import React from 'react';
import { cn } from '@/utils/cn';

export function Marquee({ children, className, pauseOnHover = true, reverse = false }) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] select-none',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 justify-around [gap:var(--gap)] animate-marquee',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]'
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
