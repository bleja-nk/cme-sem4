'use client';

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { StakeholderKey, StakeholderScores, StakeholderDeltas } from '@/lib/types';
import { STAKEHOLDERS } from '@/lib/scenario-data';

interface StakeholderPanelProps {
  scores: StakeholderScores;
  pendingDeltas?: StakeholderDeltas;
  compact?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 65) return '#166534';
  if (score >= 50) return '#374151';
  if (score >= 35) return '#b45309';
  return '#991b1b';
}

function getScoreBgColor(score: number): string {
  if (score >= 65) return '#dcfce7';
  if (score >= 50) return '#f4f5f8';
  if (score >= 35) return '#fef3c7';
  return '#fee2e2';
}

function getDeltaLabel(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

interface MeterBarProps {
  stakeholderKey: StakeholderKey;
  score: number;
  pendingDelta?: number;
  compact: boolean;
}

function MeterBar({ stakeholderKey, score, pendingDelta, compact }: MeterBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const stakeholder = STAKEHOLDERS.find(s => s.key === stakeholderKey)!;
  const color = getScoreColor(score);
  const hasDelta = pendingDelta !== undefined && pendingDelta !== 0;
  const projectedScore = hasDelta
    ? Math.max(0, Math.min(100, score + pendingDelta))
    : score;
  const isMarginalized = stakeholderKey === 'marginalized';
  const barColor = isMarginalized ? '#d97706' : color;

  return (
    <div className={`${compact ? 'py-1.5' : 'py-2'} ${isMarginalized && !compact ? 'bg-amber-50 border border-amber-200/70 rounded-lg px-2 -mx-2' : ''}`}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span aria-hidden="true" className="text-sm leading-none flex-shrink-0">
            {stakeholder.icon}
          </span>
          <span
            className="text-xs font-sans font-medium text-paper-800 truncate"
            title={stakeholder.name}
          >
            {stakeholder.shortName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {hasDelta && (
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-xs font-mono font-semibold ${
                pendingDelta! > 0 ? 'text-green-700' : 'text-red-700'
              }`}
              aria-label={`Will change by ${getDeltaLabel(pendingDelta!)}`}
            >
              {getDeltaLabel(pendingDelta!)}
            </motion.span>
          )}
          <span
            className="text-xs font-mono tabular-nums"
            style={{ color }}
            aria-label={`${stakeholder.shortName} trust score: ${score} out of 100`}
          >
            {score}
          </span>
        </div>
      </div>

      {/* Track */}
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{ background: '#e8eaea' }}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${stakeholder.name} trust level`}
      >
        {/* Projected fill (ghost) */}
        {hasDelta && !prefersReducedMotion && (
          <div
            className="absolute top-0 left-0 h-full rounded-full opacity-30"
            style={{
              width: `${projectedScore}%`,
              background: pendingDelta! > 0 ? '#166534' : '#991b1b',
              transition: 'width 0.3s',
            }}
            aria-hidden="true"
          />
        )}
        {/* Actual fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: barColor }}
          initial={prefersReducedMotion ? { width: `${score}%` } : { width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        />
      </div>
      {isMarginalized && !compact && (
        <p className="text-amber-700 text-[10px] font-sans mt-1.5 leading-3">
          This group begins at a disadvantage
        </p>
      )}
    </div>
  );
}

export default function StakeholderPanel({
  scores,
  pendingDeltas,
  compact = false,
}: StakeholderPanelProps) {
  return (
    <aside
      className="bg-white border border-paper-200 rounded-xl p-4 shadow-sm"
      aria-label="Stakeholder trust levels"
    >
      <p className="text-xs tracking-[0.15em] uppercase text-paper-500 font-sans font-medium mb-4">
        Stakeholder impact
      </p>
      <div className={`${compact ? 'space-y-0' : 'space-y-1 divide-y divide-paper-100'}`}>
        {STAKEHOLDERS.map(s => (
          <MeterBar
            key={s.key}
            stakeholderKey={s.key}
            score={scores[s.key]}
            pendingDelta={pendingDeltas?.[s.key]}
            compact={compact}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-paper-400 font-sans leading-4">
        Values represent trust, perceived legitimacy, and harm levels — not preference scores.
      </p>
    </aside>
  );
}
