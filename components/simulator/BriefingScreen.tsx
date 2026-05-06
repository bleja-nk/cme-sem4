'use client';

import { motion, useReducedMotion } from 'motion/react';

interface BriefingScreenProps {
  onBegin: () => void;
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function BriefingScreen({ onBegin }: BriefingScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center px-6 py-20">
      <motion.div
        className="max-w-xl w-full"
        variants={prefersReducedMotion ? {} : STAGGER}
        initial={prefersReducedMotion ? {} : 'hidden'}
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={prefersReducedMotion ? {} : ITEM}
          className="text-xs tracking-[0.2em] uppercase text-[#4a5270] font-sans mb-8"
        >
          Pre-simulation briefing
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={prefersReducedMotion ? {} : ITEM}
          className="font-display text-4xl md:text-5xl text-[#e8eaf0] leading-tight mb-6"
        >
          You are the hospital administrator.
        </motion.h1>

        {/* Briefing content */}
        <motion.div
          variants={prefersReducedMotion ? {} : ITEM}
          className="space-y-4 text-[#9da5b8] font-sans text-sm leading-7 mb-10"
        >
          <p>
            You will face <strong className="text-[#c8cdd9] font-medium">six decisions</strong>{' '}
            about the deployment of an AI diagnostic tool — MedVision — at Riverside General
            Hospital. The tool improves patient outcomes on average, but performs worse for
            marginalized communities.
          </p>
          <p>
            Each decision involves incomplete information, competing institutional pressures, and
            real consequences for real people. You will see how your choices affect different
            stakeholders in real time.
          </p>
          <p>
            There is no correct answer. The simulation is designed to help you feel the weight of
            these tradeoffs — not to judge which choice you make.
          </p>
        </motion.div>

        {/* What to expect */}
        <motion.div
          variants={prefersReducedMotion ? {} : ITEM}
          className="border border-[#1e2535] rounded-xl p-5 mb-10 space-y-3"
        >
          <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans font-medium">
            What to expect
          </p>
          {[
            { icon: '⏱', label: "Each decision has a timer — it won't force you to act, but it sets the pace." },
            { icon: '📊', label: 'Stakeholder impact meters that show how your choices affect different groups' },
            { icon: '📰', label: 'Consequences after each decision — memos, headlines, reactions' },
            { icon: '🔍', label: 'A full ethics debrief at the end — no score, just reflection' },
          ].map(({ icon, label }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-sm flex-shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
              <p className="text-[#6b7494] text-xs leading-5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Ethics lenses */}
        <motion.div
          variants={prefersReducedMotion ? {} : ITEM}
          className="mb-10 space-y-3"
        >
          <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans font-medium">
            Two ethical lenses at work
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-4">
              <p className="text-[#c8cdd9] font-sans text-xs font-semibold mb-1">Pragmatist Ethics</p>
              <p className="text-[#6b7494] font-sans text-xs leading-5">
                Moral knowledge emerges from consequences for real people — not abstract principles.
                What actually happens to actual humans?
              </p>
            </div>
            <div className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-4">
              <p className="text-[#c8cdd9] font-sans text-xs font-semibold mb-1">Procedural Ethics</p>
              <p className="text-[#6b7494] font-sans text-xs leading-5">
                Were the right processes followed? Were affected communities included? Did safeguards
                hold — or bend to institutional pressure?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Begin CTA */}
        <motion.div variants={prefersReducedMotion ? {} : ITEM}>
          <button
            onClick={onBegin}
            className="inline-flex items-center gap-3 bg-[#1e40af] hover:bg-[#2563eb] text-white font-sans text-sm font-medium tracking-wide px-8 py-4 rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
            autoFocus
          >
            Begin — Decision 1
            <span aria-hidden="true">→</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
