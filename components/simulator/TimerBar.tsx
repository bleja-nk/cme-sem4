'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface TimerBarProps {
  totalSeconds: number;
  onElapsed?: () => void;
  urgencyLabel: string;
}

export default function TimerBar({ totalSeconds, onElapsed, urgencyLabel }: TimerBarProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const hasElapsed = useRef(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    hasElapsed.current = false;

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!hasElapsed.current) {
            hasElapsed.current = true;
            onElapsed?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSeconds, onElapsed]);

  const pct = (remaining / totalSeconds) * 100;
  const isUrgent = remaining <= totalSeconds * 0.25;
  const isCritical = remaining <= 15;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeLabel = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : `${secs}s`;

  return (
    <div
      className="w-full"
      role="timer"
      aria-label={`Time pressure: ${urgencyLabel}. ${timeLabel} of atmospheric timer remaining.`}
      aria-live="off"
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-sans font-medium text-paper-600 tracking-wide">
          {urgencyLabel}
        </span>
        <span
          className={`text-xs font-mono tabular-nums transition-colors duration-300 ${
            isCritical ? 'text-red-600 font-semibold' :
            isUrgent ? 'text-amber-600' :
            'text-paper-500'
          }`}
          aria-hidden="true"
        >
          {timeLabel}
        </span>
      </div>

      {/* Progress track */}
      <div
        className="h-0.5 w-full bg-paper-200 rounded-full overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className={`h-full rounded-full origin-left transition-colors duration-500 ${
            isCritical ? 'bg-red-500' :
            isUrgent ? 'bg-amber-500' :
            'bg-ink-400'
          }`}
          initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 1 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.95, ease: 'linear' }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Urgency pulse */}
      {isCritical && !prefersReducedMotion && (
        <motion.p
          className="mt-2 text-xs text-red-600 font-sans"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          role="status"
          aria-live="polite"
        >
          Pressure building — a decision must be made.
        </motion.p>
      )}
    </div>
  );
}
