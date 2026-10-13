import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function SplitText({ text = '', className = '', delay = 0.05 }) {
  const words = text.split(' ');

  return (
    <span className={cn('inline-block', className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-1.5">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: (wordIndex * 4 + charIndex) * delay,
                ease: 'easeOut',
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
