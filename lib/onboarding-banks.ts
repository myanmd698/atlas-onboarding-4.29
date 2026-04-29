import {
  MOCK_CASH_ACCOUNTS,
  MOCK_DEBT_ACCOUNTS,
  MOCK_INVESTMENT_ACCOUNTS,
  type MockAccount,
} from '~/lib/mockAccounts';

/**
 * All sample accounts, one card each (per account), so the same bank can show as cash
 * and as debt, e.g. Chase checking and Chase card.
 */
export function getOnboardingBankOptions(): MockAccount[] {
  const all: MockAccount[] = [
    ...MOCK_CASH_ACCOUNTS,
    ...MOCK_INVESTMENT_ACCOUNTS,
    ...MOCK_DEBT_ACCOUNTS,
  ];
  return all.sort(
    (a, b) =>
      a.institutionName.localeCompare(b.institutionName) || a.name.localeCompare(b.name)
  );
}
