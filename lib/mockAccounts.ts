/** Position in a brokerage account (ETFs, stocks, etc.). */
export type BrokerageHolding = {
  symbol: string;
  name: string;
  kind: 'etf' | 'stock';
  shares: number;
  marketValue: number;
  currentPrice: number;
  dayChangePct: number;
  dayChangeDollar: number;
  lifetimeGainDollar: number;
  lifetimeGainPct: number;
  expenseRatioPercent: number | null;
};

export type HoldingMetricId = 'lifetimeGainLoss' | 'dayChange' | 'expenseRatio' | 'currentPrice';

export const HOLDING_METRIC_OPTIONS: { id: HoldingMetricId; label: string }[] = [
  { id: 'lifetimeGainLoss', label: 'Lifetime gain/loss' },
  { id: 'dayChange', label: 'Day change' },
  { id: 'expenseRatio', label: 'Expense ratio' },
  { id: 'currentPrice', label: 'Current price' },
];

export type MockAccount = {
  id: string;
  name: string;
  accountNumber: string;
  institutionName: string;
  balance: number;
  category: 'cash' | 'investments' | 'debt';
  investProgramType?: 'roboAdvisor' | 'selfDirected';
  lastUpdated?: string;
  brokerageHoldings?: BrokerageHolding[];
};

export const MOCK_CASH_ACCOUNTS: MockAccount[] = [
  {
    id: 'chase-checking-1012',
    name: 'Chase Premier Checking',
    accountNumber: '**** 1012',
    institutionName: 'Chase',
    balance: 14850.22,
    category: 'cash',
    lastUpdated: '2025-03-04T08:15:00Z',
  },
  {
    id: 'amex-hysa-3928',
    name: 'Amex HYSA',
    accountNumber: '**** 3928',
    institutionName: 'Amex',
    balance: 42600.18,
    category: 'cash',
    lastUpdated: '2025-03-04T08:14:00Z',
  },
  {
    id: 'qapital-wallet-4401',
    name: 'Qapital Spend',
    accountNumber: '**** 4401',
    institutionName: 'Qapital',
    balance: 3240.41,
    category: 'cash',
    lastUpdated: '2025-03-04T09:00:00Z',
  },
  {
    id: 'qapital-save-7754',
    name: 'Qapital Save',
    accountNumber: '**** 7754',
    institutionName: 'Qapital',
    balance: 28750.63,
    category: 'cash',
    lastUpdated: '2025-03-04T09:00:00Z',
  },
];

export const MOCK_INVESTMENT_ACCOUNTS: MockAccount[] = [
  {
    id: 'qapital-invest-6620',
    name: 'Balanced Portfolio',
    accountNumber: '**** 6620',
    institutionName: 'Qapital',
    balance: 92480.77,
    category: 'investments',
    investProgramType: 'roboAdvisor',
    lastUpdated: '2025-03-04T09:00:00Z',
    brokerageHoldings: [
      {
        symbol: 'VOO',
        name: 'Vanguard S&P 500 ETF',
        kind: 'etf',
        shares: 52.5,
        marketValue: 24500,
        currentPrice: 466.67,
        dayChangePct: 0.22,
        dayChangeDollar: 53.9,
        lifetimeGainDollar: 4120,
        lifetimeGainPct: 20.2,
        expenseRatioPercent: 0.03,
      },
      {
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        kind: 'etf',
        shares: 44.2,
        marketValue: 18200,
        currentPrice: 411.76,
        dayChangePct: 0.18,
        dayChangeDollar: 32.8,
        lifetimeGainDollar: 2850,
        lifetimeGainPct: 18.6,
        expenseRatioPercent: 0.04,
      },
      {
        symbol: 'VXUS',
        name: 'Vanguard Total International Stock ETF',
        kind: 'etf',
        shares: 182.1,
        marketValue: 12340,
        currentPrice: 67.77,
        dayChangePct: -0.12,
        dayChangeDollar: -14.8,
        lifetimeGainDollar: 980,
        lifetimeGainPct: 8.6,
        expenseRatioPercent: 0.08,
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        kind: 'stock',
        shares: 28,
        marketValue: 15800,
        currentPrice: 564.29,
        dayChangePct: 0.41,
        dayChangeDollar: 64.6,
        lifetimeGainDollar: 2200,
        lifetimeGainPct: 16.2,
        expenseRatioPercent: null,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        kind: 'stock',
        shares: 8.5,
        marketValue: 12640,
        currentPrice: 1487.06,
        dayChangePct: -0.09,
        dayChangeDollar: -11.4,
        lifetimeGainDollar: 1890,
        lifetimeGainPct: 17.6,
        expenseRatioPercent: null,
      },
      {
        symbol: 'NVDA',
        name: 'Nvidia Corp.',
        kind: 'stock',
        shares: 12,
        marketValue: 9000.77,
        currentPrice: 750.06,
        dayChangePct: 1.05,
        dayChangeDollar: 93.5,
        lifetimeGainDollar: 2410,
        lifetimeGainPct: 36.6,
        expenseRatioPercent: null,
      },
    ],
  },
  {
    id: 'qapital-self-directed-2048',
    name: 'Self-Directed Portfolio',
    accountNumber: '**** 2048',
    institutionName: 'Qapital',
    balance: 57040.35,
    category: 'investments',
    investProgramType: 'selfDirected',
    lastUpdated: '2025-03-04T09:02:00Z',
    brokerageHoldings: [
      {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        kind: 'etf',
        shares: 46.23,
        marketValue: 21200,
        currentPrice: 458.66,
        dayChangePct: 0.67,
        dayChangeDollar: 141.9,
        lifetimeGainDollar: 3820,
        lifetimeGainPct: 21.98,
        expenseRatioPercent: 0.2,
      },
      {
        symbol: 'SCHD',
        name: 'Schwab U.S. Dividend Equity ETF',
        kind: 'etf',
        shares: 184.22,
        marketValue: 14800,
        currentPrice: 80.34,
        dayChangePct: -0.14,
        dayChangeDollar: -20.4,
        lifetimeGainDollar: 1150,
        lifetimeGainPct: 8.43,
        expenseRatioPercent: 0.06,
      },
      {
        symbol: 'BND',
        name: 'Vanguard Total Bond Market ETF',
        kind: 'etf',
        shares: 126.97,
        marketValue: 9200,
        currentPrice: 72.46,
        dayChangePct: 0.05,
        dayChangeDollar: 4.6,
        lifetimeGainDollar: 210,
        lifetimeGainPct: 2.34,
        expenseRatioPercent: 0.03,
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        kind: 'stock',
        shares: 59.67,
        marketValue: 11840.35,
        currentPrice: 198.42,
        dayChangePct: 0.54,
        dayChangeDollar: 63.72,
        lifetimeGainDollar: 1760,
        lifetimeGainPct: 17.46,
        expenseRatioPercent: null,
      },
    ],
  },
  {
    id: 'fidelity-invest-5531',
    name: 'Fidelity Brokerage',
    accountNumber: '**** 5531',
    institutionName: 'Fidelity',
    balance: 158420.35,
    category: 'investments',
    lastUpdated: '2025-03-03T16:00:00Z',
  },
  {
    id: 'vanguard-ira-8821',
    name: 'Vanguard Roth IRA',
    accountNumber: '**** 8821',
    institutionName: 'Vanguard',
    balance: 86750.12,
    category: 'investments',
    lastUpdated: '2025-03-03T16:00:00Z',
  },
  {
    id: 'fidelity-401k-7784',
    name: 'Fidelity 401(k)',
    accountNumber: '**** 7784',
    institutionName: 'Fidelity',
    balance: 205900.87,
    category: 'investments',
    lastUpdated: '2025-03-03T16:00:00Z',
  },
];

export const QAPITAL_INVEST_HOME_ROW_ID = 'qapital-invest-6620' as const;

export const MOCK_DEBT_ACCOUNTS: MockAccount[] = [
  {
    id: 'chase-sapphire-4242',
    name: 'Chase Sapphire Reserve',
    accountNumber: '**** 4242',
    institutionName: 'Chase',
    balance: 8420.63,
    category: 'debt',
    lastUpdated: '2025-03-04T07:30:00Z',
  },
];

const ALL_MOCK_ACCOUNTS: MockAccount[] = [
  ...MOCK_CASH_ACCOUNTS,
  ...MOCK_INVESTMENT_ACCOUNTS,
  ...MOCK_DEBT_ACCOUNTS,
];

/** Unique institutions × total mock accounts — for settings copy. */
export function getMockLinkedAccountSummary(): { banks: number; accounts: number } {
  const banks = new Set(ALL_MOCK_ACCOUNTS.map((a) => a.institutionName)).size;
  return { banks, accounts: ALL_MOCK_ACCOUNTS.length };
}

export function getMockAccountById(id: string): MockAccount | undefined {
  return ALL_MOCK_ACCOUNTS.find((a) => a.id === id);
}

export function getQapitalInvestBrokerageAccounts(): MockAccount[] {
  return MOCK_INVESTMENT_ACCOUNTS.filter(
    (account) =>
      account.institutionName === 'Qapital' &&
      account.category === 'investments' &&
      (account.brokerageHoldings?.length ?? 0) > 0
  );
}

export function getQapitalInvestTotalBalance(): number {
  return getQapitalInvestBrokerageAccounts().reduce((sum, account) => sum + account.balance, 0);
}

export function getBrokerageHoldingBySymbol(
  accountId: string,
  symbol: string
): BrokerageHolding | undefined {
  const account = getMockAccountById(accountId);
  const normalized = decodeURIComponent(symbol).trim().toUpperCase();
  return account?.brokerageHoldings?.find((h) => h.symbol.toUpperCase() === normalized);
}

export const HOME_QAPITAL_PRODUCT_ROWS: { id: string; label: string }[] = [
  { id: 'qapital-save-7754', label: 'Save' },
  { id: 'qapital-wallet-4401', label: 'Spend' },
  { id: QAPITAL_INVEST_HOME_ROW_ID, label: 'Invest' },
];

export function getMockNetWorth(): number {
  const cash = MOCK_CASH_ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  const investments = MOCK_INVESTMENT_ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  const debt = MOCK_DEBT_ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  return cash + investments - debt;
}

/**
 * Sum of brokerage holdings' quoted day P/L only. Not total net worth delta (omits cash, debt, other accounts).
 * Prefer `PHOENIX_NET_WORTH.dayChangeDollar` for household-level copy.
 */
export function getMockNetWorthDayChange(): number {
  return MOCK_INVESTMENT_ACCOUNTS.reduce(
    (accountSum, account) =>
      accountSum +
      (account.brokerageHoldings ?? []).reduce(
        (holdingSum, holding) => holdingSum + holding.dayChangeDollar,
        0
      ),
    0
  );
}

export function getMockInAppBalance(): number {
  return ALL_MOCK_ACCOUNTS.filter(
    (account) => account.institutionName === 'Qapital' && account.category !== 'debt'
  ).reduce((sum, account) => sum + account.balance, 0);
}

export function getMockCashTotal(): number {
  return MOCK_CASH_ACCOUNTS.reduce((s, a) => s + a.balance, 0);
}

export function getMockInvestmentTotal(): number {
  return MOCK_INVESTMENT_ACCOUNTS.reduce((s, a) => s + a.balance, 0);
}

/** Row shape for transfer pickers and account lists. */
export type LinkedAccountRow = {
  id: string;
  institutionName: string;
  name: string;
  mask: string;
  availableBalance: number;
};

/** Cash + investment accounts for transfers (excludes debt). */
export function getLinkedAccountsForTransfer(): LinkedAccountRow[] {
  return [...MOCK_CASH_ACCOUNTS, ...MOCK_INVESTMENT_ACCOUNTS].map((a) => ({
    id: a.id,
    institutionName: a.institutionName,
    name: a.name,
    mask: a.accountNumber.match(/\d{4}/)?.[0] ?? '0000',
    availableBalance: a.balance,
  }));
}
