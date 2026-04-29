import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { BankLinkTile } from '~/components/link-account/bank-link-tile';
import { getBankGroupsForLinkAccount } from '~/components/link-account/bank-groups';
import { PlaidLinkSheet, type PlaidLinkStep } from '~/components/link-account/plaid-link-sheet';
import { ONBOARDING_CONTENT_WIDTH_CLASS } from '~/components/onboarding/layout';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { getOnboardingBankOptions } from '~/lib/onboarding-banks';
import {
  getAccountPriority,
  sortAccountsForGoal,
} from '~/lib/onboarding-account-priority';
import {
  getCoverageChecklistState,
  getGoalAccountCoverage,
} from '~/lib/onboarding-account-coverage';
import type { GoalCalibrationId, GoalId } from '~/lib/onboarding-types';
import { agentDebugLog } from '~/lib/agent-debug-log';
import { useOnboarding } from '~/lib/onboarding';
import { type MockAccount } from '~/lib/mockAccounts';

function articlePrimaryNounFromLabel(label: string): string {
  const t = label.trim();
  if (/^A\s/i.test(t)) {
    return `a ${t.slice(2).trim().toLowerCase()}`;
  }
  return t.toLowerCase();
}

function atlasFirstReadFocus(goal: GoalId | null, calibration: GoalCalibrationId | null): string {
  if (goal === 'saving-enough') {
    return 'whether you are saving enough each month';
  }
  if (goal === 'big-plans') {
    if (calibration === 'house') return 'whether a home is in reach';
    if (calibration === 'kids-childcare') return 'how kids or childcare would fit the plan';
    if (calibration === 'travel') return 'how travel would fit the plan';
    if (calibration === 'career-change') return 'how a career change would fit the plan';
    return 'whether a big life plan is in reach';
  }
  if (goal === 'partner-alignment') {
    return 'a good place to start a money talk with your partner';
  }
  if (goal === 'spending-control') {
    return 'where spending changed';
  }
  if (goal === 'less-stress') {
    return 'what might need a look this week';
  }
  return 'where your money stands right now';
}

function firstLinkSubcopy(
  goal: GoalId | null,
  calibration: GoalCalibrationId | null,
  primaryLabel: string
): string {
  if (goal === 'clear-picture') {
    const primaryNoun = articlePrimaryNounFromLabel(primaryLabel);
    const focus = atlasFirstReadFocus(goal, calibration);
    return `Start with ${primaryNoun}; first view centers on ${focus}.`;
  }
  if (goal === 'big-plans') {
    const primaryNoun = articlePrimaryNounFromLabel(primaryLabel);
    const focus = atlasFirstReadFocus(goal, calibration);
    return `Start with ${primaryNoun}, add one more, then we focus on ${focus}.`;
  }
  return '';
}

function linkScreenHeadline(goal: GoalId | null, showChecklist: boolean): string {
  if (!showChecklist) {
    return 'Link your account with Plaid';
  }
  if (goal === 'clear-picture') {
    return 'Start your full picture';
  }
  if (goal === 'big-plans') {
    return 'Connect accounts for your plan';
  }
  return 'Link your account with Plaid';
}

function linkScreenSubcopy(
  goal: GoalId | null,
  calibration: GoalCalibrationId | null,
  primaryLabel: string,
  showChecklist: boolean
): string {
  if (showChecklist) {
    const focus = atlasFirstReadFocus(goal, calibration);
    if (goal === 'clear-picture') {
      return `Ideally link three accounts, one institution at a time. The checklist tracks your progress across cash, investing, and credit or debt. Atlas starts with ${focus}.`;
    }
    if (goal === 'big-plans') {
      if (calibration === 'career-change') {
        return `Link cash, then investments when you can (debt optional). We focus on ${focus}. The checklist tracks each type as you go.`;
      }
      return `Link cash, then debt or loans when you can (investments optional). We focus on ${focus}. The checklist tracks each type as you go.`;
    }
  }
  return firstLinkSubcopy(goal, calibration, primaryLabel);
}

const CHECKLIST_TYPE_LEAD =
  'Checkmarks track data types, not how many banks you add.';

export default function OnboardingLinkScreen() {
  const router = useRouter();
  const { data, setLinkedBankIds } = useOnboarding();
  const banks = React.useMemo(
    () => sortAccountsForGoal(getOnboardingBankOptions(), data.goal, data.goalCalibration),
    [data.goal, data.goalCalibration]
  );
  const selected = new Set(data.linkedBankIds);
  const count = selected.size;
  const priority = getAccountPriority(data.goal, data.goalCalibration);
  const accountCoverage = getGoalAccountCoverage(data.goal, data.goalCalibration);

  const bankGroups = React.useMemo(
    () => getBankGroupsForLinkAccount(banks, priority),
    [banks, priority]
  );

  const [plaidBank, setPlaidBank] = React.useState<MockAccount | null>(null);
  const [plaidStep, setPlaidStep] = React.useState<PlaidLinkStep>('intro');

  const unlink = (id: string) => {
    const next = new Set(selected);
    next.delete(id);
    setLinkedBankIds([...next]);
  };

  const openPlaid = (bank: MockAccount) => {
    agentDebugLog(
      'app/onboarding/link.tsx:openPlaid',
      'openPlaid called',
      { bankId: bank.id, platform: Platform.OS },
      'H2'
    );
    setPlaidBank(bank);
    setPlaidStep('intro');
  };

  const closePlaid = () => {
    setPlaidBank(null);
    setPlaidStep('intro');
  };

  const completePlaidLink = () => {
    agentDebugLog(
      'app/onboarding/link.tsx:completePlaidLink',
      'completePlaidLink called',
      { plaidBankId: plaidBank?.id ?? null, linkedBefore: data.linkedBankIds.length },
      'H4'
    );
    if (!plaidBank) return;
    const next = new Set(data.linkedBankIds);
    next.add(plaidBank.id);
    setLinkedBankIds([...next]);
    closePlaid();
  };

  const onBack = () => {
    router.push('/onboarding/account-priority');
  };

  const goToConnecting = () => {
    router.push('/onboarding/connecting');
  };

  const headline = linkScreenHeadline(data.goal, accountCoverage.showChecklist);
  const subcopy = linkScreenSubcopy(
    data.goal,
    data.goalCalibration,
    priority.primaryLabel,
    accountCoverage.showChecklist
  );

  const coverage = getCoverageChecklistState(
    data.linkedBankIds,
    accountCoverage.checklistRows
  );
  const showChecklistTypeLead =
    data.goal !== 'clear-picture' && accountCoverage.showChecklist;

  const inner = (
    <View className={`gap-4 ${ONBOARDING_CONTENT_WIDTH_CLASS}`}>
      <View className="mb-2">
        <Text variant="headingLarge" className="font-serif">
          {headline}
        </Text>
        {subcopy ? (
          <Text variant="paragraphMedium" className="mt-2 text-muted-foreground">
            {subcopy}
          </Text>
        ) : null}
      </View>

      {accountCoverage.showChecklist ? (
        <View className="gap-3 rounded-xl border border-border bg-card p-4">
          <Text
            variant="labelSmall"
            className={
              data.goal === 'clear-picture'
                ? 'text-foreground'
                : 'uppercase tracking-wide text-muted-foreground'
            }>
            {data.goal === 'clear-picture' ? 'Your progress' : 'Types of data'}
          </Text>
          {showChecklistTypeLead ? (
            <Text variant="paragraphSmall" className="text-foreground">
              {CHECKLIST_TYPE_LEAD}
            </Text>
          ) : null}
          {coverage.map((row) => (
            <View key={row.label} className="flex-row items-center gap-2">
              <View
                className={`size-5 items-center justify-center rounded-full ${
                  row.ready ? 'bg-brand' : 'bg-muted'
                }`}>
                {row.ready ? <Icon as={Check} size={12} className="text-brand-foreground" /> : null}
              </View>
              <Text
                variant="paragraphSmall"
                className={`flex-1 ${row.ready ? 'text-foreground' : 'text-muted-foreground'}`}>
                {row.label}
                {row.optional ? ' (optional)' : ''}
              </Text>
            </View>
          ))}
          {count > 0 ? (
            <Text variant="paragraphXSmall" className="text-muted-foreground">
              {`${count} account${count === 1 ? '' : 's'} linked, one bank at a time.`}
            </Text>
          ) : null}
        </View>
      ) : null}

      {bankGroups.primary.length > 0 ? (
        <View className="gap-2">
          <Text variant="labelSmall" className="tracking-wide text-muted-foreground">
            Start with checking
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {bankGroups.primary.map((b) => (
              <BankLinkTile
                key={b.id}
                bank={b}
                isLinked={selected.has(b.id)}
                onPress={() => (selected.has(b.id) ? unlink(b.id) : openPlaid(b))}
              />
            ))}
          </View>
        </View>
      ) : null}

      {bankGroups.secondary.length > 0 ? (
        <View className="gap-2">
          <Text variant="labelSmall" className="uppercase tracking-wide text-muted-foreground">
            Add next (optional)
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {bankGroups.secondary.map((b) => (
              <BankLinkTile
                key={b.id}
                bank={b}
                isLinked={selected.has(b.id)}
                onPress={() => (selected.has(b.id) ? unlink(b.id) : openPlaid(b))}
              />
            ))}
          </View>
        </View>
      ) : null}

      {bankGroups.other.length > 0 ? (
        <View className="gap-2">
          <Text variant="labelSmall" className="uppercase tracking-wide text-muted-foreground">
            More institutions
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {bankGroups.other.map((b) => (
              <BankLinkTile
                key={b.id}
                bank={b}
                isLinked={selected.has(b.id)}
                onPress={() => (selected.has(b.id) ? unlink(b.id) : openPlaid(b))}
              />
            ))}
          </View>
        </View>
      ) : null}

      <Button className="mt-2 w-full" disabled={count === 0} onPress={goToConnecting}>
        <Text>See your overview</Text>
      </Button>
      <PlaidLinkSheet
        bank={plaidBank}
        step={plaidStep}
        onClose={closePlaid}
        onStepChange={setPlaidStep}
        onComplete={completePlaidLink}
      />
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={4} totalSteps={5} backFallback="/onboarding/account-priority" onBackPress={onBack} />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow pb-10"
        showsVerticalScrollIndicator={false}>
        {Platform.OS === 'web' ? (
          <MainContent>{inner}</MainContent>
        ) : (
          <View className="px-5 pt-4">{inner}</View>
        )}
      </ScrollView>
    </>
  );

  if (Platform.OS === 'web') {
    return <View className="min-h-screen flex-1 bg-background">{body}</View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {body}
    </SafeAreaView>
  );
}
