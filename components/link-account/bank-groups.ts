import type { AccountPriority } from '~/lib/onboarding-account-priority';
import type { MockAccount } from '~/lib/mockAccounts';

export function getBankGroupsForLinkAccount(banks: MockAccount[], priority: AccountPriority) {
  const primary = banks.filter((b) => b.category === priority.primaryCategory);
  const secondary = banks.filter(
    (b) => b.category === priority.secondaryCategory && b.category !== priority.primaryCategory
  );
  const used = new Set([...primary, ...secondary].map((b) => b.id));
  const other = banks.filter((b) => !used.has(b.id));
  return { primary, secondary, other };
}
