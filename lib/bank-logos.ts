import type { ImageSourcePropType } from 'react-native';

const BANK_LOGOS: { matchers: string[]; source: ImageSourcePropType }[] = [
  { matchers: ['chase'], source: require('../assets/banks/chase.jpg') },
  {
    matchers: ['bankofamerica', 'bofa'],
    source: require('../assets/banks/bank-of-america.jpg'),
  },
  { matchers: ['wellsfargo', 'wells'], source: require('../assets/banks/wells-fargo.jpg') },
  { matchers: ['citibank', 'citi'], source: require('../assets/banks/citibank.jpg') },
  { matchers: ['capitalone', 'capital'], source: require('../assets/banks/capitalone.jpg') },
  { matchers: ['ally'], source: require('../assets/banks/ally.jpg') },
  { matchers: ['barclays'], source: require('../assets/banks/barclays.jpg') },
  { matchers: ['americanexpress', 'amex'], source: require('../assets/banks/amex.jpg') },
  { matchers: ['visa'], source: require('../assets/banks/visa.jpg') },
  { matchers: ['mastercard'], source: require('../assets/banks/mastercard.jpg') },
  { matchers: ['qapital'], source: require('../assets/banks/qapital.jpg') },
  { matchers: ['etrade'], source: require('../assets/banks/etrade.png') },
  { matchers: ['robinhood'], source: require('../assets/banks/robinhood.png') },
  { matchers: ['vanguard'], source: require('../assets/banks/vanguard.png') },
  { matchers: ['fidelity'], source: require('../assets/banks/fidelity.png') },
  { matchers: ['schwab', 'charlesschwab'], source: require('../assets/banks/schwab.png') },
  { matchers: ['betterment'], source: require('../assets/banks/betterment.png') },
  { matchers: ['interactivebrokers'], source: require('../assets/banks/interactive-brokers.png') },
  { matchers: ['m1'], source: require('../assets/banks/m1.png') },
  { matchers: ['sofi'], source: require('../assets/banks/sofi.png') },
  { matchers: ['tdameritrade', 'ameritrade'], source: require('../assets/banks/td-ameritrade.png') },
  { matchers: ['wealthfront'], source: require('../assets/banks/wealthfront.png') },
];

export function getBankLogoSource(institutionName: string): ImageSourcePropType | undefined {
  const normalized = institutionName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = BANK_LOGOS.find((bank) =>
    bank.matchers.some((matcher) => normalized.includes(matcher))
  );
  return match?.source;
}
