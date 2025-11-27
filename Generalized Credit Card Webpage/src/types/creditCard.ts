export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  image: string;
  annualFee: string;
  rewardRate: string;
  signUpBonus: string;
  rating: number;
  highlights: string[];
  applyLink: string;
}

export interface PageConfig {
  title: string;
  subtitle?: string;
  description?: string;
  cards: CreditCard[];
}
