import { getMockAccountById, type MockAccount } from '~/lib/mockAccounts';
import type { GoalCalibrationId, GoalId } from '~/lib/onboarding-types';

export type AccountCategory = MockAccount['category'];

export type CoverageChecklistRow = {
  label: string;
  category: AccountCategory;
  /** When true, the row is informational for full coverage, not a hard gate. */
  optional: boolean;
};

export type GoalAccountCoverage = {
  /**
   * When true, the link screen can show a second "more" step with a category checklist
   * for multi-category goals (e.g. big plans, full picture, saving long-term).
   */
  showChecklist: boolean;
  /**
   * Rows to render when `showChecklist` and the "more" phase is active.
   */
  checklistRows: CoverageChecklistRow[];
  /**
   * If the member has at least this many linked accounts, treat optional extras as "done enough"
   * for the add-more prompt line (heuristic for demo when categories repeat).
   */
  idealLinkedCount: number;
};

/** Categories present among linked account ids. */
export function getLinkedAccountCategories(linkedIds: string[]): Set<AccountCategory> {
  const s = new Set<AccountCategory>();
  for (const id of linkedIds) {
    const a = getMockAccountById(id);
    if (a) s.add(a.category);
  }
  return s;
}

function has(cats: Set<AccountCategory>, c: AccountCategory): boolean {
  return cats.has(c);
}

/**
 * For multi-link goals, whether the member has linked enough category coverage to skip
 * the optional "add more" step and go straight to connecting after the first link screen.
 */
export function shouldSkipLinkMorePhase(
  goal: GoalId | null,
  calibration: GoalCalibrationId | null,
  linkedIds: string[]
): boolean {
  const cats = getLinkedAccountCategories(linkedIds);
  if (!getGoalAccountCoverage(goal, calibration).showChecklist) {
    return true;
  }
  if (goal === 'big-plans') {
    if (!has(cats, 'cash')) return false;
    if (calibration === 'career-change') return has(cats, 'investments');
    return has(cats, 'debt');
  }
  if (goal === 'clear-picture') {
    return has(cats, 'cash') && has(cats, 'investments');
  }
  return false;
}

export function getGoalAccountCoverage(
  goal: GoalId | null,
  calibration: GoalCalibrationId | null
): GoalAccountCoverage {
  if (goal === 'spending-control') {
    return {
      showChecklist: false,
      idealLinkedCount: 2,
      checklistRows: [
        { label: 'Checking or everyday spending', category: 'cash', optional: false },
        { label: 'Credit card or debt', category: 'debt', optional: true },
      ],
    };
  }
  if (goal === 'saving-enough') {
    return {
      showChecklist: false,
      idealLinkedCount: 2,
      checklistRows: [
        { label: 'A checking or savings account', category: 'cash', optional: false },
        {
          label: 'Investments',
          category: 'investments',
          optional: true,
        },
      ],
    };
  }
  if (goal === 'big-plans') {
    const secondIsInvest = calibration === 'career-change';
    return {
      showChecklist: true,
      idealLinkedCount: 2,
      checklistRows: [
        { label: 'A checking or savings account', category: 'cash', optional: false },
        {
          label: secondIsInvest ? 'Investments' : 'Debt or loans',
          category: secondIsInvest ? 'investments' : 'debt',
          optional: true,
        },
      ],
    };
  }
  if (goal === 'partner-alignment') {
    return {
      showChecklist: false,
      idealLinkedCount: 2,
      checklistRows: [
        { label: 'Shared checking or spending', category: 'cash', optional: false },
        { label: 'Debt or loans', category: 'debt', optional: true },
      ],
    };
  }
  if (goal === 'less-stress') {
    return {
      showChecklist: false,
      idealLinkedCount: 2,
      checklistRows: [
        { label: 'Checking or spending', category: 'cash', optional: false },
        { label: 'Credit card or debt', category: 'debt', optional: true },
      ],
    };
  }
  // clear-picture, unknown goal, and safe default
  return {
    showChecklist: true,
    idealLinkedCount: 3,
    checklistRows: [
      { label: 'A checking or savings account', category: 'cash', optional: false },
      { label: 'Investments', category: 'investments', optional: true },
      { label: 'Credit card or debt', category: 'debt', optional: true },
    ],
  };
}

/**
 * Checklist state for the link screen: which rows are satisfied.
 */
export function getCoverageChecklistState(
  linkedIds: string[],
  rows: CoverageChecklistRow[]
): { label: string; ready: boolean; optional: boolean }[] {
  const cats = getLinkedAccountCategories(linkedIds);
  return rows.map((row) => ({
    label: row.label,
    optional: row.optional,
    ready: cats.has(row.category),
  }));
}
