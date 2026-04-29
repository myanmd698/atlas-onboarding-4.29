/** Lens used to judge the member's first financial briefing. */
export type GoalId =
  | 'spending-control'
  | 'saving-enough'
  | 'less-stress'
  | 'partner-alignment'
  | 'big-plans'
  | 'clear-picture';

export type GoalCalibrationId =
  | 'house'
  | 'kids-childcare'
  | 'travel'
  | 'career-change'
  | 'other-plan';

export type CoupleAlignmentId =
  | 'mostly-aligned'
  | 'some-differences'
  | 'avoid-talking'
  | 'not-sure';

export type HouseholdId = 'solo' | 'with_partner' | 'young_children';

export type LifeEventId =
  | 'buy_home'
  | 'marriage'
  | 'retirement'
  | 'new_child'
  | 'education'
  | 'job_change'
  | 'none_soon';

export type PrimaryFocusId =
  | 'track_results'
  | 'small_adjustments'
  | 'household_clarity'
  | 'avoid_mistakes';

export type OnboardingData = {
  goal: GoalId | null;
  goalCalibration: GoalCalibrationId | null;
  coupleAlignment: CoupleAlignmentId | null;
  linkedBankIds: string[];
  completed: boolean;
  /** Optional extended profile (household / life-events flows). */
  household: HouseholdId | null;
  lifeEventIds: LifeEventId[];
  primaryFocus: PrimaryFocusId | null;
};

export const defaultOnboardingData: OnboardingData = {
  goal: null,
  goalCalibration: null,
  coupleAlignment: null,
  linkedBankIds: [],
  completed: false,
  household: null,
  lifeEventIds: [],
  primaryFocus: null,
};

const VALID_GOALS = new Set<GoalId>([
  'spending-control',
  'saving-enough',
  'less-stress',
  'partner-alignment',
  'big-plans',
  'clear-picture',
]);

const VALID_CALIBRATIONS = new Set<GoalCalibrationId>([
  'house',
  'kids-childcare',
  'travel',
  'career-change',
  'other-plan',
]);

const VALID_COUPLE_ALIGNMENTS = new Set<CoupleAlignmentId>([
  'mostly-aligned',
  'some-differences',
  'avoid-talking',
  'not-sure',
]);

/** Map legacy onboarding goal ids to lens ids for persisted storage. */
const LEGACY_GOAL_MAP: Record<string, GoalId> = {
  direction: 'clear-picture',
  milestone: 'big-plans',
  alignment: 'partner-alignment',
  optimize: 'spending-control',
  save_more: 'saving-enough',
  pay_debt: 'less-stress',
  invest: 'spending-control',
  buy_home: 'big-plans',
};

export function normalizeStoredGoal(raw: unknown): GoalId | null {
  if (raw == null || typeof raw !== 'string') return null;
  if (VALID_GOALS.has(raw as GoalId)) return raw as GoalId;
  return LEGACY_GOAL_MAP[raw] ?? null;
}

export function normalizeStoredCalibration(raw: unknown): GoalCalibrationId | null {
  if (raw == null || typeof raw !== 'string') return null;
  if (VALID_CALIBRATIONS.has(raw as GoalCalibrationId)) return raw as GoalCalibrationId;
  return null;
}

export function normalizeStoredCoupleAlignment(raw: unknown): CoupleAlignmentId | null {
  if (raw == null || typeof raw !== 'string') return null;
  if (VALID_COUPLE_ALIGNMENTS.has(raw as CoupleAlignmentId)) return raw as CoupleAlignmentId;
  return null;
}

const VALID_HOUSEHOLD = new Set<HouseholdId>(['solo', 'with_partner', 'young_children']);

export function normalizeStoredHousehold(raw: unknown): HouseholdId | null {
  if (raw == null || typeof raw !== 'string') return null;
  if (VALID_HOUSEHOLD.has(raw as HouseholdId)) return raw as HouseholdId;
  return null;
}

const VALID_LIFE_EVENTS = new Set<LifeEventId>([
  'buy_home',
  'marriage',
  'retirement',
  'new_child',
  'education',
  'job_change',
  'none_soon',
]);

export function normalizeLifeEventList(raw: unknown): LifeEventId[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is LifeEventId =>
    typeof x === 'string' && VALID_LIFE_EVENTS.has(x as LifeEventId)
  );
}

const VALID_PRIMARY_FOCUS = new Set<PrimaryFocusId>([
  'track_results',
  'small_adjustments',
  'household_clarity',
  'avoid_mistakes',
]);

export function normalizeStoredPrimaryFocus(raw: unknown): PrimaryFocusId | null {
  if (raw == null || typeof raw !== 'string') return null;
  if (VALID_PRIMARY_FOCUS.has(raw as PrimaryFocusId)) return raw as PrimaryFocusId;
  return null;
}

function isCalibrationCompatible(goal: GoalId | null, calibration: GoalCalibrationId | null): boolean {
  if (!goal || !calibration) return false;
  if (goal === 'big-plans') {
    return [
      'house',
      'kids-childcare',
      'travel',
      'career-change',
      'other-plan',
    ].includes(calibration);
  }
  return false;
}

/**
 * When applying AsyncStorage to React state, async reads can finish after the user already
 * picked a goal or linked banks, but before `writeStored` has persisted. Prefer in-memory
 * non-null / non-empty fields over a stale `fromStorage` snapshot so the UI does not reset.
 */
export function mergeRehydration(prev: OnboardingData, fromStorage: OnboardingData): OnboardingData {
  const goal = fromStorage.goal ?? prev.goal;
  const goalCalibration = fromStorage.goalCalibration ?? prev.goalCalibration;
  const coupleAlignment = fromStorage.coupleAlignment ?? prev.coupleAlignment;

  return {
    ...defaultOnboardingData,
    ...fromStorage,
    goal,
    goalCalibration: isCalibrationCompatible(goal, goalCalibration) ? goalCalibration : null,
    coupleAlignment: goal === 'partner-alignment' ? coupleAlignment : null,
    linkedBankIds: fromStorage.linkedBankIds.length > 0 ? fromStorage.linkedBankIds : prev.linkedBankIds,
    completed: fromStorage.completed || prev.completed,
    household: fromStorage.household ?? prev.household,
    lifeEventIds:
      fromStorage.lifeEventIds.length > 0 ? fromStorage.lifeEventIds : prev.lifeEventIds,
    primaryFocus: fromStorage.primaryFocus ?? prev.primaryFocus,
  };
}
