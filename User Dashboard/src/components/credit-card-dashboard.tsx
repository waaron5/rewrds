import { CreditCard, TrendingUp, Star, Award, ArrowRight, Sparkles } from "lucide-react";
import { CardItem } from "./card-item";
import { RecommendationCard } from "./recommendation-card";
import { UpgradeBanner } from "./upgrade-banner";

// Mock data for user's current cards
const userCards = [
  {
    id: "1",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    lastFour: "4532",
    rewards: "2x on travel & dining",
    annualFee: "$95",
    color: "from-blue-600 to-blue-800",
  },
  {
    id: "2",
    name: "American Express Gold",
    issuer: "Amex",
    lastFour: "1003",
    rewards: "4x on dining & groceries",
    annualFee: "$250",
    color: "from-yellow-600 to-yellow-800",
  },
];

// Mock data for recommended cards
const recommendations = [
  {
    id: "1",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    rewards: "3x on travel & dining",
    annualFee: "$550",
    bonus: "60,000 points",
    matchScore: 95,
    reason: "Upgrade from your Sapphire Preferred for better rewards",
  },
  {
    id: "2",
    name: "Capital One Venture X",
    issuer: "Capital One",
    rewards: "2x on everything, 5x on flights",
    annualFee: "$395",
    bonus: "75,000 miles",
    matchScore: 88,
    reason: "Great for your travel spending patterns",
  },
  {
    id: "3",
    name: "Citi Premier Card",
    issuer: "Citi",
    rewards: "3x on dining, gas & travel",
    annualFee: "$95",
    bonus: "80,000 points",
    matchScore: 82,
    reason: "Excellent value for your spending categories",
  },
];

export function CreditCardDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Card Dashboard</h1>
                <p className="text-slate-600 text-sm">Manage your credit card portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Award className="w-5 h-5 text-slate-600" />
              <span className="text-slate-700">Credit Score: 750</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upgrade Banner */}
        <UpgradeBanner />

        {/* My Cards Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-6 h-6 text-slate-700" />
            <h2 className="text-slate-900">My Cards</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {userCards.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-slate-700" />
            <h2 className="text-slate-900">Recommended For You</h2>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((card) => (
              <RecommendationCard key={card.id} card={card} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
