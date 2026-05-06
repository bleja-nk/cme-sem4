'use client';

import { useReducer, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  SimulationState,
  SimulationPhase,
  Choice,
  MadeChoice,
  EthicsValue,
} from '@/lib/types';
import {
  MAIN_SCENARIO,
  INITIAL_STAKEHOLDER_SCORES,
} from '@/lib/scenario-data';
import {
  applyDeltas,
  computeEndingSummary,
} from '@/lib/consequence-engine';
import BriefingScreen from './BriefingScreen';
import DecisionInterface from './DecisionInterface';
import ConsequenceReveal from './ConsequenceReveal';
import ResultsSummary from '@/components/results/ResultsSummary';

// ─── State & Actions ─────────────────────────────────────────────────────────

type Action =
  | { type: 'BEGIN' }
  | { type: 'CHOOSE'; choice: Choice; stepIndex: number }
  | { type: 'NEXT_STEP' }
  | { type: 'RESTART' };

function buildInitialState(): SimulationState {
  return {
    phase: 'briefing',
    currentStepIndex: 0,
    madeChoices: [],
    stakeholderScores: { ...INITIAL_STAKEHOLDER_SCORES },
    livesTotal: 0,
    marginalizationTotal: 0,
    proceduralTotal: 0,
    ethicsValueCounts: {},
  };
}

function countValues(
  current: Partial<Record<EthicsValue, number>>,
  values: EthicsValue[]
): Partial<Record<EthicsValue, number>> {
  const next = { ...current };
  for (const v of values) {
    next[v] = (next[v] ?? 0) + 1;
  }
  return next;
}

function simulationReducer(state: SimulationState, action: Action): SimulationState {
  switch (action.type) {
    case 'BEGIN':
      return { ...state, phase: 'decision' };

    case 'CHOOSE': {
      const { choice, stepIndex } = action;
      const step = MAIN_SCENARIO.steps[stepIndex];
      const newScores = applyDeltas(state.stakeholderScores, choice.stakeholderDeltas);
      const madeChoice: MadeChoice = {
        stepId: step.id,
        stepNumber: step.stepNumber,
        stepTitle: step.title,
        choiceId: choice.id,
        choiceLabel: choice.label,
        ethicsValues: choice.ethicsValues,
        consequenceText: choice.consequenceText,
        consequenceHeadlines: choice.consequenceHeadlines,
        stakeholderDeltas: choice.stakeholderDeltas,
      };
      return {
        ...state,
        phase: 'consequence',
        madeChoices: [...state.madeChoices, madeChoice],
        stakeholderScores: newScores,
        livesTotal: state.livesTotal + choice.livesImpact,
        marginalizationTotal: state.marginalizationTotal + choice.marginalizationImpact,
        proceduralTotal: state.proceduralTotal + choice.proceduralScore,
        ethicsValueCounts: countValues(state.ethicsValueCounts, choice.ethicsValues),
      };
    }

    case 'NEXT_STEP': {
      const nextIndex = state.currentStepIndex + 1;
      const isLast = nextIndex >= MAIN_SCENARIO.steps.length;
      return {
        ...state,
        phase: isLast ? 'results' : 'decision',
        currentStepIndex: isLast ? state.currentStepIndex : nextIndex,
      };
    }

    case 'RESTART':
      return buildInitialState();

    default:
      return state;
  }
}

// ─── Page transition wrapper ─────────────────────────────────────────────────

function PageSlide({
  children,
  phaseKey,
}: {
  children: React.ReactNode;
  phaseKey: string;
}) {
  return (
    <motion.div
      key={phaseKey}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SimulatorEngine() {
  const [state, dispatch] = useReducer(simulationReducer, undefined, buildInitialState);

  const currentStep = MAIN_SCENARIO.steps[state.currentStepIndex];
  const latestChoice = state.madeChoices[state.madeChoices.length - 1];
  const isLastStep = state.currentStepIndex >= MAIN_SCENARIO.steps.length - 1;

  const handleBegin = useCallback(() => {
    dispatch({ type: 'BEGIN' });
  }, []);

  const handleChoose = useCallback(
    (choice: Choice) => {
      dispatch({ type: 'CHOOSE', choice, stepIndex: state.currentStepIndex });
    },
    [state.currentStepIndex]
  );

  const handleNextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const endingSummary =
    state.phase === 'results' ? computeEndingSummary(state) : null;

  // Build a unique key for AnimatePresence
  const phaseKey =
    state.phase === 'decision'
      ? `decision-${state.currentStepIndex}`
      : state.phase === 'consequence'
      ? `consequence-${state.currentStepIndex}`
      : state.phase;

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {state.phase === 'briefing' && (
          <PageSlide phaseKey="briefing">
            <BriefingScreen onBegin={handleBegin} />
          </PageSlide>
        )}

        {state.phase === 'decision' && currentStep && (
          <PageSlide phaseKey={`decision-${state.currentStepIndex}`}>
            <DecisionInterface
              step={currentStep}
              stepCount={MAIN_SCENARIO.steps.length}
              onChoose={handleChoose}
            />
          </PageSlide>
        )}

        {state.phase === 'consequence' && latestChoice && (
          <PageSlide phaseKey={`consequence-${state.currentStepIndex}`}>
            <ConsequenceReveal
              choice={latestChoice}
              stepTitle={latestChoice.stepTitle}
              isLastStep={isLastStep}
              scores={state.stakeholderScores}
              onContinue={handleNextStep}
            />
          </PageSlide>
        )}

        {state.phase === 'results' && endingSummary && (
          <PageSlide phaseKey="results">
            <ResultsSummary summary={endingSummary} onRestart={handleRestart} />
          </PageSlide>
        )}
      </AnimatePresence>
    </div>
  );
}
