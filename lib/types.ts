// ─── Core domain types for the Ethics Decision Simulator ───────────────────

export type StakeholderKey =
  | 'patients'
  | 'marginalized'
  | 'clinicians'
  | 'board'
  | 'regulators'
  | 'media';

export type EthicsValue =
  | 'utilitarian'    // maximize aggregate outcomes
  | 'procedural'     // follow due process and established rules
  | 'autonomy'       // respect individual rights and informed consent
  | 'equity'         // protect and prioritize marginalized groups
  | 'transparency'   // openness with stakeholders and the public
  | 'precautionary'; // when uncertain, err toward minimizing harm

export interface Stakeholder {
  key: StakeholderKey;
  name: string;
  shortName: string;
  description: string;
  icon: string;
}

export type StakeholderDeltas = Partial<Record<StakeholderKey, number>>;
export type StakeholderScores = Record<StakeholderKey, number>;

export interface Choice {
  id: string;
  label: string;           // short action label shown in card header
  text: string;            // full description of the action
  tradeoffNote: string;    // visible cost/tension shown to user
  ethicsValues: EthicsValue[];
  stakeholderDeltas: StakeholderDeltas;
  livesImpact: number;              // net lives affected (positive = more saved)
  marginalizationImpact: number;    // -10 to +10 (negative = more harm to marginalized)
  proceduralScore: number;          // -10 to +10 (positive = procedurally sound)
  consequenceText: string;          // narrative of what unfolds
  consequenceHeadlines: string[];   // internal memos / news fragments
}

export interface DecisionStep {
  id: string;
  stepNumber: number;
  title: string;
  urgencyLabel: string;    // e.g. "Board meeting in 48 hours"
  context: string;         // the situation briefing (2–3 paragraphs)
  urgencyNote: string;     // why there's time pressure
  evidenceGaps: string[];  // what information is missing or contested
  timerSeconds: number;    // atmospheric countdown
  stakeholderPressures: Partial<Record<StakeholderKey, string>>;
  choices: Choice[];
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  steps: DecisionStep[];
}

// ─── Simulation state ───────────────────────────────────────────────────────

export type SimulationPhase =
  | 'landing'
  | 'briefing'
  | 'decision'
  | 'consequence'
  | 'results';

export interface MadeChoice {
  stepId: string;
  stepNumber: number;
  stepTitle: string;
  choiceId: string;
  choiceLabel: string;
  ethicsValues: EthicsValue[];
  consequenceText: string;
  consequenceHeadlines: string[];
  stakeholderDeltas: StakeholderDeltas;
}

export interface SimulationState {
  phase: SimulationPhase;
  currentStepIndex: number;
  madeChoices: MadeChoice[];
  stakeholderScores: StakeholderScores;
  livesTotal: number;
  marginalizationTotal: number;
  proceduralTotal: number;
  ethicsValueCounts: Partial<Record<EthicsValue, number>>;
}

// ─── Results & Analysis ─────────────────────────────────────────────────────

export type StakeholderSentiment = 'positive' | 'neutral' | 'negative';

export interface StakeholderFinalState {
  key: StakeholderKey;
  score: number;
  sentiment: StakeholderSentiment;
  narrative: string;
}

export interface EthicsLensSummary {
  dominantValues: EthicsValue[];
  ethicsValueBreakdown: Partial<Record<EthicsValue, number>>;
  pragmatistAnalysis: string;
  proceduralAnalysis: string;
  beneficiaries: StakeholderKey[];
  harmed: StakeholderKey[];
  proceduralSafeguardsRespected: string[];
  proceduralSafeguardsIgnored: string[];
  overallReflection: string;
}

export interface EndingSummary {
  outcomeTitle: string;
  outcomeSubtitle: string;
  narrativeSummary: string;
  ethicsLens: EthicsLensSummary;
  stakeholderFinalStates: StakeholderFinalState[];
  livesTotal: number;
  marginalizationScore: number;
  proceduralScore: number;
  pathChoices: MadeChoice[];
}
