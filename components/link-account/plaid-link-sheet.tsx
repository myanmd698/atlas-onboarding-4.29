import { Check, CheckCircle2, LockKeyhole, ShieldCheck, X } from 'lucide-react-native';
import * as React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ONBOARDING_CONTENT_WIDTH_CLASS } from '~/components/onboarding/layout';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from '~/components/ui/actionsheet';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { agentDebugLog } from '~/lib/agent-debug-log';
import { getBankLogoSource } from '~/lib/bank-logos';
import { type MockAccount } from '~/lib/mockAccounts';

export type PlaidLinkStep = 'intro' | 'credentials' | 'success';

type PlaidStepState = 'done' | 'active' | 'upcoming';

function plaidStepState(step: PlaidLinkStep, index: number): PlaidStepState {
  const current = step === 'intro' ? 0 : step === 'credentials' ? 1 : 2;
  if (index < current) return 'done';
  if (index === current) return 'active';
  return 'upcoming';
}

function PlaidStepRow({
  label,
  description,
  state,
}: {
  label: string;
  description: string;
  state: PlaidStepState;
}) {
  return (
    <View className="flex-row gap-3">
      <View
        className={`mt-0.5 size-6 items-center justify-center rounded-full border ${
          state === 'done'
            ? 'border-brand bg-brand'
            : state === 'active'
              ? 'border-brand bg-brand/10'
              : 'border-border bg-muted'
        }`}>
        {state === 'done' ? (
          <Icon as={Check} size={14} className="text-brand-foreground" />
        ) : (
          <View className={`size-2 rounded-full ${state === 'active' ? 'bg-brand' : 'bg-muted-foreground/50'}`} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text
          variant="labelSmall"
          className={state === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}>
          {label}
        </Text>
        <Text variant="paragraphXSmall" className="mt-0.5 text-muted-foreground">
          {description}
        </Text>
      </View>
    </View>
  );
}

export function PlaidLinkSheet({
  bank,
  step,
  onClose,
  onStepChange,
  onComplete,
}: {
  bank: MockAccount | null;
  step: PlaidLinkStep;
  onClose: () => void;
  onStepChange: (step: PlaidLinkStep) => void;
  onComplete: () => void;
}) {
  const institutionName = bank?.institutionName ?? 'your institution';
  const logo = bank ? getBankLogoSource(bank.institutionName) : undefined;

  React.useEffect(() => {
    agentDebugLog(
      'components/link-account/plaid-link-sheet.tsx:sheetState',
      'PlaidLinkSheet state',
      {
        bankId: bank?.id ?? null,
        step,
        sheetOpen: bank !== null,
        platform: Platform.OS,
      },
      'H3'
    );
  }, [bank, step]);

  return (
    <Actionsheet isOpen={bank !== null} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <ActionsheetScrollView>
          <View className={`gap-5 pb-10 pt-2 ${ONBOARDING_CONTENT_WIDTH_CLASS}`}>
            <View className="flex-row items-start justify-between gap-4">
              <View className="min-w-0 flex-1">
                <Text variant="headingSmall" className="text-foreground">
                  Connect {institutionName}
                </Text>
                <Text variant="paragraphSmall" className="mt-2 text-muted-foreground">
                  Same sign-in flow as the real app; this walkthrough does not store anything.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                className="size-9 items-center justify-center rounded-full bg-muted">
                <Icon as={X} size={18} className="text-muted-foreground" />
              </Pressable>
            </View>

            <View className="items-center gap-3 rounded-2xl border border-border bg-background px-4 py-5">
              <View className="size-14 items-center justify-center rounded-xl bg-card">
                {logo ? (
                  <Image source={logo} resizeMode="contain" style={styles.sheetLogoImage} />
                ) : (
                  <Icon as={ShieldCheck} size={26} className="text-brand" />
                )}
              </View>
              <Text variant="labelMedium" className="text-center text-foreground">
                {institutionName}
              </Text>
              <View className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                <Icon as={LockKeyhole} size={14} className="text-muted-foreground" />
                <Text variant="paragraphXSmall" className="text-muted-foreground">
                  Encrypted connection
                </Text>
              </View>
            </View>

            <View className="gap-4 rounded-2xl border border-border bg-card p-4">
              <PlaidStepRow
                label="Choose your institution"
                description="From search, then sign in at your bank."
                state={plaidStepState(step, 0)}
              />
              <PlaidStepRow
                label="Sign in securely"
                description="Sign-in and two-step, handled at your bank."
                state={plaidStepState(step, 1)}
              />
              <PlaidStepRow
                label="Share accounts"
                description="Choose accounts, read-only."
                state={plaidStepState(step, 2)}
              />
            </View>

            {step === 'credentials' ? (
              <View className="gap-3 rounded-2xl border border-border bg-background p-4">
                <Text variant="labelSmall" className="text-foreground">
                  Simulated {institutionName} sign-in
                </Text>
                <View className="gap-2">
                  <View className="h-11 justify-center rounded-xl border border-border bg-card px-3">
                    <Text variant="paragraphSmall" className="text-muted-foreground">
                      Username
                    </Text>
                  </View>
                  <View className="h-11 justify-center rounded-xl border border-border bg-card px-3">
                    <Text variant="paragraphSmall" className="text-muted-foreground">
                      Password
                    </Text>
                  </View>
                </View>
                <Text variant="paragraphXSmall" className="text-muted-foreground">
                  Demo. Nothing is stored.
                </Text>
              </View>
            ) : null}

            {step === 'success' ? (
              <View className="items-center gap-2 rounded-2xl bg-brand/10 p-4">
                <Icon as={CheckCircle2} size={28} className="text-brand" />
                <Text variant="labelMedium" className="text-center text-foreground">
                  Accounts found
                </Text>
                <Text variant="paragraphSmall" className="text-center text-muted-foreground">
                  {institutionName} is ready, read-only for your overview.
                </Text>
              </View>
            ) : null}

            <View className="gap-2">
              {step === 'intro' ? (
                <Button
                  className="w-full"
                  onPress={() => {
                    agentDebugLog(
                      'components/link-account/plaid-link-sheet.tsx:Continue',
                      'Continue pressed intro->credentials',
                      { bankId: bank?.id ?? null, platform: Platform.OS },
                      'H3'
                    );
                    onStepChange('credentials');
                  }}>
                  <Text>Continue</Text>
                </Button>
              ) : step === 'credentials' ? (
                <>
                  <Button
                    className="w-full"
                    onPress={() => {
                      agentDebugLog(
                        'components/link-account/plaid-link-sheet.tsx:SimulateSignIn',
                        'Simulate sign-in pressed credentials->success',
                        { bankId: bank?.id ?? null, platform: Platform.OS },
                        'H3'
                      );
                      onStepChange('success');
                    }}>
                    <Text>Simulate secure sign-in</Text>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onPress={() => {
                      agentDebugLog(
                        'components/link-account/plaid-link-sheet.tsx:Back',
                        'Back pressed credentials->intro',
                        { bankId: bank?.id ?? null, platform: Platform.OS },
                        'H3'
                      );
                      onStepChange('intro');
                    }}>
                    <Text>Back</Text>
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  onPress={() => {
                    agentDebugLog(
                      'components/link-account/plaid-link-sheet.tsx:LinkAccounts',
                      'Link selected accounts pressed',
                      { bankId: bank?.id ?? null, platform: Platform.OS },
                      'H4'
                    );
                    onComplete();
                  }}>
                  <Text>Link selected accounts</Text>
                </Button>
              )}
            </View>
          </View>
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
}

const styles = StyleSheet.create({
  sheetLogoImage: {
    width: 40,
    height: 40,
    maxWidth: 40,
    maxHeight: 40,
  },
});
