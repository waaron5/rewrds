import { CreditCardDetailPage } from "./components/credit-card-detail-page";

// This would typically come from URL parameters or a routing solution
// Example: /card-details?id=premium-rewards
const mockCardData = {
  id: "premium-rewards",
  name: "Premium Rewards Card",
  issuer: "Global Bank",
  image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  tagline: "Earn more on every purchase",
  annualFee: 95,
  aprRange: "18.99% - 25.99%",
  creditScoreNeeded: "Good to Excellent (670-850)",
  
  highlights: [
    { label: "Welcome Bonus", value: "50,000 points", subtext: "after spending $3,000 in first 3 months" },
    { label: "Rewards Rate", value: "3X points", subtext: "on dining and travel purchases" },
    { label: "Annual Fee", value: "$95", subtext: "waived first year" },
  ],
  
  benefits: [
    { title: "Travel Insurance", description: "Comprehensive travel accident and trip cancellation insurance" },
    { title: "No Foreign Transaction Fees", description: "Use your card abroad without extra charges" },
    { title: "Purchase Protection", description: "Coverage for damaged or stolen new purchases" },
    { title: "Extended Warranty", description: "Automatically extends manufacturer's warranty by 1 year" },
    { title: "24/7 Concierge Service", description: "Personal assistance for travel, dining, and entertainment" },
    { title: "Airport Lounge Access", description: "Complimentary access to 1,000+ airport lounges worldwide" },
  ],
  
  rewardsDetails: {
    earnRate: [
      { category: "Dining & Travel", rate: "3X points per $1" },
      { category: "Gas & Groceries", rate: "2X points per $1" },
      { category: "All Other Purchases", rate: "1X point per $1" },
    ],
    redemption: "Points can be redeemed for travel, cash back, gift cards, or merchandise",
  },
  
  feesAndRates: [
    { item: "Annual Fee", amount: "$95 (waived first year)" },
    { item: "APR", amount: "18.99% - 25.99% variable" },
    { item: "Balance Transfer APR", amount: "18.99% - 25.99% variable" },
    { item: "Cash Advance APR", amount: "29.99% variable" },
    { item: "Late Payment Fee", amount: "Up to $40" },
    { item: "Foreign Transaction Fee", amount: "$0" },
  ],
  
  requirements: [
    "Good to Excellent credit score (670+)",
    "Must be at least 18 years old",
    "Valid U.S. address",
    "Verifiable income source",
  ],
};

export default function App() {
  return <CreditCardDetailPage cardData={mockCardData} />;
}
