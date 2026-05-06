'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import Link from 'next/link';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function fadeUp(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: EASE },
    },
  };
}

function fadeIn(delay: number): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.9, delay, ease: 'easeOut' as const },
    },
  };
}

export default function LandingHero() {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion ? false : 'hidden';
  const animate = 'visible';

  return (
    <main className="relative min-h-screen flex flex-col bg-[#0c0f1a] overflow-hidden">
      {/* Atmospheric grid */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="rgba(255,255,255,0.032)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(30,64,175,0.12) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      )}

      {/* Header bar */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16"
        variants={fadeIn(0)}
        initial={initial}
        animate={animate}
      >
        <span className="text-xs tracking-[0.2em] uppercase text-[#6b7494] font-sans">
          Ethics Decision Simulator
        </span>
        <span className="text-xs tracking-[0.15em] uppercase text-[#6b7494] font-sans">
          Public Health · AI Governance
        </span>
      </motion.header>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 py-20 text-center">
        {/* Eyebrow */}
        <motion.p
          className="text-xs tracking-[0.25em] uppercase text-[#4a5270] font-sans mb-8"
          variants={fadeIn(0.2)}
          initial={initial}
          animate={animate}
        >
          A scenario in six decisions
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#e8eaf0] leading-[0.95] tracking-tight max-w-4xl"
          variants={fadeUp(0.35)}
          initial={initial}
          animate={animate}
        >
          First,
          <br />
          <span className="italic text-[#c8cdd9]">do no harm.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-[#9da5b8] max-w-xl leading-relaxed font-sans"
          variants={fadeUp(0.55)}
          initial={initial}
          animate={animate}
        >
          But what if you don&apos;t know who you&apos;re harming?
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-12 w-px h-12 bg-gradient-to-b from-[#2c3347] to-transparent mx-auto"
          variants={fadeIn(0.7)}
          initial={initial}
          animate={animate}
          aria-hidden="true"
        />

        {/* Premise */}
        <motion.div
          className="mt-12 max-w-lg text-left space-y-4"
          variants={fadeUp(0.8)}
          initial={initial}
          animate={animate}
        >
          <p className="text-[#9da5b8] text-base leading-7 font-sans">
            A new AI diagnostic tool is ready to deploy. It saves lives — on average. But it
            systematically underperforms for Black, Hispanic, and Native American patients,
            without their knowledge or consent.
          </p>
          <p className="text-[#6b7494] text-base leading-7 font-sans">
            You are the hospital administrator. You have six decisions to make. There is no right answer, it is your job to select the choice you believe to be the best option.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row gap-4 items-center"
          variants={fadeUp(1.0)}
          initial={initial}
          animate={animate}
        >
          <Link
            href="/simulator"
            className="group relative inline-flex items-center gap-3 bg-[#1e40af] hover:bg-[#2563eb] text-white font-sans text-sm font-medium tracking-wide px-8 py-4 rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
            aria-label="Begin the ethics decision simulation"
          >
            Begin simulation
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-xs text-[#4a5270] font-sans">
            ~10 minutes &nbsp;·&nbsp; No account required
          </p>
        </motion.div>

        {/* Context note */}
        <motion.p
          className="mt-16 text-xs text-[#2c3347] font-sans max-w-sm leading-5"
          variants={fadeIn(1.2)}
          initial={initial}
          animate={animate}
        >
          This simulator is designed for public education on AI ethics in healthcare. It explores
          pragmatist ethics and procedural ethics through lived institutional decision-making.
          No personally identifiable information is collected.
        </motion.p>
      </div>

      {/* Bottom attribution */}
      <motion.footer
        className="relative z-10 px-8 py-6 md:px-16 flex items-center justify-between border-t border-[#141824]"
        variants={fadeIn(1.3)}
        initial={initial}
        animate={animate}
      >
        <p className="text-xs text-[#2c3347] font-sans">
          Ethics · Healthcare · AI Governance
        </p>
        <p className="text-xs text-[#2c3347] font-sans">
          Fictional scenario. Based on real patterns.
        </p>
      </motion.footer>
    </main>
  );
}
