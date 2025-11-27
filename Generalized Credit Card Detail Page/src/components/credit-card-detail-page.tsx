import { 
  CreditCard, 
  Shield, 
  Plane, 
  Gift, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Award
} from "lucide-react";

interface CardHighlight {
  label: string;
  value: string;
  subtext: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface EarnRate {
  category: string;
  rate: string;
}

interface FeeItem {
  item: string;
  amount: string;
}

interface CardData {
  id: string;
  name: string;
  issuer: string;
  image: string;
  tagline: string;
  annualFee: number;
  aprRange: string;
  creditScoreNeeded: string;
  highlights: CardHighlight[];
  benefits: Benefit[];
  rewardsDetails: {
    earnRate: EarnRate[];
    redemption: string;
  };
  feesAndRates: FeeItem[];
  requirements: string[];
}

interface CreditCardDetailPageProps {
  cardData: CardData;
}

export function CreditCardDetailPage({ cardData }: CreditCardDetailPageProps) {
  const handleApplyNow = () => {
    console.log(`Applying for card: ${cardData.id}`);
    // In a real app, this would navigate to application page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Card Info */}
            <div>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-4">
                {cardData.issuer}
              </div>
              <h1 className="mb-4">{cardData.name}</h1>
              <p className="text-blue-100 mb-8 text-xl">
                {cardData.tagline}
              </p>
              
              {/* Key Highlights */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {cardData.highlights.map((highlight, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-blue-200 mb-1">{highlight.label}</div>
                    <div className="text-2xl mb-1">{highlight.value}</div>
                    <div className="text-xs text-blue-200">{highlight.subtext}</div>
                  </div>
                ))}
              </div>
              
              {/* Primary CTA */}
              <button
                onClick={handleApplyNow}
                className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-3 text-sm text-blue-200">
                Quick application • Decision in minutes
              </p>
            </div>
            
            {/* Right: Card Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
                <img
                  src={cardData.image}
                  alt={cardData.name}
                  className="relative w-full max-w-md rounded-2xl shadow-2xl transform hover:rotate-2 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Sticky Apply Button */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Benefits Section */}
            <section className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h2>Card Benefits</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cardData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="mb-1">{benefit.title}</div>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Rewards Details */}
            <section className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h2>How You Earn Rewards</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {cardData.rewardsDetails.earnRate.map((rate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg">
                    <span className="text-gray-700">{rate.category}</span>
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                      {rate.rate}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div className="flex gap-2">
                  <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="mb-1 text-blue-900">Redemption Options</div>
                    <p className="text-sm text-blue-700">{cardData.rewardsDetails.redemption}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Fees and Rates */}
            <section className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h2>Fees & Interest Rates</h2>
              </div>
              <div className="space-y-3">
                {cardData.feesAndRates.map((fee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <span className="text-gray-700">{fee.item}</span>
                    <span>{fee.amount}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h2>Eligibility Requirements</h2>
              </div>
              <ul className="space-y-3">
                {cardData.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Credit Score Needed:</strong> {cardData.creditScoreNeeded}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar - Sticky Apply Box */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="mb-2">Ready to Apply?</h3>
                <p className="text-sm text-blue-200">
                  Get started in just a few minutes
                </p>
              </div>
              
              <button
                onClick={handleApplyNow}
                className="w-full group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 mb-4"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Won't affect credit score</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Instant decision</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Secure application</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <div className="text-3xl mb-1">★★★★★</div>
                <p className="text-xs text-blue-200">Rated 4.8/5 by cardholders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-gray-900 mb-4">Don't Miss Out on This Offer</h2>
          <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
            Limited time welcome bonus. Apply today and start earning rewards on every purchase.
          </p>
          <button
            onClick={handleApplyNow}
            className="group bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Apply for {cardData.name}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-500 max-w-4xl mx-auto">
          <p>
            Terms and conditions apply. Rewards and benefits are subject to credit approval. 
            APR, fees, and other terms are accurate as of the date shown and are subject to change. 
            Please review the full terms and conditions before applying.
          </p>
        </div>
      </div>
    </div>
  );
}
