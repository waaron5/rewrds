import { CreditCard, MoreVertical } from "lucide-react";

interface CardItemProps {
  card: {
    id: string;
    name: string;
    issuer: string;
    lastFour: string;
    rewards: string;
    annualFee: string;
    color: string;
  };
}

export function CardItem({ card }: CardItemProps) {
  return (
    <div className="group relative">
      {/* Card Visual */}
      <div
        className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer`}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-white/80 text-sm mb-1">{card.issuer}</p>
            <h3 className="text-white">{card.name}</h3>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-white/70 text-sm mb-1">Card Number</p>
            <p className="text-white tracking-wider">•••• •••• •••• {card.lastFour}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard className="w-10 h-10 text-white/80" />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600 text-sm">Rewards</span>
          <span className="text-slate-900">{card.rewards}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600 text-sm">Annual Fee</span>
          <span className="text-slate-900">{card.annualFee}</span>
        </div>
      </div>
    </div>
  );
}
