import { CreditCard, PageConfig } from '../types/creditCard';

// Sample credit cards for "Best Cards in 2025"
const bestCards2025: CreditCard[] = [
  {
    id: '1',
    name: 'Platinum Rewards Card',
    issuer: 'Chase',
    image: 'https://images.unsplash.com/photo-1556741533-e228ee50f8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3JlZGl0JTIwY2FyZHxlbnwxfHx8fDE3NjQxNDk0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$95',
    rewardRate: '3X points on travel and dining',
    signUpBonus: '60,000 points after $4,000 spend in 3 months',
    rating: 4.8,
    highlights: [
      'No foreign transaction fees',
      'Travel insurance included',
      'Airport lounge access'
    ],
    applyLink: '#'
  },
  {
    id: '2',
    name: 'Freedom Unlimited',
    issuer: 'Chase',
    image: 'https://images.unsplash.com/photo-1703589535932-52d08169014f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVkaXQlMjBjYXJkJTIwbW9kZXJufGVufDF8fHx8MTc2NDEyMDAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$0',
    rewardRate: '1.5% cash back on all purchases',
    signUpBonus: '$200 after $500 spend in 3 months',
    rating: 4.6,
    highlights: [
      'No annual fee',
      'Unlimited cash back',
      'Intro 0% APR for 15 months'
    ],
    applyLink: '#'
  },
  {
    id: '3',
    name: 'Gold Preferred Card',
    issuer: 'American Express',
    image: 'https://images.unsplash.com/photo-1641939872097-8626e3134d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBjcmVkaXQlMjBjYXJkfGVufDF8fHx8MTc2NDIwMzk4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$250',
    rewardRate: '4X points at restaurants and supermarkets',
    signUpBonus: '75,000 points after $6,000 spend in 6 months',
    rating: 4.7,
    highlights: [
      'Annual dining credit',
      'Premium customer service',
      'Purchase protection'
    ],
    applyLink: '#'
  }
];

// Sample credit cards for "Airline Credit Cards"
const airlineCards: CreditCard[] = [
  {
    id: '4',
    name: 'SkyMiles Platinum Card',
    issuer: 'Delta Airlines',
    image: 'https://images.unsplash.com/photo-1641939872097-8626e3134d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBjcmVkaXQlMjBjYXJkfGVufDF8fHx8MTc2NDIwMzk4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$99',
    rewardRate: '2X miles on Delta purchases',
    signUpBonus: '40,000 miles after $2,000 spend in 3 months',
    rating: 4.5,
    highlights: [
      'Free checked bag on Delta flights',
      'Priority boarding',
      'Companion certificate annually'
    ],
    applyLink: '#'
  },
  {
    id: '5',
    name: 'AAdvantage Executive Card',
    issuer: 'American Airlines',
    image: 'https://images.unsplash.com/photo-1556741533-e228ee50f8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY3JlZGl0JTIwY2FyZHxlbnwxfHx8fDE3NjQxNDk0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$450',
    rewardRate: '4X miles on American Airlines purchases',
    signUpBonus: '70,000 miles after $5,000 spend in 3 months',
    rating: 4.6,
    highlights: [
      'Admirals Club membership',
      'Free checked bags',
      'Priority check-in and boarding'
    ],
    applyLink: '#'
  },
  {
    id: '6',
    name: 'United Quest Card',
    issuer: 'United Airlines',
    image: 'https://images.unsplash.com/photo-1703589535932-52d08169014f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVkaXQlMjBjYXJkJTIwbW9kZXJufGVufDF8fHx8MTc2NDEyMDAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$95',
    rewardRate: '3X miles on United purchases',
    signUpBonus: '60,000 miles after $3,000 spend in 3 months',
    rating: 4.4,
    highlights: [
      'Annual United flight credit',
      'Free checked bag',
      'Priority boarding'
    ],
    applyLink: '#'
  }
];

// Sample credit cards for "All Credit Cards"
const allCreditCards: CreditCard[] = [
  ...bestCards2025,
  ...airlineCards,
  {
    id: '7',
    name: 'Business Edge Card',
    issuer: 'Capital One',
    image: 'https://images.unsplash.com/photo-1585915473635-d4e5c564eec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNyZWRpdCUyMGNhcmR8ZW58MXx8fHwxNzY0MjAzOTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    annualFee: '$0',
    rewardRate: '2% cash back on all business purchases',
    signUpBonus: '$500 after $5,000 spend in 3 months',
    rating: 4.5,
    highlights: [
      'No annual fee',
      'Employee cards at no cost',
      'Expense tracking tools'
    ],
    applyLink: '#'
  }
];

// Page configurations
export const pageConfigs: Record<string, PageConfig> = {
  best2025: {
    title: 'Best Credit Cards of 2025',
    subtitle: 'Top-rated cards chosen by experts',
    description: 'Discover the best credit cards of 2025, carefully selected based on rewards, benefits, and overall value. Compare features and find the perfect card for your lifestyle.',
    cards: bestCards2025
  },
  airline: {
    title: 'Airline Credit Cards',
    subtitle: 'Earn miles and enjoy travel perks',
    description: 'Compare the best airline credit cards offering miles, free checked bags, priority boarding, and exclusive lounge access. Perfect for frequent flyers.',
    cards: airlineCards
  },
  all: {
    title: 'All Credit Cards',
    subtitle: 'Browse our complete collection',
    description: 'Explore our entire selection of credit cards across all categories. Filter and compare to find the right card for your needs.',
    cards: allCreditCards
  }
};
