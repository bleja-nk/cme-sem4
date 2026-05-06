import type { Scenario, Stakeholder } from './types';

export const STAKEHOLDERS: Stakeholder[] = [
  {
    key: 'patients',
    name: 'General Patient Population',
    shortName: 'Patients',
    description: 'All patients who will interact with the AI diagnostic system',
    icon: '🏥',
  },
  {
    key: 'marginalized',
    name: 'Marginalized Communities',
    shortName: 'Marginalized',
    description:
      'Black, Hispanic, and Native American patients, and those with limited English proficiency — groups shown to face worse outcomes from the AI',
    icon: '⚖️',
  },
  {
    key: 'clinicians',
    name: 'Clinical Staff',
    shortName: 'Clinicians',
    description: 'Physicians, nurses, and technicians who will use or be supervised by the system',
    icon: '👩‍⚕️',
  },
  {
    key: 'board',
    name: 'Hospital Board',
    shortName: 'Board',
    description: 'Executive leadership and board members focused on institutional performance and reputation',
    icon: '🏛️',
  },
  {
    key: 'regulators',
    name: 'Health Regulators',
    shortName: 'Regulators',
    description: 'State health department officials and federal oversight bodies monitoring algorithmic tools in healthcare',
    icon: '📋',
  },
  {
    key: 'media',
    name: 'Press & Public',
    shortName: 'Press',
    description: 'Journalists, community advocates, and the broader public watching how the hospital acts',
    icon: '📰',
  },
];

export const INITIAL_STAKEHOLDER_SCORES = {
  patients: 50,
  marginalized: 50,
  clinicians: 50,
  board: 55,
  regulators: 50,
  media: 50,
} as const;

export const MAIN_SCENARIO: Scenario = {
  id: 'medvision-ai-deployment',
  title: 'The Algorithm Decision',
  subtitle: 'Six decisions. No clean answers.',
  steps: [
    // ────────────────────────────────────────────────────────────────
    // STEP 1: Initial Deployment
    // ────────────────────────────────────────────────────────────────
    {
      id: 'step-1-deployment',
      stepNumber: 1,
      title: 'The Evidence Brief',
      urgencyLabel: 'Board meeting: 48 hours',
      context:
        'MedVision AI — a sepsis detection system — has passed internal QA and improves detection rates by 23% across your patient population. But your data science team\'s subgroup analysis shows the system performs 18% worse for Black patients and 14% worse for Hispanic patients. The vendor characterises these figures as within their "acceptable performance margins" — a term they have not defined or shared methodology for. Your hospital has committed alongside three others to deploying the tool, and the board expects a deployment announcement at Friday\'s meeting. Thirty-four preventable deaths last year are the stated justification for moving quickly.',
      urgencyNote:
        'Two peer hospitals deploy MedVision next month. The board is presenting mortality reduction to donors on Friday. Every week of delay carries a statistical cost in lives—and a political cost you can feel in every email.',
      evidenceGaps: [
        'Vendor has not disclosed the demographic composition of their training dataset',
        '"Acceptable performance margins" is undefined — no methodology shared',
        'Your data team\'s subgroup analysis used only 8 months of local data (small sample for some groups)',
        'No clinician review of how the tool flags patients in practice',
        'Long-term outcomes for patients acted on by the AI are unknown',
      ],
      timerSeconds: 90,
      stakeholderPressures: {
        board: 'Expects a deployment announcement at Friday\'s board meeting. Mortality metrics are the headline.',
        clinicians: 'Has not been briefed. Several physicians have privately asked about the rollout timeline.',
        marginalized: 'Community health advocates are not yet aware of the subgroup data.',
        regulators: 'State health department issued voluntary guidance last year recommending equity audits for algorithmic tools.',
      },
      choices: [
        {
          id: 'deploy-as-planned',
          label: 'Deploy as planned',
          text: 'Proceed with full deployment on schedule, accepting the vendor\'s characterisation of subgroup performance as within acceptable margins.',
          tradeoffNote:
            'You save the most lives in aggregate—but the disparity in care quality for marginalized patients continues and deepens, without their knowledge.',
          ethicsValues: ['utilitarian'],
          stakeholderDeltas: {
            patients: 8,
            marginalized: -18,
            clinicians: -5,
            board: 15,
            regulators: -8,
            media: -5,
          },
          livesImpact: 12,
          marginalizationImpact: -7,
          proceduralScore: -5,
          consequenceText:
            'MedVision goes live across all wards on schedule. Overall sepsis detection improves measurably, and three preventable deaths are averted in the first two months. Clinicians notice the tool occasionally seems to miss certain patients but attribute it to baseline variability. The subgroup disparity is not surfaced again internally. The vendor\'s "monitoring agreement" arrives 11 weeks later—a form letter.',
          consequenceHeadlines: [
            'INTERNAL MEMO — Dr. Chen, ICU Lead: "System seems to flag some patients inconsistently. Watching it."',
            'BOARD MINUTES: "MedVision deployment on track. Q1 mortality indicators trending positive."',
            'INTERNAL NOTE — Quality Assurance: "Subgroup monitoring protocol not yet established."',
          ],
        },
        {
          id: 'delay-equity-audit',
          label: 'Delay for equity audit',
          text: 'Halt deployment and commission a full demographic equity audit before proceeding. Require the vendor to share training data demographics and methodology before any deployment decision.',
          tradeoffNote:
            'You protect marginalized communities from known harm—but the delay has a real statistical cost. Some patients who would have been saved may not be.',
          ethicsValues: ['precautionary', 'equity'],
          stakeholderDeltas: {
            patients: -5,
            marginalized: 15,
            clinicians: 10,
            board: -20,
            regulators: 15,
            media: 8,
          },
          livesImpact: -4,
          marginalizationImpact: 6,
          proceduralScore: 8,
          consequenceText:
            'The board meeting goes poorly. The deployment delay is characterized by some board members as "letting process override lives." The vendor pushes back on data sharing and threatens to reprioritize another hospital. Your data team begins the equity audit. Clinicians, when finally briefed, overwhelmingly support the decision. The audit will take 10–14 weeks.',
          consequenceHeadlines: [
            'BOARD MEETING NOTES: "Deployment delayed pending further review. Board chair requests written justification."',
            'EMAIL — MedVision Sales: "We want to flag concerns about your timeline. Two other health systems are ready to move forward."',
            'INTERNAL SURVEY — Clinical Staff: "88% of respondents support equity review before deployment."',
          ],
        },
        {
          id: 'limited-pilot',
          label: 'Limited pilot with monitoring',
          text: 'Deploy in two wards only, with a formal protocol to track outcomes disaggregated by race, ethnicity, and language. Expand or halt based on what the pilot data shows.',
          tradeoffNote:
            'You try to learn without fully committing—but you\'re knowingly creating unequal care within your own hospital, and the pilot may be too small to detect the disparity.',
          ethicsValues: ['procedural', 'precautionary'],
          stakeholderDeltas: {
            patients: 4,
            marginalized: 5,
            clinicians: 8,
            board: 5,
            regulators: 8,
            media: 2,
          },
          livesImpact: 4,
          marginalizationImpact: 0,
          proceduralScore: 6,
          consequenceText:
            'Two wards launch with MedVision under a formal monitoring protocol. The equity tracking produces real data but progress is slow—the pilot wards have limited demographic diversity for meaningful subgroup analysis. Clinicians in non-pilot wards begin asking why they don\'t have access. The board accepts the approach but emphasizes urgency.',
          consequenceHeadlines: [
            'CLINICAL COMMITTEE NOTES: "Pilot design approved. Monitoring protocol to be reviewed monthly."',
            'EMAIL — Dr. Okafor, Medicine Ward: "Why aren\'t we included? What are the selection criteria?"',
            'DATA TEAM NOTE: "Estimated 18 weeks to statistical significance on subgroup outcomes."',
          ],
        },
        {
          id: 'reject-until-transparent',
          label: 'Reject until data is disclosed',
          text: 'Decline to deploy until the vendor provides full transparency on training data demographics, validation methodology, and a binding definition of "acceptable margins."',
          tradeoffNote:
            'You demand accountability from the vendor—but they may simply walk away, leaving you with no tool and the same mortality rates.',
          ethicsValues: ['transparency', 'autonomy'],
          stakeholderDeltas: {
            patients: 0,
            marginalized: 10,
            clinicians: 5,
            board: -25,
            regulators: 20,
            media: 10,
          },
          livesImpact: -6,
          marginalizationImpact: 8,
          proceduralScore: 10,
          consequenceText:
            'You send MedVision a formal data request covering training demographics and audit methodology. They respond in 3 weeks with a non-disclosure agreement and a partial summary. The full training data is "proprietary." The board is frustrated. Regulators quietly express appreciation for your position. The negotiation stalls.',
          consequenceHeadlines: [
            'VENDOR RESPONSE — MedVision: "We\'re unable to share proprietary training data. Our validation process meets FDA guidance."',
            'STATE HEALTH DEPT — Informal communication: "We\'re watching how health systems handle algorithmic accountability. Your request is noted."',
            'BOARD EMAIL: "This posture puts us at a competitive disadvantage. Please advise on resolution."',
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // STEP 2: The Consent Gap
    // ────────────────────────────────────────────────────────────────
    {
      id: 'step-2-consent',
      stepNumber: 2,
      title: 'The Consent Gap',
      urgencyLabel: 'Advocates meet press: 7 days',
      context:
        'Legal has reviewed patient consent documentation and found that the standard admission agreement — drafted in 2019 — does not mention AI-assisted diagnostics, algorithmic decision support, or the possibility of disparate outcomes. To date, 1,247 patients have had their care influenced by MedVision outputs, and none were told. A coalition of community health advocates — primarily representing Black and Hispanic residents — has formally requested a meeting with the hospital; they have heard secondhand that a new diagnostic system is in use. Their meeting with a local health reporter is scheduled for next week.',
      urgencyNote:
        'If advocates speak with the press without hearing from you first, the story will be defined by their framing—and they don\'t yet know about the subgroup performance data.',
      evidenceGaps: [
        'Legal says existing consent is "defensible" but not certain — different attorneys disagree',
        'Unknown how many of the 1,247 patients belong to affected demographic groups',
        'Unknown whether affected patients would have opted out if given the choice',
        'No established hospital precedent for AI-specific consent',
      ],
      timerSeconds: 90,
      stakeholderPressures: {
        board: 'Concerned about legal exposure. Wants a position that minimizes liability.',
        patients: '1,247 people made medical decisions under AI guidance they didn\'t know about.',
        marginalized: 'Advocates are specifically asking about the new "AI system."',
        regulators: 'HHS issued informal guidance last year that AI diagnostic tools may require specific consent.',
      },
      choices: [
        {
          id: 'legal-consent-sufficient',
          label: 'Validate existing consent',
          text: 'Accept legal\'s assessment that existing consent is sufficient, issue no additional notification, and respond to advocates with general information.',
          tradeoffNote:
            'You minimize institutional friction—but patients who were processed by an algorithm they didn\'t consent to remain uninformed, and the risk of future exposure grows.',
          ethicsValues: ['utilitarian'],
          stakeholderDeltas: {
            patients: -12,
            marginalized: -15,
            clinicians: -5,
            board: 10,
            regulators: -15,
            media: -10,
          },
          livesImpact: 0,
          marginalizationImpact: -5,
          proceduralScore: -8,
          consequenceText:
            'No notification goes out. The advocates\' meeting with the reporter happens on schedule. Without specific information, the story runs as a general "AI in healthcare" piece. Three months later, a patient in another city sues their hospital over undisclosed AI diagnostic tools using nearly identical consent language. Your legal team quietly reviews your exposure.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospitals Deploy AI Diagnosis Tools. Patients Often Unaware."',
            'LEGAL REVIEW NOTE: "In light of pending litigation at Mercy General, counsel recommends reassessing consent architecture."',
            'PATIENT RIGHTS ADVOCATE: "We asked a direct question and got a statement about quality care. That\'s not an answer."',
          ],
        },
        {
          id: 'pause-reissue-consent',
          label: 'Pause AI use, reissue consent',
          text: 'Immediately suspend AI-assisted diagnostics until all future patients have signed an updated, specific consent form. Send written notification to the 1,247 affected patients.',
          tradeoffNote:
            'You do the right thing by patients—but pausing the system carries a real cost in detection quality, and the notification letter will likely generate significant anxiety and press attention.',
          ethicsValues: ['autonomy', 'procedural'],
          stakeholderDeltas: {
            patients: 15,
            marginalized: 15,
            clinicians: 5,
            board: -15,
            regulators: 15,
            media: 8,
          },
          livesImpact: -3,
          marginalizationImpact: 7,
          proceduralScore: 10,
          consequenceText:
            'MedVision is suspended. 1,247 notification letters go out. Within 72 hours, the hospital receives 312 calls from concerned patients and families. Two local TV stations pick up the story. Several patients are confused and frightened. Clinicians manage the calls with professionalism. The board is alarmed, but the regulators note the hospital as an example of responsible disclosure.',
          consequenceHeadlines: [
            'CHANNEL 7 HEALTH — "City Hospital Sends AI Notification Letters to Over 1,000 Patients"',
            'STATE HEALTH DEPT MEMO: "Flagging Riverside General as an example of proactive AI consent remediation."',
            'BOARD EMERGENCY MEETING NOTES: "Volume of patient inquiries exceeds communications capacity. Request for additional resources."',
          ],
        },
        {
          id: 'opt-out-notice',
          label: 'Send notice, offer opt-out',
          text: 'Notify all affected patients in writing, explaining the AI system\'s use in their care, and offer an opt-out for future AI-assisted diagnostics.',
          tradeoffNote:
            'A middle path—more honest than silence, less disruptive than full suspension. But a letter is not the same as informed consent, and opt-out framing puts the burden on patients who may not understand the issue.',
          ethicsValues: ['transparency', 'autonomy'],
          stakeholderDeltas: {
            patients: 10,
            marginalized: 8,
            clinicians: 5,
            board: -5,
            regulators: 5,
            media: 5,
          },
          livesImpact: 0,
          marginalizationImpact: 3,
          proceduralScore: 5,
          consequenceText:
            'The notification letters are sent. Response rates to the opt-out are low—many patients don\'t understand what they received. Advocates call the letter "technically informative but practically meaningless." Regulators consider it a step forward. The press story, when it runs, covers the notification as evidence the hospital "scrambled" to address a known issue.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital Sends AI Opt-Out Letters. Advocates Say It\'s Not Enough."',
            'INTERNAL CALL LOG: "340 patient inquiries received. Common question: \'Did the AI hurt me?\'"',
            'REGULATOR NOTE: "Notification effort acknowledged. Recommend follow-up on opt-out comprehension rates."',
          ],
        },
        {
          id: 'ethics-board-review',
          label: 'Commission ethics board review',
          text: 'Pause AI deployment and refer the consent question to the hospital ethics committee. Convene an expedited review of the hospital\'s obligations under existing and emerging AI consent standards.',
          tradeoffNote:
            'You take the question seriously and create a legitimate institutional process—but the delay leaves 1,247 patients uninformed while you deliberate.',
          ethicsValues: ['procedural', 'precautionary'],
          stakeholderDeltas: {
            patients: 5,
            marginalized: 8,
            clinicians: 10,
            board: -10,
            regulators: 10,
            media: 2,
          },
          livesImpact: -2,
          marginalizationImpact: 3,
          proceduralScore: 8,
          consequenceText:
            'The ethics committee convenes. The review is substantive and includes voices from clinical ethics, patient advocacy, and health law. It takes 6 weeks. The committee recommends proactive disclosure and updated consent—findings you then implement. Slow, but defensible. The 1,247 patients remain uninformed during that window.',
          consequenceHeadlines: [
            'ETHICS COMMITTEE INTERIM REPORT: "Existing consent architecture inadequate for AI diagnostic tools. Recommends updated framework."',
            'BOARD NOTES: "Ethics review timeline noted. Board asks for interim communications plan."',
            'ADVOCATES\' LETTER: "We appreciate the ethics process. We also note that real patients are in limbo."',
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // STEP 3: The Audit Report
    // ────────────────────────────────────────────────────────────────
    {
      id: 'step-3-audit',
      stepNumber: 3,
      title: 'The Audit Report',
      urgencyLabel: 'Board emergency session: 72 hours',
      context:
        'An independent audit has produced unambiguous findings: MedVision performs 31% worse for Black patients, 27% worse for Native American patients, and 19% worse for patients with limited English proficiency, with statistically significant false negative rates across all three groups (p < 0.001). The vendor disputes the methodology — three internal clinicians have signed a letter questioning the audit\'s validity, and three others have signed a letter calling for immediate suspension. This morning, a patient advocacy organisation two states away announced legal action against MedVision\'s developer for harm caused by the same tool. Your board is convening an emergency session in 72 hours, and the vendor\'s legal team has already contacted yours.',
      urgencyNote:
        'The vendor\'s legal team has contacted yours. The board is convening an emergency session in 72 hours. The other hospital\'s litigation is now a matter of public record.',
      evidenceGaps: [
        'Vendor disputes audit methodology — counter-evidence not yet available',
        'Unclear whether human-only baseline would produce better or worse outcomes for affected groups',
        'Unknown whether the disparity can be corrected and on what timeline',
        'No definitive guidance from FDA or CMS on threshold for algorithm suspension',
      ],
      timerSeconds: 75,
      stakeholderPressures: {
        marginalized: 'Advocacy groups are aware of the litigation at the peer hospital and are mobilizing.',
        clinicians: 'Internally divided. Strong feelings on both sides. Clinical trust in leadership is fragile.',
        board: 'Focused on legal exposure and institutional reputation. Wants a defensible position.',
        regulators: 'State health department has sent a formal inquiry asking for the hospital\'s response to the audit.',
      },
      choices: [
        {
          id: 'suspend-immediately',
          label: 'Suspend deployment immediately',
          text: 'Halt MedVision system-wide, effective today, pending a full clinical and technical review. Notify state regulators of the suspension and your findings.',
          tradeoffNote:
            'You protect the groups most at risk—but some patients who would have benefited from the AI\'s detection capabilities for majority groups will not. The decision is highly visible and will be scrutinized.',
          ethicsValues: ['precautionary', 'equity'],
          stakeholderDeltas: {
            patients: 3,
            marginalized: 20,
            clinicians: 10,
            board: -20,
            regulators: 15,
            media: 10,
          },
          livesImpact: -5,
          marginalizationImpact: 9,
          proceduralScore: 8,
          consequenceText:
            'MedVision is suspended. Clinicians return to baseline protocols. The state health department receives your notification and issues a supportive statement. Locally, the suspension is reported as "hospital pauses AI tool over equity concerns"—the framing is cautious but not catastrophic. The board session is difficult; two board members call the decision premature. Three clinicians write a letter to the medical journal.',
          consequenceHeadlines: [
            'CITY PAPER — "Riverside General Suspends AI Diagnostic Tool Over Racial Bias Findings"',
            'STATE HEALTH DEPT STATEMENT: "Riverside General\'s action reflects appropriate precautionary standards for algorithmic tools in healthcare."',
            'BOARD EMERGENCY SESSION NOTES: "Decision to suspend made unilaterally. Board requests structured review process going forward."',
          ],
        },
        {
          id: 'continue-with-oversight',
          label: 'Continue with mandatory human oversight',
          text: 'Keep MedVision running but require a senior clinician to independently review all flagged cases involving patients from the three identified demographic groups before any clinical action is taken.',
          tradeoffNote:
            'You try to compensate for the known bias—but the oversight layer is an administrative fix, not a technical one, and it places additional cognitive burden on already stretched clinical staff.',
          ethicsValues: ['utilitarian', 'procedural'],
          stakeholderDeltas: {
            patients: 5,
            marginalized: 2,
            clinicians: -5,
            board: 5,
            regulators: 0,
            media: -5,
          },
          livesImpact: 5,
          marginalizationImpact: 1,
          proceduralScore: 2,
          consequenceText:
            'The dual-review protocol is implemented. Clinicians flag immediately that it requires identifying patient demographics before review—creating workflow friction and, in some cases, conscious or unconscious bias in how "high scrutiny" patients are treated. Two months in, a nurse submits a formal complaint about the protocol\'s operationalization. Regulators are not satisfied with the response to their inquiry.',
          consequenceHeadlines: [
            'NURSING STAFF COMPLAINT FORM: "The dual-review protocol requires us to categorize patients by race before reviewing AI outputs. This feels wrong."',
            'REGULATOR FOLLOW-UP: "We note that continued deployment under these conditions does not fully address the documented harm. Please provide additional response."',
            'VENDOR PRESS RELEASE: "MedVision remains in use at Riverside General. Vendor confident in tool\'s clinical value."',
          ],
        },
        {
          id: 'public-disclosure-advisory',
          label: 'Disclose publicly, form advisory panel',
          text: 'Release the audit findings publicly. Announce the formation of a stakeholder advisory panel—including representatives from affected communities—with a mandate to recommend a path forward within 60 days.',
          tradeoffNote:
            'You act with integrity and include affected voices in the process—but public disclosure accelerates external pressure, and the 60-day timeline means the system continues operating on affected patients in the interim.',
          ethicsValues: ['transparency', 'equity', 'procedural'],
          stakeholderDeltas: {
            patients: 8,
            marginalized: 14,
            clinicians: 5,
            board: -10,
            regulators: 10,
            media: 15,
          },
          livesImpact: 2,
          marginalizationImpact: 5,
          proceduralScore: 8,
          consequenceText:
            'The audit is published on the hospital\'s website with a plain-language summary. The advisory panel—twelve members including three community health advocates, two affected patients, and two clinicians—holds its first meeting two weeks later. The press coverage is substantive and largely fair. Several board members are uncomfortable with the public disclosure, but external reception is generally positive.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital Publishes AI Bias Report, Forms Community Panel"',
            'ADVISORY PANEL MEMBER (community advocate): "We\'ve never been at this table before. That matters, even if the timeline is frustrating."',
            'BOARD NOTES: "Public disclosure created significant external commentary. Request communications review for future institutional disclosures."',
          ],
        },
        {
          id: 'counter-audit',
          label: 'Commission counter-audit, maintain status quo',
          text: 'Challenge the audit methodology by commissioning a second, independent review. Maintain current deployment while the counter-audit is conducted, expected to take 8–12 weeks.',
          tradeoffNote:
            'You avoid acting on contested data—but during those 8–12 weeks, patients from marginalized groups continue to receive care influenced by a system confirmed to harm them.',
          ethicsValues: ['utilitarian'],
          stakeholderDeltas: {
            patients: -3,
            marginalized: -15,
            clinicians: -10,
            board: 10,
            regulators: -15,
            media: -15,
          },
          livesImpact: 3,
          marginalizationImpact: -6,
          proceduralScore: -8,
          consequenceText:
            'The counter-audit is commissioned from a firm that has previously worked with MedVision\'s parent company—a conflict that advocacy groups identify within 10 days. Regulators formally note "inadequate response to documented harm." A local state senator announces a hearing on AI in healthcare. Clinicians who opposed continued deployment begin speaking to media.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital Disputes AI Bias Report, Hires Firm With Vendor Ties"',
            'STATE SENATOR\'S OFFICE — Press release: "Announcement of hearing on AI diagnostic tools in healthcare settings."',
            'CLINICIAN LETTER TO MEDIA: "As healthcare workers, we believe our patients deserve better than this process."',
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // STEP 4: The Journalist
    // ────────────────────────────────────────────────────────────────
    {
      id: 'step-4-journalist',
      stepNumber: 4,
      title: 'The Journalist',
      urgencyLabel: 'Story publishes: 48 hours',
      context:
        'A reporter at the city newspaper has obtained the original subgroup analysis, the independent audit, and internal emails in which hospital leadership discussed whether the disparities fell within "acceptable margins." The story runs in 48 hours regardless — but the reporter is offering you the opportunity to respond on record. Your communications director wants a statement emphasising overall positive outcomes; your legal team wants no comment. The community health coalition has left three voicemails in the past 24 hours — they want to speak before any public statement is made.',
      urgencyNote:
        'The story is written. The question is whether the hospital\'s voice in it is one of transparency and accountability, damage control, or silence.',
      evidenceGaps: [
        'Unknown which internal emails the reporter has access to — or their full context',
        'Unknown whether other current or former employees will speak on record',
        'Unknown how the story will be framed once published',
      ],
      timerSeconds: 90,
      stakeholderPressures: {
        board: 'Deeply concerned about reputational exposure. Strongly prefers a controlled, defensive posture.',
        marginalized: 'The coalition represents the communities most affected. They feel they have been kept out of this.',
        media: 'Reporter has given you a fair opportunity to respond on record. That window closes in 24 hours.',
        regulators: 'Will be reading the story when it runs. Your public position will shape their next move.',
      },
      choices: [
        {
          id: 'proactive-press-conference',
          label: 'Proactive press conference — full transparency',
          text: 'Hold a press conference before the story runs — disclose the findings, acknowledge the harm, and announce specific accountability measures.',
          tradeoffNote:
            'You take control of the narrative with integrity—but you expose the full scope of the situation before you have a remediation plan in place. The board will be furious.',
          ethicsValues: ['transparency', 'autonomy'],
          stakeholderDeltas: {
            patients: 10,
            marginalized: 10,
            clinicians: 8,
            board: -15,
            regulators: 10,
            media: 20,
          },
          livesImpact: 0,
          marginalizationImpact: 5,
          proceduralScore: 7,
          consequenceText:
            'You hold the press conference. The story runs anyway—but now it reads as "hospital proactively discloses AI bias, announces accountability measures." Nationally, it becomes a cited example of institutional transparency. Locally, trust in the hospital from marginalized communities, while not repaired, is not further damaged. Two board members formally object to the decision. The CEO receives national speaking invitations.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital Gets Ahead of AI Bias Story — Holds Press Conference Before Publication"',
            'NATIONAL HEALTH POLICY JOURNAL — "A Case Study in Algorithmic Accountability: Riverside General\'s Approach"',
            'BOARD MEMBER EMAIL: "This was not the agreed communications strategy. I\'m formally objecting to this approach."',
          ],
        },
        {
          id: 'defensive-statement',
          label: 'Issue statement emphasizing overall outcomes',
          text: 'Release a prepared statement that emphasizes the 23% overall improvement in sepsis detection, characterizes subgroup differences as "an area of ongoing improvement," and notes the hospital\'s commitment to continuous quality monitoring.',
          tradeoffNote:
            'You protect the institutional narrative in the short term—but the statement reads as deflection against documented harm, and will likely inflame community trust.',
          ethicsValues: ['utilitarian'],
          stakeholderDeltas: {
            patients: -5,
            marginalized: -15,
            clinicians: -5,
            board: 15,
            regulators: -10,
            media: -20,
          },
          livesImpact: 0,
          marginalizationImpact: -5,
          proceduralScore: -5,
          consequenceText:
            'The statement is released. The reporter runs the full story alongside it, with your statement quoted in the eighth paragraph. The contrast between the internal emails—"within acceptable margins"—and the public statement about "ongoing improvement" is the story\'s centerpiece. Advocates call it "corporate doublespeak." The story is picked up by two national outlets.',
          consequenceHeadlines: [
            'CITY PAPER — "Inside a Hospital\'s AI Bias Problem — And Its Carefully Worded Response"',
            'NATIONAL HEALTH DESK — "Hospital\'s Statement Called \'Damage Control\' By Advocates After AI Bias Disclosure"',
            'COMMUNITY HEALTH COALITION — Open letter: "This statement does not reflect accountability. It reflects strategy."',
          ],
        },
        {
          id: 'community-first',
          label: 'Meet with community coalition before any statement',
          text: 'Call the coalition back before issuing any public statement, and meet with community representatives in the next 12 hours — letting their input shape how the hospital communicates publicly.',
          tradeoffNote:
            'You center the most affected communities in your response—but the 12-hour window before publication is tight, and the coalition may ask for commitments you\'re not yet prepared to make.',
          ethicsValues: ['equity', 'procedural'],
          stakeholderDeltas: {
            patients: 5,
            marginalized: 20,
            clinicians: 5,
            board: -10,
            regulators: 5,
            media: 5,
          },
          livesImpact: 0,
          marginalizationImpact: 8,
          proceduralScore: 6,
          consequenceText:
            'You meet with the coalition at 7am. It is a difficult, honest conversation. They ask for three things: public acknowledgment of harm, suspension of the tool, and a seat at the remediation table. You commit to two of three. The public statement is issued jointly—hospital and coalition—hours before the story runs. The reporter adjusts her framing: "Hospital and advocates respond together."',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital and Community Advocates Issue Joint Statement on AI Bias: \'We Share This Problem\'"',
            'COALITION REPRESENTATIVE: "It\'s not enough yet. But this conversation was real. That\'s different."',
            'BOARD NOTES: "Joint statement issued without full board approval. Communications process under review."',
          ],
        },
        {
          id: 'no-comment',
          label: 'No comment — refer all to legal',
          text: 'Issue a "no comment at this time" response and direct all press inquiries to legal counsel.',
          tradeoffNote:
            'You minimize immediate legal exposure—but silence in this context reads as admission and abandonment. The story will run without your voice in it.',
          ethicsValues: [],
          stakeholderDeltas: {
            patients: -10,
            marginalized: -20,
            clinicians: -10,
            board: 5,
            regulators: -20,
            media: -25,
          },
          livesImpact: 0,
          marginalizationImpact: -8,
          proceduralScore: -8,
          consequenceText:
            'The story runs without a statement from the hospital. The silence is itself the story. "No comment" is quoted 11 times across regional and national coverage. The state health department calls for a formal investigation. Three clinicians speak on record. The community coalition holds a press conference of their own. The board\'s legal strategy has produced the outcome it sought to prevent.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital Refuses Comment on AI Bias Report. \'No Comment,\' Said 11 Times."',
            'STATE HEALTH DEPT — "Formal investigation opened into AI diagnostic practices at Riverside General."',
            'CLINICIAN STATEMENT: "We can\'t stay silent when our patients can\'t advocate for themselves in this process."',
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // STEP 5: The Town Hall
    // ────────────────────────────────────────────────────────────────
    {
      id: 'step-5-townhall',
      stepNumber: 5,
      title: 'The Town Hall',
      urgencyLabel: 'Community meeting: tonight',
      context:
        'The meeting room is at standing capacity — patients, community health workers, nurses still in scrubs, two board members, a state health department representative, and a documentary filmmaker in the back. The moderator opens by reading aloud an internal email you wrote six weeks ago: "The subgroup figures fall within the vendor\'s acceptable margins. We should move forward." A woman in the third row — a diabetic patient whose care was influenced by MedVision — asks: "Did you know the computer was less accurate for people like me? And if you did, why didn\'t you tell us?" This moment is being recorded.',
      urgencyNote:
        'This moment is being recorded. What you say in this room tonight will define how your community understands what happened—and whether this institution can be trusted.',
      evidenceGaps: [
        'Unknown whether the email quote, read aloud, was complete or selectively excerpted',
        'Unknown how many people in the room have direct personal experience of harm',
        'Unknown whether this moment will escalate to legal action or de-escalate',
      ],
      timerSeconds: 60,
      stakeholderPressures: {
        marginalized: 'The room is weighted toward people from communities the data shows were harmed.',
        clinicians: 'Several nurses and one physician are in attendance. They are watching how leadership responds.',
        board: 'Two board members are present. They are evaluating whether this moment can be managed.',
        media: 'A journalist and documentary filmmaker are in the room.',
      },
      choices: [
        {
          id: 'full-apology-suspension',
          label: 'Full apology — commit to suspension',
          text: 'Answer the question directly: the hospital knew, and continuing was wrong. Apologise as an institution that failed a patient, and commit publicly to suspending the tool until the community is satisfied it is safe.',
          tradeoffNote:
            'You tell the truth and take responsibility. It is painful, and it will cost you politically—but it is the only thing this room will believe.',
          ethicsValues: ['equity', 'transparency', 'procedural'],
          stakeholderDeltas: {
            patients: 15,
            marginalized: 25,
            clinicians: 10,
            board: -20,
            regulators: 10,
            media: 15,
          },
          livesImpact: 0,
          marginalizationImpact: 9,
          proceduralScore: 8,
          consequenceText:
            'The room is still for a long moment after your statement. Then the woman who asked nods slowly. Not forgiveness—not yet—but recognition that the answer was real. Several people cry. The state regulator takes notes. The board members leave before the meeting ends. Outside, your communications director is already managing what will happen next. Inside, something shifts.',
          consequenceHeadlines: [
            'DOCUMENTARY FILMING NOTES: "She answered the question. I\'ve been doing this for 20 years. That doesn\'t happen often."',
            'CITY PAPER — "Hospital Administrator Apologizes at Town Hall: \'We Knew. We Should Have Told You.\'"',
            'BOARD EMERGENCY CALL — next morning: "We need to discuss the implications of last night\'s public commitments."',
          ],
        },
        {
          id: 'defend-aggregate-outcomes',
          label: 'Defend the aggregate outcomes data',
          text: 'Acknowledge the subgroup data, but emphasise that the system has saved lives overall and that every clinical tool involves tradeoffs.',
          tradeoffNote:
            'You give the utilitarian answer. It is factually defensible—and it will feel, to most people in this room, like you are telling them their lives matter less.',
          ethicsValues: ['utilitarian'],
          stakeholderDeltas: {
            patients: -10,
            marginalized: -25,
            clinicians: -15,
            board: 10,
            regulators: -10,
            media: -20,
          },
          livesImpact: 0,
          marginalizationImpact: -9,
          proceduralScore: -5,
          consequenceText:
            'The room becomes hostile. The woman in the third row says: "So our lives are the cost of doing business." Two nurses walk out. The state health department representative asks for a formal copy of the aggregate outcomes analysis. The documentary filmmaker keeps the camera running. That clip will be seen by 400,000 people in three weeks.',
          consequenceHeadlines: [
            'VIRAL CLIP — Hospital administrator at town hall: "Population-level benefit must be weighed against subgroup variation."',
            'PATIENT IN ATTENDANCE: "She said our lives are subgroup variation."',
            'STATE REGULATOR — Following day: "The department is expanding the scope of its review."',
          ],
        },
        {
          id: 'community-oversight-board',
          label: 'Announce community oversight with veto power',
          text: 'Acknowledge the harm and commit to a community oversight board — not advisory, but with genuine authority to pause or reject AI tool deployments.',
          tradeoffNote:
            'You offer something real: structural power, not just voice. It will complicate your governance. It will also be the most credible thing you can say in this room.',
          ethicsValues: ['equity', 'procedural', 'autonomy'],
          stakeholderDeltas: {
            patients: 15,
            marginalized: 25,
            clinicians: 5,
            board: -15,
            regulators: 15,
            media: 10,
          },
          livesImpact: 0,
          marginalizationImpact: 9,
          proceduralScore: 9,
          consequenceText:
            'The room listens carefully. There is skepticism—"Will this board have real power, or is this another committee?"—but also measured engagement. A community health worker raises her hand: "I want to be on that board." The regulator nods. The board members exchange glances. In six weeks, the oversight council holds its first meeting. It is the hardest governance process the hospital has ever run.',
          consequenceHeadlines: [
            'CITY PAPER — "Hospital Proposes Community AI Oversight Board With Veto Power. Advocates Cautiously Engaged."',
            'COMMUNITY HEALTH WORKER at town hall: "If this is real, we\'ll be there. If it\'s not, you\'ll know."',
            'BOARD MEETING — subsequent: "Legal is reviewing the governance implications of veto power for an external board."',
          ],
        },
        {
          id: 'redirect-process',
          label: 'Redirect to ongoing improvements',
          text: 'Describe the hospital\'s process improvements — monitoring protocols, the consent review, the equity working group — and express commitment to continuous improvement without acknowledging specific failures.',
          tradeoffNote:
            'You describe real things that are happening—but in this room, this moment, the language of process will sound like evasion. Because it is.',
          ethicsValues: [],
          stakeholderDeltas: {
            patients: -5,
            marginalized: -15,
            clinicians: -5,
            board: 5,
            regulators: -5,
            media: -10,
          },
          livesImpact: 0,
          marginalizationImpact: -5,
          proceduralScore: -3,
          consequenceText:
            'The room loses faith in real time. The moderator asks you three times to answer the direct question: "Did you know?" Each time you redirect to process. A community advocate calls it "institutional language designed to avoid accountability." The documentary filmmaker later notes it as the central scene in their film. No specific commitments are made. The meeting ends in frustration.',
          consequenceHeadlines: [
            'DOCUMENTARY EXCERPT: "She asked six times. She never got a yes or no."',
            'COMMUNITY ADVOCATE STATEMENT: "We came to a town hall and got a press release read aloud."',
            'PATIENT RIGHTS GROUP — following week: "Filing formal complaint with state health department."',
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // STEP 6: The Policy Foundation
    // ────────────────────────────────────────────────────────────────
    {
      id: 'step-6-policy',
      stepNumber: 6,
      title: 'The Policy Foundation',
      urgencyLabel: 'Institutional legacy decision',
      context:
        'Six months have passed. The state health department, two national AI ethics bodies, and fourteen regional hospitals are asking what you learned — and what you will do with it. You have been invited to present an AI governance framework at a state health policy convening; whatever you propose will likely become model language for other institutions. You think about the woman in the third row. About the 1,247 patients who weren\'t told.',
      urgencyNote:
        'The framework you propose today will shape how the next hospital—and the one after that—deploys AI tools. You have leverage you didn\'t have before. Use it or lose it.',
      evidenceGaps: [
        'Unknown whether proposed standards will be adopted by peer institutions',
        'Unknown whether equity audits, as currently designed, can detect all forms of algorithmic harm',
        'Unknown whether community governance will scale or be captured by institutional priorities over time',
      ],
      timerSeconds: 90,
      stakeholderPressures: {
        regulators: 'Looking for a concrete framework they can reference in future guidance.',
        marginalized: 'Watching whether structural change happens or whether commitments remain symbolic.',
        board: 'Concerned about competitive position. Extensive new requirements could slow future deployments.',
        clinicians: 'Want clarity on how governance decisions will involve clinical judgment, not just administration.',
      },
      choices: [
        {
          id: 'algorithmic-equity-standards',
          label: 'Mandatory algorithmic equity standards',
          text: 'Propose binding pre-deployment demographic performance audits with a hard threshold: no tool deployed if it underperforms for any patient group by more than 10%, with mandatory vendor disclosure of training data demographics.',
          tradeoffNote:
            'You create a hard standard that protects the most vulnerable—but it may slow innovation and create barriers for tools that could still save lives overall if deployed with appropriate oversight.',
          ethicsValues: ['equity', 'procedural'],
          stakeholderDeltas: {
            patients: 12,
            marginalized: 18,
            clinicians: 5,
            board: -5,
            regulators: 20,
            media: 10,
          },
          livesImpact: 3,
          marginalizationImpact: 8,
          proceduralScore: 9,
          consequenceText:
            'The framework is adopted by the state health department as model guidance. Three vendors immediately challenge the 10% threshold as "technically unworkable." Two hospitals announce they will adopt it voluntarily before it becomes mandatory. The woman from the town hall is invited to the implementation advisory panel. She accepts.',
          consequenceHeadlines: [
            'STATE HEALTH POLICY BRIEF: "Riverside General Framework Adopted as Model AI Equity Standard for Healthcare Settings."',
            'VENDOR CONSORTIUM — Letter: "The 10% threshold is arbitrary and technically unfeasible. We request a formal comment period."',
            'COMMUNITY ADVOCATE: "It\'s a start. A real one. We\'ll be watching the implementation."',
          ],
        },
        {
          id: 'patient-consent-framework',
          label: 'Patient consent and opt-out framework',
          text: 'Propose a rights-based framework requiring specific informed consent before any AI diagnostic tool is used in patient care, with a genuine opt-out option and plain-language disclosure of known performance differences.',
          tradeoffNote:
            'You center patient autonomy and informed consent—but opt-out frameworks can reduce uptake of beneficial tools, and patients who opt out may receive lower quality baseline care.',
          ethicsValues: ['autonomy', 'procedural', 'transparency'],
          stakeholderDeltas: {
            patients: 20,
            marginalized: 10,
            clinicians: 5,
            board: 0,
            regulators: 15,
            media: 10,
          },
          livesImpact: 1,
          marginalizationImpact: 6,
          proceduralScore: 9,
          consequenceText:
            'The consent framework is widely praised by patient rights organizations. Implementation is harder than expected: consent forms are long, patients are confused by statistical language, and opt-out rates vary significantly by demographic—raising a new equity question about who opts out and why. A follow-up study becomes its own policy document.',
          consequenceHeadlines: [
            'PATIENT RIGHTS ORG — Statement: "Riverside General\'s consent framework is the most patient-centered AI governance proposal we\'ve reviewed."',
            'IMPLEMENTATION NOTE: "Opt-out rates: general population 8%. Black patients 24%. Hispanic patients 31%. Requires further research."',
            'JOURNAL OF HEALTH POLICY: "Consent as Equity: Unexpected Findings from AI Tool Opt-Out Data."',
          ],
        },
        {
          id: 'community-governance-council',
          label: 'Multi-stakeholder governance council',
          text: 'Propose a permanent AI governance council with legal authority over deployment decisions — community advocates hold veto power, decisions are made by consensus, and any member group can trigger a review.',
          tradeoffNote:
            'You create the most democratic governance structure—but consensus decision-making is slow, veto power can create deadlock, and community members may not have the technical capacity to evaluate complex algorithmic tools without significant institutional support.',
          ethicsValues: ['equity', 'procedural', 'autonomy', 'transparency'],
          stakeholderDeltas: {
            patients: 15,
            marginalized: 20,
            clinicians: 8,
            board: -10,
            regulators: 15,
            media: 10,
          },
          livesImpact: 2,
          marginalizationImpact: 9,
          proceduralScore: 10,
          consequenceText:
            'The governance council is established and becomes a nationally watched experiment. The first year is difficult: three veto triggers, two deployment delays, and one full reversal of a tool that had already been approved. By year two, the council develops its own expertise. One council member—a community health worker—co-authors a policy paper cited in federal AI guidance.',
          consequenceHeadlines: [
            'NEW ENGLAND JOURNAL OF MEDICINE — "A New Model for AI Governance: The Riverside General Community Council Experiment."',
            'COUNCIL YEAR 1 REPORT: "Three deployment reviews triggered. Two resolved through negotiation. One tool rejected on equity grounds."',
            'COMMUNITY HEALTH WORKER — Council member: "I came in not knowing what an F1 score was. Now I chair the audit committee."',
          ],
        },
        {
          id: 'voluntary-guidelines',
          label: 'Voluntary best-practice guidelines',
          text: 'Propose non-binding best-practice guidelines for AI equity in healthcare, encouraging demographic auditing, consent specificity, and community engagement, but leaving enforcement to individual institutional judgment.',
          tradeoffNote:
            'You propose something most institutions will accept—because it doesn\'t require them to change much. Voluntary frameworks rarely produce structural change.',
          ethicsValues: ['procedural'],
          stakeholderDeltas: {
            patients: 0,
            marginalized: -5,
            clinicians: 0,
            board: 10,
            regulators: -10,
            media: -5,
          },
          livesImpact: 1,
          marginalizationImpact: -2,
          proceduralScore: 2,
          consequenceText:
            'The guidelines are adopted widely—in the sense that hospitals add them to their policy documents. Two years later, a follow-up study finds that 80% of adopting institutions have made no material changes to their AI deployment practices. A federal report on algorithmic harm in healthcare references the gap between voluntary guidelines and actual implementation outcomes.',
          consequenceHeadlines: [
            'HOSPITAL ASSOCIATION — Statement: "We commend Riverside General\'s thoughtful, flexible approach to AI governance guidance."',
            'FEDERAL REPORT: "Voluntary guidelines in healthcare AI: adoption is high, implementation is low."',
            'COMMUNITY ADVOCATE — Two years later: "They had the chance to do something real. They did something easy."',
          ],
        },
      ],
    },
  ],
};
