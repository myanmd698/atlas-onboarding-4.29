import { GOAL_SELECTION_COPY } from '~/lib/onboarding-goal-selection-copy';
import type { GoalId, HouseholdId, LifeEventId, PrimaryFocusId } from '~/lib/onboarding-types';

export const GOAL_LABEL: Record<GoalId, string> = {
  'spending-control': GOAL_SELECTION_COPY['spending-control'].label,
  'saving-enough': GOAL_SELECTION_COPY['saving-enough'].label,
  'less-stress': GOAL_SELECTION_COPY['less-stress'].label,
  'partner-alignment': GOAL_SELECTION_COPY['partner-alignment'].label,
  'big-plans': GOAL_SELECTION_COPY['big-plans'].label,
  'clear-picture': GOAL_SELECTION_COPY['clear-picture'].label,
};

export function formatGoalLabels(goalIds: GoalId[]): string {
  return goalIds.map((id) => GOAL_LABEL[id]).join(' · ');
}

export const HOUSEHOLD_LABEL: Record<HouseholdId, string> = {
  solo: 'Just me',
  with_partner: 'Me and a partner',
  young_children: 'Young children at home',
};

export const LIFE_EVENT_LABEL: Record<LifeEventId, string> = {
  buy_home: 'Buying a home',
  marriage: 'Marriage or partnership',
  retirement: 'Retirement planning',
  new_child: 'Growing the family',
  education: 'Education funding',
  job_change: 'Job or income change',
  none_soon: 'Nothing major soon',
};

export const PRIMARY_FOCUS_LABEL: Record<PrimaryFocusId, string> = {
  track_results: 'See if I am winning',
  small_adjustments: 'Tighten the screws',
  household_clarity: 'Package it for my partner',
  avoid_mistakes: 'Stay on the rails',
};
