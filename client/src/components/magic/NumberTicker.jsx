import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export function NumberTicker({ value, className, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) return;

    const duration = 1200;
    const increment = Math.ceil(end / 40);
    const stepTime = Math.abs(Math.floor(duration / (end / (increment || 1))));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={cn('tabular-nums font-bold font-heading', className)}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
