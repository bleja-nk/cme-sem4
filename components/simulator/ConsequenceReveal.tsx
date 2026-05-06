'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { EthicsValue, MadeChoice, StakeholderScores } from '@/lib/types';
import StakeholderPanel from './StakeholderPanel';

const ETHICS_TOOLTIPS: Record<EthicsValue, string> = {
  utilitarian: 'Prioritising the greatest benefit for the greatest number of people',
  procedural: 'Following due process, rules, and established accountability structures',
  autonomy: "Respecting individuals' right to informed consent and self-determination",
  equity: 'Actively protecting and prioritising disadvantaged or marginalised groups',
  transparency: 'Being open with stakeholders, the public, and affected communities',
  precautionary: 'Erring toward caution when evidence is incomplete or contested',
};

interface ConsequenceRevealProps {
  choice: MadeChoice;
  stepTitle: string;
  isLastStep: boolean;
  scores: StakeholderScores;
  onContinue: () => void;
}

const STAGGER = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function ConsequenceReveal({
  choice,
  stepTitle,
  isLastStep,
  scores,
  onContinue,
}: ConsequenceRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="min-h-screen bg-[#111827] flex flex-col"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top strip */}
      <div className="border-b border-white/10 px-6 py-4 md:px-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6b7494] font-sans">
          {stepTitle} — Consequence
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-6 py-10 md:px-12 gap-10">
        {/* Main content */}
        <motion.div
          className="flex-1 space-y-10"
          variants={prefersReducedMotion ? {} : STAGGER}
          initial={prefersReducedMotion ? {} : 'hidden'}
          animate="visible"
        >
          {/* Choice recap */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-3">
              You chose
            </p>
            <div className="border border-white/10 rounded-xl px-6 py-4 bg-white/5">
              <p className="text-[#c8cdd9] font-sans font-medium text-base leading-relaxed">
                {choice.choiceLabel}
              </p>
            </div>
          </motion.div>

          {/* Consequence narrative */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-3">
              What unfolds
            </p>
            <p className="text-[#9da5b8] font-sans text-base leading-7">
              {choice.consequenceText}
            </p>
          </motion.div>

          {/* Headlines / memos */}
          {choice.consequenceHeadlines.length > 0 && (
            <motion.div variants={prefersReducedMotion ? {} : ITEM}>
              <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-4">
                From the record
              </p>
              <div className="space-y-3">
                {choice.consequenceHeadlines.map((headline, i) => (
                  <motion.div
                    key={i}
                    className="border-l-2 border-[#2c3347] pl-4 py-1"
                    variants={prefersReducedMotion ? {} : ITEM}
                  >
                    <p className="text-[#6b7494] font-mono text-sm leading-5">{headline}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ethics values */}
          {choice.ethicsValues.length > 0 && (
            <motion.div variants={prefersReducedMotion ? {} : ITEM}>
              <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-3">
                Ethics values reflected
              </p>
              <div className="flex flex-wrap gap-2">
                {choice.ethicsValues.map(v => (
                  <div key={v} className="relative group inline-flex">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full bg-[#1e2535] text-[#9da5b8] text-xs font-sans font-medium border border-[#2c3347] capitalize cursor-default"
                    >
                      {v}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20">
                      <div className="bg-[#0c0f1a] border border-[#2c3347] rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-[#9da5b8] text-xs leading-4 font-sans">{ETHICS_TOOLTIPS[v]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {choice.ethicsValues.length === 0 && (
            <motion.div variants={prefersReducedMotion ? {} : ITEM}>
              <div className="bg-[#1a0000] border border-red-900/40 rounded-xl px-5 py-4">
                <p className="text-red-400 font-sans text-sm leading-5">
                  This choice does not reflect a clear ethical framework. Decisions made without
                  an anchoring value tend to serve institutional self-preservation above all else.
                </p>
              </div>
            </motion.div>
          )}

          {/* Continue */}
          <motion.div variants={prefersReducedMotion ? {} : ITEM} className="pt-4">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-3 bg-[#1e40af] hover:bg-[#2563eb] text-white font-sans text-sm font-medium tracking-wide px-8 py-4 rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
            >
              {isLastStep ? 'View final results' : 'Continue to next decision'}
              <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Stakeholder panel */}
        <motion.div
          className="lg:w-72 xl:w-80 flex-shrink-0"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="lg:sticky lg:top-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-3">
              Updated stakeholder impact
            </p>
            <StakeholderPanel scores={scores} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
