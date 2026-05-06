'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { EndingSummary, EthicsValue, StakeholderKey } from '@/lib/types';
import { STAKEHOLDERS } from '@/lib/scenario-data';
import { ETHICS_VALUE_LABELS, ETHICS_VALUE_DESCRIPTIONS } from '@/lib/consequence-engine';
import Link from 'next/link';

const FURTHER_READING = [
  {
    authors: 'Seyyed-Kalantari, L. et al.',
    year: '2021',
    title: 'Underdiagnosis bias of artificial intelligence algorithms applied to chest radiographs in under-served patient populations',
    journal: 'Nature Medicine, 27, 2176–2182',
    url: 'https://www.nature.com/articles/s41591-021-01595-0',
    annotation: 'Demonstrates how AI diagnostic tools systematically underdiagnose patients from marginalised groups, directly evidencing the bias shown in this simulation.',
  },
  {
    authors: 'Char, D.S., Shah, N.H. & Magnus, D.',
    year: '2018',
    title: 'Implementing machine learning in health care — addressing ethical challenges',
    journal: 'New England Journal of Medicine, 378, 981–983',
    url: 'https://www.nejm.org/doi/10.1056/NEJMp1714229',
    annotation: 'Outlines the core ethical tensions in deploying ML tools in clinical settings, including accountability gaps and informed consent failures.',
  },
  {
    authors: 'Ghassemi, M. et al.',
    year: '2024',
    title: 'Study reveals why AI models that analyze medical images can be biased',
    journal: 'MIT News',
    url: 'https://news.mit.edu/2024/study-reveals-why-ai-analyzed-medical-images-can-be-biased-0628',
    annotation: 'Explains the technical mechanisms behind racial bias in medical imaging AI, grounding the simulation\'s scenario in real research.',
  },
  {
    authors: 'Rose, S.L. et al.',
    year: '2024',
    title: 'An ethically supported framework for determining patient notification and informed consent practices when using AI in health care',
    journal: 'CHEST, 166(3), 572–578',
    url: 'https://journal.chestnet.org/article/S0012-3692(24)00024-0/fulltext',
    annotation: 'Directly addresses the consent gap at the centre of this simulation, proposing frameworks for when and how patients should be informed of AI involvement in their care.',
  },
  {
    authors: 'Mennella, C. et al.',
    year: '2024',
    title: 'Ethical and regulatory challenges of AI technologies in healthcare: a narrative review',
    journal: 'Heliyon, 10(4), e26297',
    url: 'https://www.cell.com/heliyon/fulltext/S2405-8440(24)02793-3',
    annotation: 'Provides a broad overview of the regulatory and ethical landscape for AI in healthcare, useful context for the policy decisions in steps 4–6.',
  },
];

interface ResultsSummaryProps {
  summary: EndingSummary;
  onRestart: () => void;
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

function SentimentDot({ sentiment }: { sentiment: 'positive' | 'neutral' | 'negative' }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
        sentiment === 'positive' ? 'bg-green-500' :
        sentiment === 'neutral' ? 'bg-gray-400' :
        'bg-red-500'
      }`}
      aria-hidden="true"
    />
  );
}

function ScoreMeter({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round(((value - (-max)) / (max - (-max))) * 100);
  const clampedPct = Math.max(0, Math.min(100, pct));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#6b7494] font-sans">{label}</span>
        <span className="text-xs font-mono text-[#9da5b8]">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <div className="h-1.5 bg-[#1e2535] rounded-full overflow-hidden" aria-hidden="true">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export default function ResultsSummary({ summary, onRestart }: ResultsSummaryProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#080b12] text-[#e8eaf0]">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-5 md:px-12 flex items-center justify-between">
        <span className="text-xs tracking-[0.2em] uppercase text-[#4a5270] font-sans">
          Simulation complete
        </span>
        <Link
          href="/"
          className="text-xs text-[#4a5270] hover:text-[#9da5b8] font-sans transition-colors"
        >
          ← Return to start
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:px-12">
        <motion.div
          variants={prefersReducedMotion ? {} : STAGGER}
          initial={prefersReducedMotion ? {} : 'hidden'}
          animate="visible"
          className="space-y-16"
        >
          {/* Outcome title */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.2em] uppercase text-[#4a5270] font-sans mb-6">
              Your outcome
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-[#e8eaf0] leading-tight mb-3">
              {summary.outcomeTitle}
            </h1>
            <p className="text-[#6b7494] font-sans text-lg leading-7 italic">
              {summary.outcomeSubtitle}
            </p>
          </motion.section>

          {/* Narrative */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <div className="border-l-2 border-[#1e40af] pl-6 space-y-4">
              {summary.narrativeSummary.split('\n\n').map((para, i) => (
                <p key={i} className="text-[#9da5b8] font-sans text-sm md:text-base leading-7">
                  {para}
                </p>
              ))}
            </div>
          </motion.section>

          {/* Aggregate metrics */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-6">
              Cumulative impact
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-5">
                <p className="text-xs text-[#4a5270] font-sans mb-1">Lives impacted</p>
                <p
                  className={`text-3xl font-display ${
                    summary.livesTotal >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {summary.livesTotal > 0 ? `+${summary.livesTotal}` : summary.livesTotal}
                </p>
                <p className="text-xs text-[#4a5270] font-sans mt-1">net detection improvement</p>
              </div>
              <div className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-5">
                <p className="text-xs text-[#4a5270] font-sans mb-1">Marginalization impact</p>
                <p
                  className={`text-3xl font-display ${
                    summary.marginalizationScore >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {summary.marginalizationScore > 0
                    ? `+${summary.marginalizationScore}`
                    : summary.marginalizationScore}
                </p>
                <p className="text-xs text-[#4a5270] font-sans mt-1">
                  cumulative equity score (pos = protected)
                </p>
              </div>
              <div className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-5">
                <p className="text-xs text-[#4a5270] font-sans mb-1">Procedural integrity</p>
                <p
                  className={`text-3xl font-display ${
                    summary.proceduralScore >= 10 ? 'text-green-400' :
                    summary.proceduralScore >= 0 ? 'text-amber-400' :
                    'text-red-400'
                  }`}
                >
                  {summary.proceduralScore > 0
                    ? `+${summary.proceduralScore}`
                    : summary.proceduralScore}
                </p>
                <p className="text-xs text-[#4a5270] font-sans mt-1">
                  process adherence score
                </p>
              </div>
            </div>
          </motion.section>

          {/* Ethics lens */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-6">
              Ethics lens — what values drove your choices
            </p>

            {/* Dominant values */}
            {summary.ethicsLens.dominantValues.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-[#4a5270] font-sans mb-3">Most frequent</p>
                <div className="flex flex-wrap gap-2">
                  {summary.ethicsLens.dominantValues.map(v => (
                    <span
                      key={v}
                      className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1e40af]/20 text-[#93c5fd] text-sm font-sans font-medium border border-[#1e40af]/30 capitalize"
                    >
                      {ETHICS_VALUE_LABELS[v]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All values breakdown */}
            <div className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-5 mb-6">
              <p className="text-xs text-[#4a5270] font-sans mb-4">Value frequency</p>
              <div className="space-y-2">
                {(Object.entries(summary.ethicsLens.ethicsValueBreakdown) as [EthicsValue, number][])
                  .sort(([, a], [, b]) => b - a)
                  .map(([v, count]) => (
                    <div key={v} className="flex items-center gap-3">
                      <span className="text-xs text-[#9da5b8] font-sans w-28 capitalize">
                        {ETHICS_VALUE_LABELS[v]}
                      </span>
                      <div className="flex-1 h-1 bg-[#1e2535] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#1e40af] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / 6) * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#4a5270] w-4">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pragmatist analysis */}
            <div className="space-y-5">
              <div>
                <p className="text-xs tracking-[0.12em] uppercase text-[#4a5270] font-sans mb-2">
                  Pragmatist ethics analysis
                </p>
                <p className="text-[#9da5b8] font-sans text-sm leading-7">
                  {summary.ethicsLens.pragmatistAnalysis}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.12em] uppercase text-[#4a5270] font-sans mb-2">
                  Procedural ethics analysis
                </p>
                <p className="text-[#9da5b8] font-sans text-sm leading-7">
                  {summary.ethicsLens.proceduralAnalysis}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Procedural safeguards */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-6">
              Procedural safeguards
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary.ethicsLens.proceduralSafeguardsRespected.length > 0 && (
                <div className="bg-green-950/30 border border-green-900/40 rounded-xl p-5">
                  <p className="text-xs text-green-400 font-sans font-medium mb-3">Honored</p>
                  <ul className="space-y-2">
                    {summary.ethicsLens.proceduralSafeguardsRespected.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500 text-xs mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                        <span className="text-green-200 font-sans text-xs leading-5">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.ethicsLens.proceduralSafeguardsIgnored.length > 0 && (
                <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-5">
                  <p className="text-xs text-red-400 font-sans font-medium mb-3">Bypassed or ignored</p>
                  <ul className="space-y-2">
                    {summary.ethicsLens.proceduralSafeguardsIgnored.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-500 text-xs mt-0.5 flex-shrink-0" aria-hidden="true">✗</span>
                        <span className="text-red-200 font-sans text-xs leading-5">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.section>

          {/* Stakeholder outcomes */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-6">
              Where each group ended up
            </p>
            <div className="space-y-4">
              {summary.stakeholderFinalStates.map(state => {
                const stakeholder = STAKEHOLDERS.find(s => s.key === state.key)!;
                return (
                  <div
                    key={state.key}
                    className="bg-[#0f1219] border border-[#1e2535] rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-base" aria-hidden="true">{stakeholder.icon}</span>
                      <span className="text-[#c8cdd9] font-sans font-medium text-sm">
                        {stakeholder.name}
                      </span>
                      <SentimentDot sentiment={state.sentiment} />
                      <span
                        className={`ml-auto text-lg font-display font-semibold ${
                          state.score >= 62 ? 'text-green-400' :
                          state.score >= 40 ? 'text-[#9da5b8]' :
                          'text-red-400'
                        }`}
                        aria-label={`Final score: ${state.score}`}
                      >
                        {state.score}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div className="h-1 bg-[#1e2535] rounded-full overflow-hidden mb-3" aria-hidden="true">
                      <motion.div
                        className={`h-full rounded-full ${
                          state.score >= 62 ? 'bg-green-500' :
                          state.score >= 40 ? 'bg-gray-500' :
                          'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${state.score}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[#6b7494] font-sans text-xs leading-5">{state.narrative}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Path review */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-6">
              Your path — decision by decision
            </p>
            <div className="space-y-3">
              {summary.pathChoices.map((choice, i) => (
                <div
                  key={choice.stepId}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e2535] flex items-center justify-center text-xs text-[#6b7494] font-mono mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs text-[#4a5270] font-sans mb-0.5">{choice.stepTitle}</p>
                    <p className="text-[#9da5b8] font-sans text-sm">{choice.choiceLabel}</p>
                    {choice.ethicsValues.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {choice.ethicsValues.map(v => (
                          <span
                            key={v}
                            className="text-xs text-[#4a5270] font-sans border border-[#1e2535] px-2 py-0.5 rounded capitalize"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Overall reflection */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <div className="bg-[#0c0f1a] border border-[#1e2535] rounded-xl p-8 text-center">
              <p className="text-[#6b7494] font-display text-lg italic leading-7 max-w-lg mx-auto">
                &ldquo;{summary.ethicsLens.overallReflection}&rdquo;
              </p>
            </div>
          </motion.section>

          {/* Further Reading */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs tracking-[0.15em] uppercase text-[#4a5270] font-sans mb-3">
              Further Reading
            </p>
            <p className="text-[#4a5270] font-sans text-xs leading-5 mb-6">
              The scenario in this simulation is fictional, but the patterns it reflects are real. These sources are a starting point for further exploration.
            </p>
            <div className="divide-y divide-[#1e2535]">
              {FURTHER_READING.map((source, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  <p className="text-[#4a5270] font-sans text-xs mb-1">
                    {source.authors} ({source.year}) — <span className="text-[#2c3347]">{source.journal}</span>
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7ba8cc] hover:text-[#93c5fd] font-sans text-sm leading-5 transition-colors duration-150 underline underline-offset-2 decoration-[#2c3347] hover:decoration-[#93c5fd]/40"
                  >
                    {source.title}
                  </a>
                  <p className="text-[#4a5270] font-sans text-xs leading-5 mt-1.5 italic">
                    {source.annotation}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            variants={prefersReducedMotion ? {} : ITEM}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-3 bg-[#1e40af] hover:bg-[#2563eb] text-white font-sans text-sm font-medium tracking-wide px-8 py-4 rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
            >
              Try another path
              <span aria-hidden="true">↩</span>
            </button>
            <Link
              href="/"
              className="text-sm text-[#4a5270] hover:text-[#9da5b8] font-sans transition-colors"
            >
              Return to home
            </Link>
          </motion.section>

          {/* Footer note */}
          <motion.section variants={prefersReducedMotion ? {} : ITEM}>
            <p className="text-xs text-[#2c3347] font-sans text-center leading-5">
              This is a fictional scenario designed for public education on AI ethics in healthcare.
              It reflects real patterns documented in healthcare AI research. No personal data is
              collected or stored.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
