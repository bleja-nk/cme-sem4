'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { DecisionStep, Choice } from '@/lib/types';
import TimerBar from './TimerBar';

const STEP_AMBIENCE = [
  { gradient: 'linear-gradient(to bottom, rgba(10,20,50,0.9) 0%, transparent 100%)', label: 'RIVERSIDE GENERAL — BOARDROOM' },
  { gradient: 'linear-gradient(to bottom, rgba(8,25,40,0.9) 0%, transparent 100%)', label: 'RIVERSIDE GENERAL — LEGAL & COMPLIANCE' },
  { gradient: 'linear-gradient(to bottom, rgba(45,8,8,0.9) 0%, transparent 100%)', label: 'RIVERSIDE GENERAL — QUALITY ASSURANCE' },
  { gradient: 'linear-gradient(to bottom, rgba(8,8,8,0.92) 0%, transparent 100%)', label: 'CITY PAPER — EDITORIAL FLOOR' },
  { gradient: 'linear-gradient(to bottom, rgba(38,18,4,0.9) 0%, transparent 100%)', label: 'COMMUNITY HALL — RIVERSIDE DISTRICT' },
  { gradient: 'linear-gradient(to bottom, rgba(8,12,32,0.9) 0%, transparent 100%)', label: 'STATE HEALTH POLICY CONVENING' },
] as const;

interface DecisionInterfaceProps {
  step: DecisionStep;
  stepCount: number;
  onChoose: (choice: Choice) => void;
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

interface ChoiceCardProps {
  choice: Choice;
  isSelected: boolean;
  isAnySelected: boolean;
  onSelect: () => void;
}

function ChoiceCard({ choice, isSelected, isAnySelected, onSelect }: ChoiceCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={ITEM}
      whileHover={prefersReducedMotion || isAnySelected ? {} : { y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <button
        onClick={onSelect}
        disabled={isAnySelected && !isSelected}
        aria-pressed={isSelected}
        className={`w-full text-left rounded-xl border p-5 transition-all duration-200 group
          ${isSelected
            ? 'border-[#1e40af] bg-[#eff6ff] shadow-md ring-2 ring-[#1e40af]/20'
            : isAnySelected
            ? 'border-paper-100 bg-paper-50 opacity-40 cursor-not-allowed'
            : 'border-paper-200 bg-white hover:border-[#6b7494] hover:shadow-sm cursor-pointer'
          }`}
      >
        {/* Label */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`text-sm font-sans font-semibold leading-snug transition-colors ${
              isSelected ? 'text-[#1e40af]' : 'text-paper-900'
            }`}
          >
            {choice.label}
          </span>
          {isSelected && (
            <span
              className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1e40af] text-white text-xs"
              aria-hidden="true"
            >
              ✓
            </span>
          )}
        </div>

        {/* Full text */}
        <p className="text-paper-700 font-sans text-sm leading-6 mb-4">{choice.text}</p>

        {/* Tradeoff */}
        <div
          className={`flex gap-2 border-t pt-3 transition-colors ${
            isSelected ? 'border-[#1e40af]/20' : 'border-paper-100'
          }`}
        >
          <span
            className="flex-shrink-0 text-[#b45309] text-xs mt-0.5"
            aria-hidden="true"
          >
            ⚠
          </span>
          <p
            className={`text-xs font-sans leading-5 italic ${
              isSelected ? 'text-[#1e40af]' : 'text-paper-500'
            }`}
          >
            {choice.tradeoffNote}
          </p>
        </div>
      </button>
    </motion.div>
  );
}

// currentScores intentionally not destructured — panel hidden during decision phase
export default function DecisionInterface({
  step,
  stepCount,
  onChoose,
}: DecisionInterfaceProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [timerElapsed, setTimerElapsed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleSelect = useCallback(
    (choice: Choice) => {
      if (selectedChoiceId) return;
      setSelectedChoiceId(choice.id);

      // Brief delay before transitioning to consequence
      setTimeout(() => {
        onChoose(choice);
      }, 600);
    },
    [selectedChoiceId, onChoose]
  );

  const handleTimerElapsed = useCallback(() => {
    setTimerElapsed(true);
  }, []);

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-paper-200 px-6 py-4 md:px-10 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5" aria-label={`Step ${step.stepNumber} of ${stepCount}`}>
              {Array.from({ length: stepCount }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-1 rounded-full transition-all duration-300 ${
                    i < step.stepNumber
                      ? 'bg-[#1e40af] w-6'
                      : i === step.stepNumber - 1
                      ? 'bg-[#1e40af] w-6'
                      : 'bg-paper-200 w-4'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs text-paper-400 font-sans">
              Decision {step.stepNumber} of {stepCount}
            </span>
          </div>

          {/* Timer */}
          <TimerBar
            totalSeconds={step.timerSeconds}
            urgencyLabel={step.urgencyLabel}
            onElapsed={handleTimerElapsed}
          />
        </div>
      </div>

      {/* Ambient step banner */}
      <div
        className="w-full h-20"
        style={{ background: STEP_AMBIENCE[Math.min(step.stepNumber - 1, 5)].gradient }}
        aria-hidden="true"
      >
        <div className="max-w-3xl mx-auto h-full flex items-end pb-3 px-6 md:px-10">
          <span className="text-[10px] tracking-[0.22em] uppercase font-sans text-white/25 select-none">
            {STEP_AMBIENCE[Math.min(step.stepNumber - 1, 5)].label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 pt-6 pb-10 md:px-10">
        <motion.div
          variants={prefersReducedMotion ? {} : STAGGER}
          initial={prefersReducedMotion ? {} : 'hidden'}
          animate="visible"
          key={step.id}
        >
          {/* Step title */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM} className="mb-8">
            <p className="text-xs tracking-[0.18em] uppercase text-paper-500 font-sans font-medium mb-2">
              Step {step.stepNumber}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-paper-950 leading-tight mb-1">
              {step.title}
            </h1>
          </motion.div>

          {/* Context */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM} className="mb-8">
            <div className="prose prose-sm max-w-none">
              {step.context.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className={`font-sans leading-7 mb-4 ${
                    i === 0 ? 'text-paper-900 text-base' : 'text-paper-700 text-sm'
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Evidence gaps */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM} className="mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs tracking-[0.15em] uppercase text-amber-700 font-sans font-medium mb-3">
                Information gaps
              </p>
              <ul className="space-y-2" aria-label="Missing or contested information">
                {step.evidenceGaps.map((gap, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-500 text-xs mt-1 flex-shrink-0" aria-hidden="true">–</span>
                    <span className="text-amber-900 font-sans text-xs leading-5">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Stakeholder pressures */}
          {Object.keys(step.stakeholderPressures).length > 0 && (
            <motion.div variants={prefersReducedMotion ? {} : ITEM} className="mb-8">
              <p className="text-xs tracking-[0.15em] uppercase text-paper-500 font-sans font-medium mb-3">
                Who&apos;s watching
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(step.stakeholderPressures).map(([key, pressure]) => {
                  const icons: Record<string, string> = {
                    patients: '🏥',
                    marginalized: '⚖️',
                    clinicians: '👩‍⚕️',
                    board: '🏛️',
                    regulators: '📋',
                    media: '📰',
                  };
                  return (
                    <div
                      key={key}
                      className="flex gap-2 bg-paper-100 rounded-lg px-3 py-2.5"
                    >
                      <span className="text-sm flex-shrink-0" aria-hidden="true">
                        {icons[key] ?? '•'}
                      </span>
                      <p className="text-paper-700 font-sans text-xs leading-5">{pressure}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Timer elapsed notice */}
          <AnimatePresence>
            {timerElapsed && !selectedChoiceId && (
              <motion.div
                className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-3"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
              >
                <p className="text-red-700 font-sans text-sm">
                  The pressure window has passed. Real decisions get made regardless of readiness.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-paper-500 font-sans font-medium mb-4">
              Your decision
            </p>
            <div className="space-y-3" role="group" aria-label="Available choices">
              {step.choices.map(choice => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  isSelected={selectedChoiceId === choice.id}
                  isAnySelected={selectedChoiceId !== null}
                  onSelect={() => handleSelect(choice)}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
