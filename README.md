# First, Do No Harm — An Ethics Decision Simulator

A scenario-based ethics decision simulator where you play a hospital administrator deciding whether to deploy an AI diagnostic tool that saves lives on average but systematically fails marginalized patient groups, without patients' knowledge or consent.

Built to engage the public — especially people who interact with healthcare systems — through the lenses of **pragmatist ethics** and **procedural ethics**.

---

## Setup

```bash
bun install
bun run dev     # development server at localhost:3000
bun run build   # production build
bun run start   # serve production build
```

Requires Bun (or Node) and internet access for Google Fonts on first load.

---

## Architecture Overview

```
app/
  layout.tsx              Root layout — fonts (EB Garamond + Geist), metadata
  globals.css             Tailwind v4 theme (ink/paper palettes), base styles
  page.tsx                Landing page (server component → LandingHero client)
  simulator/
    page.tsx              Simulator route (server shell → SimulatorEngine client)

lib/
  types.ts                All TypeScript types and interfaces
  scenario-data.ts        All 6 decision steps with full content
  consequence-engine.ts   Scoring logic, ethics analysis, outcome generation

components/
  landing/
    LandingHero.tsx       Animated landing page (client)
  simulator/
    SimulatorEngine.tsx   Main state machine orchestrator (client, useReducer)
    BriefingScreen.tsx    Pre-simulation briefing
    DecisionInterface.tsx Decision step UI with choice cards and stakeholder preview
    ConsequenceReveal.tsx Post-choice consequence reveal with headlines
    StakeholderPanel.tsx  Animated stakeholder trust/harm meters
    TimerBar.tsx          Atmospheric countdown timer
  results/
    ResultsSummary.tsx    Full results with ethics analysis, outcome narrative
```

### Data Flow

```
scenario-data.ts → SimulatorEngine (useReducer)
                                    ↓
                         User makes choice (Choice)
                                    ↓
                    applyDeltas() → new StakeholderScores
                    countValues() → ethicsValueCounts
                                    ↓
                         ConsequenceReveal shown
                                    ↓
                    [repeat 6 times]
                                    ↓
                    computeEndingSummary() → EndingSummary
                                    ↓
                         ResultsSummary shown
```

### State Machine

`SimulatorEngine` uses `useReducer` with 4 actions:

| Action | Transition |
|--------|------------|
| `BEGIN` | `briefing → decision` |
| `CHOOSE` | `decision → consequence` (applies deltas, records choice) |
| `NEXT_STEP` | `consequence → decision` or `consequence → results` |
| `RESTART` | any → `briefing` (resets state) |

---

## Extending the Scenario

### Adding a new decision step

Add to `MAIN_SCENARIO.steps` in `lib/scenario-data.ts`:

```typescript
{
  id: 'step-7-followup',
  stepNumber: 7,
  title: 'The Follow-Up Report',
  urgencyLabel: 'Annual review: 30 days',
  context: 'One year later...',
  urgencyNote: 'The board wants a retrospective.',
  evidenceGaps: ['Unknown long-term outcomes'],
  timerSeconds: 60,
  stakeholderPressures: { board: 'Wants a clean narrative.' },
  choices: [
    {
      id: 'publish-full-report',
      label: 'Publish full retrospective',
      text: 'Release a complete analysis...',
      tradeoffNote: 'Full transparency has institutional costs.',
      ethicsValues: ['transparency'],
      stakeholderDeltas: { media: 15, board: -10 },
      livesImpact: 0,
      marginalizationImpact: 5,
      proceduralScore: 8,
      consequenceText: 'The report is published...',
      consequenceHeadlines: ['JOURNAL: "A model for AI retrospective reporting."'],
    },
  ],
}
```

### Adding a new ethics value

1. Add to the `EthicsValue` union in `lib/types.ts`
2. Add label and description to `ETHICS_VALUE_LABELS` and `ETHICS_VALUE_DESCRIPTIONS` in `lib/consequence-engine.ts`
3. Tag relevant choices with the new value in `lib/scenario-data.ts`
4. (Optional) Add analysis logic in `getPragmatistAnalysis()` or `getProceduralAnalysis()`

### Adding a new stakeholder

1. Add to `StakeholderKey` union in `lib/types.ts`
2. Add to `STAKEHOLDERS` array in `lib/scenario-data.ts`
3. Add to `INITIAL_STAKEHOLDER_SCORES` in `lib/scenario-data.ts`
4. Add narrative logic in `getStakeholderNarrative()` in `lib/consequence-engine.ts`

---

## Key Design Decisions

- **No correct answer**: The consequence engine never tells users they made the right or wrong choice. Every option has documented costs.
- **Pragmatist + procedural framing**: Ethics is baked into the mechanics (stakeholder meters, procedural safeguard tracking) rather than lectures.
- **Emotional realism**: All scenario content is grounded in patterns from real documented AI healthcare equity failures.
- **Reduced motion support**: All animations respect `prefers-reduced-motion`.
- **Accessibility**: Timer is atmospheric only (no forced decisions), choices use `aria-pressed`, meters use `role="meter"`, consequences use `role="alert"` where appropriate.
