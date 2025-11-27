import { TrendingUp, Gift, ArrowRight } from "lucide-react";

interface RecommendationCardProps {
  card: {
    id: string;
    name: string;
    issuer: string;
    rewards: string;
    annualFee: string;
    bonus: string;
    matchScore: number;
    reason: string;
  };
}

export function RecommendationCard({ card }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      {/* Match Score Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {card.matchScore}% Match
        </span>
        <span className="text-slate-500 text-sm">{card.issuer}</span>
      </div>

      {/* Card Name */}
      <h3 className="text-slate-900 mb-2">{card.name}</h3>
      
      {/* Reason */}
      <p className="text-slate-600 text-sm mb-4">{card.reason}</p>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <Gift className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-900">Sign-up Bonus</p>
            <p className="text-slate-600 text-sm">{card.bonus}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
          <div>
            <p className="text-slate-600 text-sm">Rewards</p>
            <p className="text-slate-900 text-sm">{card.rewards}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm">Annual Fee</p>
            <p className="text-slate-900 text-sm">{card.annualFee}</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group">
        <span>Learn More</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
