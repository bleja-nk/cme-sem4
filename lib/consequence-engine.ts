import type {
  EthicsValue,
  EthicsLensSummary,
  EndingSummary,
  SimulationState,
  StakeholderFinalState,
  StakeholderKey,
} from './types';
import { STAKEHOLDERS } from './scenario-data';

// ─── Ethics Value Labels ────────────────────────────────────────────────────

export const ETHICS_VALUE_LABELS: Record<EthicsValue, string> = {
  utilitarian: 'Utilitarian',
  procedural: 'Procedural',
  autonomy: 'Autonomy',
  equity: 'Equity',
  transparency: 'Transparency',
  precautionary: 'Precautionary',
};

export const ETHICS_VALUE_DESCRIPTIONS: Record<EthicsValue, string> = {
  utilitarian:
    'Decisions were weighted toward maximizing aggregate outcomes — the most lives saved overall, even if some groups bore disproportionate risk.',
  procedural:
    'Decisions followed established institutional processes, consent frameworks, and regulatory expectations, even when slower.',
  autonomy:
    'Decisions respected individuals\' right to know and choose — informed consent was treated as non-negotiable.',
  equity:
    'Decisions centered the most vulnerable — marginalized communities were weighted as a primary, not secondary, concern.',
  transparency:
    'Decisions prioritized honesty with stakeholders, even when disclosure was painful for the institution.',
  precautionary:
    'Decisions erred toward caution when evidence was incomplete, accepting slower progress to reduce the risk of irreversible harm.',
};

// ─── Stakeholder Narrative Generator ────────────────────────────────────────

function getStakeholderNarrative(key: StakeholderKey, score: number): string {
  if (key === 'patients') {
    if (score >= 65) return 'The general patient population experienced meaningful improvements in care quality and, gradually, a sense that the institution was being honest with them.';
    if (score >= 45) return 'Patients had a mixed experience. Detection improved, but uncertainty about consent and process left many questioning what they hadn\'t been told.';
    return 'Trust in the institution among the general patient population eroded significantly. Many patients felt that institutional interests were prioritized over their care.';
  }
  if (key === 'marginalized') {
    if (score >= 65) return 'Marginalized communities — whose health outcomes were most at risk — experienced genuine engagement from the institution. The process was imperfect, but they were included in decisions that affected them.';
    if (score >= 40) return 'Marginalized communities experienced partial acknowledgment. Some harm was mitigated. The gap between what was promised and what changed remained visible.';
    return 'For marginalized communities, this episode became another data point in a long history of medical institutions treating their lives as acceptable collateral in pursuit of aggregate benefit. Trust was severely damaged.';
  }
  if (key === 'clinicians') {
    if (score >= 65) return 'Clinical staff largely trusted the institution\'s process. Their concerns were heard, their expertise integrated. The workforce emerged with clarity on the hospital\'s values.';
    if (score >= 45) return 'Clinicians were divided throughout. Some trusted the process; others felt sidelined. The institution navigated this without formal rupture but without full resolution.';
    return 'Clinical trust in leadership was damaged. Several clinicians spoke publicly. The workforce absorbed the episode as evidence that patient advocacy and institutional convenience were not always aligned.';
  }
  if (key === 'board') {
    if (score >= 65) return 'The board maintained confidence in administrative leadership and considered the episode a managed challenge — costly but controlled.';
    if (score >= 40) return 'Board confidence in leadership was strained. The episode required more transparency and community engagement than the board was comfortable with.';
    return 'The board experienced significant friction with administrative decisions. Several members formally objected to actions taken without full consultation. Institutional governance will require review.';
  }
  if (key === 'regulators') {
    if (score >= 65) return 'Regulators viewed the hospital\'s response as a positive model. Proactive disclosure, structured remediation, and community engagement positioned the institution as a good-faith actor.';
    if (score >= 40) return 'Regulators monitored the situation with concern but did not escalate to formal enforcement. The hospital\'s response was adequate, if imperfect.';
    return 'The state health department opened a formal investigation. The hospital\'s response was characterized by regulators as slow, defensive, and insufficiently protective of affected communities.';
  }
  // media
  if (score >= 65) return 'Press and public coverage was largely fair and, in some cases, acknowledged the hospital\'s transparency as unusual and commendable in its field.';
  if (score >= 40) return 'Coverage was critical but mixed. The hospital was scrutinized, but some reporting acknowledged the complexity of the decisions made.';
  return 'The public narrative around the hospital was significantly damaged. The episode became a national reference point for institutional failures in healthcare AI governance.';
}

// ─── Outcome Title Generator ─────────────────────────────────────────────────

function computeOutcome(
  dominantValues: EthicsValue[],
  marginalizationTotal: number,
  proceduralTotal: number,
  finalScores: Record<StakeholderKey, number>
): { title: string; subtitle: string; narrative: string } {
  const margScore = finalScores.marginalized;
  const regulatorScore = finalScores.regulators;
  const hasEquity = dominantValues.includes('equity');
  const hasProcedural = dominantValues.includes('procedural');
  const hasUtilitarian = dominantValues.includes('utilitarian');
  const hasTransparency = dominantValues.includes('transparency');

  // Strong equity + procedural
  if (margScore >= 65 && proceduralTotal >= 15 && (hasEquity || hasProcedural)) {
    return {
      title: 'Systemic Reform',
      subtitle: 'You centered the most vulnerable and followed due process.',
      narrative:
        'Your decisions consistently prioritized those most at risk and honored institutional accountability. This path was slower, more painful for your institution, and came with real political costs. But it produced structural change — and it told the people most affected by this technology that their lives were not acceptable margins.\n\nThe work is not finished. No single institution completes it. But the choices made here will shape how others after you approach the same question: who bears the cost of innovation, and who gets to decide.',
    };
  }

  // Strong transparency
  if (hasTransparency && regulatorScore >= 60 && margScore >= 50) {
    return {
      title: 'Radical Accountability',
      subtitle: 'You chose openness even when it cost the institution.',
      narrative:
        'You told the truth when institutions usually don\'t. The press conference you didn\'t have to hold, the audit you published, the town hall where you answered the direct question — these were not required. They were chosen.\n\nAccountability of this kind is rare in healthcare settings. It doesn\'t fix what happened. But it changes what can be built on the other side of it. The people who were harmed deserve to know that someone decided their knowledge mattered more than the institution\'s comfort.',
    };
  }

  // Utilitarian dominant, low marginalization score
  if (hasUtilitarian && margScore < 40) {
    return {
      title: 'Calculated Efficiency',
      subtitle: 'The aggregate numbers drove your choices. Someone paid for that.',
      narrative:
        'The utilitarian logic you applied is not wrong on its own terms. More lives were saved overall. Statistical analysis supports that conclusion.\n\nBut the population-level average conceals what happened to specific people — people who came to a hospital for care and received less of it, without their knowledge, because of who they are. Pragmatist ethics asks not just "what produced the best outcome?" but "whose outcomes count in that calculation, and were they included in making it?"\n\nThe question left behind is not the one about the algorithm. It is about who gets to decide what "acceptable" means.',
    };
  }

  // Procedural dominant but low community trust
  if (hasProcedural && margScore < 50 && proceduralTotal >= 10) {
    return {
      title: 'Process Without Justice',
      subtitle: 'The protocols were followed. The harm still happened.',
      narrative:
        'Your decisions followed process: ethics reviews, legal analysis, structured timelines. These are not nothing. Procedural rigor matters. It creates defensibility, documentation, and the possibility of learning.\n\nBut procedural ethics requires that the processes themselves serve justice — not just institutional continuity. When the communities most affected are not in the room, the most careful process can still produce an unjust outcome. Form was honored. Substance remains contested.',
    };
  }

  // Mixed / middle path
  if (margScore >= 45 && margScore < 65) {
    return {
      title: 'Imperfect Navigation',
      subtitle: 'You tried to balance competing goods. Every choice left something behind.',
      narrative:
        'No path through this dilemma was clean. You made choices under incomplete information, institutional pressure, and real uncertainty about consequences. Some of those choices protected people who might otherwise have been harmed. Others didn\'t go as far as they could have.\n\nPragmatist ethics does not demand perfection. It asks whether you took the available evidence seriously, engaged affected communities honestly, and remained willing to change course when what you learned demanded it. Whether you did that — that judgment belongs to the people who lived with the outcomes, not to you.',
    };
  }

  // Low scores across the board
  return {
    title: 'Institutional Failure',
    subtitle: 'Institutional convenience prevailed over patient welfare.',
    narrative:
      'The decisions made here prioritized speed, institutional reputation, and aggregate metrics over the rights and safety of the people most vulnerable to algorithmic harm. This is not an unusual outcome. It is, in fact, the default — which is why it is so important to name it clearly.\n\nThe woman in the third row at the town hall asked a direct question. In this version of events, she didn\'t get a direct answer. That gap — between what institutions know and what they disclose, between aggregate benefit and individual harm — is where trust goes to die, and where the hardest work of healthcare equity remains undone.',
  };
}

// ─── Pragmatist Analysis ────────────────────────────────────────────────────

function getPragmatistAnalysis(
  dominantValues: EthicsValue[],
  livesTotal: number,
  marginalizationTotal: number
): string {
  const hasEquity = dominantValues.includes('equity');
  const hasUtilitarian = dominantValues.includes('utilitarian');

  if (hasEquity && marginalizationTotal >= 20) {
    return 'Pragmatist ethics holds that moral knowledge is not fixed in advance but emerges through consequences for real people. Your choices treated the observed harm to marginalized communities as morally significant information — not just data to be weighed against aggregate outcomes. You updated your approach based on what the evidence revealed about who was being hurt.';
  }
  if (hasUtilitarian && livesTotal >= 15 && marginalizationTotal < 0) {
    return 'Pragmatist ethics cautions against abstract utilitarian calculus that loses sight of specific, identifiable people. Your choices maximized aggregate outcomes — a defensible goal — but in doing so, treated the disproportionate harm to certain communities as an acceptable trade-off. Pragmatism asks whether those harmed were included in the deliberative process that produced that trade-off. The evidence suggests they were not.';
  }
  if (dominantValues.includes('precautionary')) {
    return 'Pragmatist ethics supports caution when evidence is incomplete and harm is possible. Your choices reflected a willingness to accept the cost of slowing down in order to reduce the risk of irreversible harm. This approach treats uncertainty itself as morally relevant information.';
  }
  return 'Pragmatist ethics evaluates moral decisions by their consequences for actual people, not by adherence to abstract principles. Your path produced a mixed record: some consequences were better than they might have been, others fell short of what the affected communities needed. The test of any institutional response is not what it intended but what it produced.';
}

// ─── Procedural Analysis ────────────────────────────────────────────────────

function getProceduralAnalysis(
  proceduralTotal: number,
  madeChoices: SimulationState['madeChoices']
): string {
  const consentStep = madeChoices.find(c => c.stepId === 'step-2-consent');
  const auditStep = madeChoices.find(c => c.stepId === 'step-3-audit');
  const policyStep = madeChoices.find(c => c.stepId === 'step-6-policy');

  const chosenProperConsent = consentStep?.choiceId === 'pause-reissue-consent' || consentStep?.choiceId === 'opt-out-notice';
  const suspendedOnAudit = auditStep?.choiceId === 'suspend-immediately' || auditStep?.choiceId === 'public-disclosure-advisory';
  const strongPolicy = policyStep?.choiceId === 'algorithmic-equity-standards' || policyStep?.choiceId === 'community-governance-council';

  if (proceduralTotal >= 20 && chosenProperConsent && suspendedOnAudit) {
    return 'Procedural ethics asks whether the right processes were followed, not just whether outcomes were acceptable. Your path honored key procedural safeguards: informed consent was treated as non-negotiable, the audit results were acted upon rather than disputed, and accountability processes were implemented rather than circumvented. These choices were costly. That is usually how you know they were real.';
  }
  if (proceduralTotal < 0) {
    return 'Procedural ethics identifies several failures in this path: consent requirements were not met, audit evidence was challenged rather than acted upon, and affected communities were kept outside the decision process. These are not incidental failures — they are the mechanisms through which harm becomes systemic. When procedures designed to protect the most vulnerable are bypassed in the name of speed or institutional convenience, the harm they were meant to prevent is not just tolerated; it is institutionalized.';
  }
  if (strongPolicy) {
    return 'Procedural ethics evaluates not just what happened but what structures were put in place for what comes next. Your policy choices created mechanisms — equity standards, consent frameworks, or governance structures — that make it harder for future administrators to repeat these failures silently. That is meaningful, even against an imperfect record in earlier decisions.';
  }
  return 'Procedural ethics demands that affected communities have real voice in decisions that affect them — not just notification after the fact. Your path created some procedural mechanisms but left others incomplete. The question procedural ethics always returns to is: who was in the room when the decision was made?';
}

// ─── Safeguards Tracker ──────────────────────────────────────────────────────

function identifySafeguards(madeChoices: SimulationState['madeChoices']): {
  respected: string[];
  ignored: string[];
} {
  const choiceIds = new Set(madeChoices.map(c => c.choiceId));
  const respected: string[] = [];
  const ignored: string[] = [];

  // Consent
  if (choiceIds.has('pause-reissue-consent') || choiceIds.has('opt-out-notice')) {
    respected.push('Patient informed consent — patients were notified and given a choice');
  } else if (choiceIds.has('legal-consent-sufficient')) {
    ignored.push('Patient informed consent — existing consent was accepted as sufficient without disclosure');
  }

  // Audit action
  if (choiceIds.has('suspend-immediately') || choiceIds.has('public-disclosure-advisory')) {
    respected.push('Acting on audit evidence — statistical findings triggered substantive response');
  } else if (choiceIds.has('counter-audit')) {
    ignored.push('Independent audit accountability — findings were challenged rather than acted upon');
  }

  // Community engagement
  if (
    choiceIds.has('community-first') ||
    choiceIds.has('community-oversight-board') ||
    choiceIds.has('full-apology-suspension') ||
    choiceIds.has('proactive-press-conference') ||
    choiceIds.has('public-disclosure-advisory')
  ) {
    respected.push('Community inclusion — affected communities were given voice before or alongside institutional decisions');
  }

  // Transparency with public
  if (choiceIds.has('proactive-press-conference') || choiceIds.has('public-disclosure-advisory')) {
    respected.push('Public transparency — findings were disclosed proactively rather than reactively');
  } else if (choiceIds.has('no-comment') || choiceIds.has('defensive-statement')) {
    ignored.push('Public accountability — institutional communications prioritized reputation over disclosure');
  }

  // Vendor accountability
  if (choiceIds.has('reject-until-transparent') || choiceIds.has('delay-equity-audit')) {
    respected.push('Vendor accountability — deployment was conditioned on transparency about training data and methodology');
  }

  // Long-term governance
  if (choiceIds.has('algorithmic-equity-standards') || choiceIds.has('community-governance-council') || choiceIds.has('patient-consent-framework')) {
    respected.push('Structural reform — governance mechanisms created to prevent recurrence, not just manage this incident');
  } else if (choiceIds.has('voluntary-guidelines')) {
    ignored.push('Binding reform — governance response relied on voluntary guidelines unlikely to produce structural change');
  }

  // No community oversight in crisis
  if (choiceIds.has('deploy-as-planned') || choiceIds.has('legal-consent-sufficient')) {
    ignored.push('Precautionary principle — deployment proceeded despite documented uncertainty about harm to specific groups');
  }

  if (choiceIds.has('defend-aggregate-outcomes') || choiceIds.has('redirect-process')) {
    ignored.push('Direct accountability to affected communities — direct questions about harm were not answered directly');
  }

  return { respected, ignored };
}

// ─── Main Engine ─────────────────────────────────────────────────────────────

export function computeEndingSummary(state: SimulationState): EndingSummary {
  const { madeChoices, stakeholderScores, livesTotal, marginalizationTotal, proceduralTotal, ethicsValueCounts } = state;

  // Sort ethics values by frequency
  const sortedValues = (Object.entries(ethicsValueCounts) as [EthicsValue, number][])
    .sort(([, a], [, b]) => b - a);
  const dominantValues: EthicsValue[] = sortedValues.slice(0, 2).map(([v]) => v);

  // Stakeholder final states
  const stakeholderFinalStates: StakeholderFinalState[] = STAKEHOLDERS.map(s => {
    const score = stakeholderScores[s.key];
    const sentiment =
      score >= 62 ? 'positive' :
      score >= 40 ? 'neutral' :
      'negative';
    return {
      key: s.key,
      score,
      sentiment,
      narrative: getStakeholderNarrative(s.key, score),
    };
  });

  const beneficiaries = stakeholderFinalStates
    .filter(s => s.score >= 62)
    .map(s => s.key);
  const harmed = stakeholderFinalStates
    .filter(s => s.score < 40)
    .map(s => s.key);

  const { respected, ignored } = identifySafeguards(madeChoices);

  const ethicsLens: EthicsLensSummary = {
    dominantValues,
    ethicsValueBreakdown: ethicsValueCounts,
    pragmatistAnalysis: getPragmatistAnalysis(dominantValues, livesTotal, marginalizationTotal),
    proceduralAnalysis: getProceduralAnalysis(proceduralTotal, madeChoices),
    beneficiaries,
    harmed,
    proceduralSafeguardsRespected: respected,
    proceduralSafeguardsIgnored: ignored,
    overallReflection:
      'There is no clean path through this dilemma. Every option involved real costs to real people. The question ethics asks is not whether you found an answer without cost — but whether you remained honest about the costs, distributed them fairly, and included those most affected in deciding what "fair" means.',
  };

  const outcome = computeOutcome(dominantValues, marginalizationTotal, proceduralTotal, stakeholderScores);

  return {
    outcomeTitle: outcome.title,
    outcomeSubtitle: outcome.subtitle,
    narrativeSummary: outcome.narrative,
    ethicsLens,
    stakeholderFinalStates,
    livesTotal,
    marginalizationScore: marginalizationTotal,
    proceduralScore: proceduralTotal,
    pathChoices: madeChoices,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

export function applyDeltas(
  current: Record<StakeholderKey, number>,
  deltas: Partial<Record<StakeholderKey, number>>
): Record<StakeholderKey, number> {
  const result = { ...current };
  for (const [key, delta] of Object.entries(deltas) as [StakeholderKey, number][]) {
    result[key] = clampScore((result[key] ?? 50) + delta);
  }
  return result;
}
