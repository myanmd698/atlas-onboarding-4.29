import type { GoalId } from '~/lib/onboarding-types';

/** Labels for onboarding goal picker (step 2) and timeline title on step 3. */
export const GOAL_SELECTION_COPY: Record<GoalId, { label: string }> = {
  'spending-control': {
    label: 'Monitor my spending',
  },
  'saving-enough': {
    label: 'Keep my savings on track',
  },
  'less-stress': {
    label: 'Ask Atlas AI for financial insights',
  },
  'partner-alignment': {
    label: 'See my household finances at a glance',
  },
  'big-plans': {
    label: 'Plan for the future',
  },
  'clear-picture': {
    label: 'See my full picture',
  },
};
