import type { MockAccount } from '~/lib/mockAccounts';
import {
  getGoalAccountCoverage,
  type AccountCategory,
} from '~/lib/onboarding-account-coverage';
import type { GoalCalibrationId, GoalId } from '~/lib/onboarding-types';

type AccountCategoryType = AccountCategory;

const LINK_FIRST_CTA = 'Link your first account';

export type AccountPriority = {
  primaryCategory: AccountCategoryType;
  secondaryCategory: AccountCategoryType;
  primaryLabel: string;
  secondaryLabel: string;
  title: string;
  body: string;
  firstCta: string;
  /** When false, the link flow skips the second phase with a category checklist. */
  showChecklist: boolean;
};

export function getAccountPriority(
  goal: GoalId | null,
  calibration: GoalCalibrationId | null
): AccountPriority {
  const coverage = getGoalAccountCoverage(goal, calibration);
  const [first, second] = coverage.checklistRows;
  const primaryCategory = first.category;
  const secondaryCategory = second?.category ?? 'investments';
  const primaryLabel = first.label;
  const secondaryLabel = second?.label ?? 'Investments';

  if (goal === 'spending-control') {
    return {
      primaryCategory,
      secondaryCategory,
      primaryLabel,
      secondaryLabel,
      showChecklist: coverage.showChecklist,
      title: 'Start with checking',
      body: 'Start with the account your everyday spending runs through; one is enough to see shifts.',
      firstCta: LINK_FIRST_CTA,
    };
  }

  if (goal === 'saving-enough') {
    return {
      primaryCategory,
      secondaryCategory,
      primaryLabel,
      secondaryLabel,
      showChecklist: coverage.showChecklist,
      title: 'Start with cash flow',
      body: 'Start with the account that shows what is left after spending, so we can see if you are saving enough.',
      firstCta: LINK_FIRST_CTA,
    };
  }

  if (goal === 'big-plans') {
    const planLabel =
      calibration === 'house'
        ? 'a home'
        : calibration === 'kids-childcare'
          ? 'kids or childcare'
          : calibration === 'travel'
            ? 'travel'
            : calibration === 'career-change'
              ? 'a career change'
              : 'a big plan';
    return {
      primaryCategory,
      secondaryCategory,
      primaryLabel,
      secondaryLabel,
      showChecklist: coverage.showChecklist,
      title: 'Start with money in and out',
      body: `Connect cash in and out, add a second account, then see whether ${planLabel} still fits.`,
      firstCta: LINK_FIRST_CTA,
    };
  }

  if (goal === 'partner-alignment') {
    return {
      primaryCategory,
      secondaryCategory,
      primaryLabel,
      secondaryLabel,
      showChecklist: coverage.showChecklist,
      title: 'Start with the shared picture',
      body: 'Start with the account that best matches how you and your partner spend; add the rest when you are ready.',
      firstCta: LINK_FIRST_CTA,
    };
  }

  if (goal === 'less-stress') {
    return {
      primaryCategory,
      secondaryCategory,
      primaryLabel,
      secondaryLabel,
      showChecklist: coverage.showChecklist,
      title: 'Start where stress shows up',
      body: 'Start with one cash account to see what might need a look this week.',
      firstCta: LINK_FIRST_CTA,
    };
  }

  if (goal === 'clear-picture' || !goal) {
    return {
      primaryCategory,
      secondaryCategory,
      primaryLabel,
      secondaryLabel,
      showChecklist: coverage.showChecklist,
      title: 'Build your full picture',
      body:
        'Ideally link three accounts so cash, investing, and credit or debt are covered. Link one institution at a time; the checklist on the next step tracks progress.',
      firstCta: LINK_FIRST_CTA,
    };
  }
  return {
    primaryCategory,
    secondaryCategory,
    primaryLabel,
    secondaryLabel,
    showChecklist: coverage.showChecklist,
    title: 'Build your full picture',
    body: 'One account at a time; add more if you want more depth.',
    firstCta: LINK_FIRST_CTA,
  };
}

export function sortAccountsForGoal(
  accounts: MockAccount[],
  goal: GoalId | null,
  calibration: GoalCalibrationId | null
): MockAccount[] {
  const priority = getAccountPriority(goal, calibration);
  const rank = (account: MockAccount) => {
    if (account.category === priority.primaryCategory) return 0;
    if (account.category === priority.secondaryCategory) return 1;
    return 2;
  };

  return [...accounts].sort((a, b) => rank(a) - rank(b) || a.institutionName.localeCompare(b.institutionName));
}
