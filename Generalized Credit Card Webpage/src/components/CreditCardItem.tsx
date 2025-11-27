import { Info } from 'lucide-react';
import { CreditCard } from '../types/creditCard';

interface CreditCardItemProps {
  card: CreditCard;
}

export function CreditCardItem({ card }: CreditCardItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 flex items-start gap-6">
        {/* Card Image and Name - Left Side Vertical Stack */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 w-52">
          <div className="w-32 aspect-[1.586/1] bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
            <div className="relative z-10 text-white/80 text-center px-2">
              <div className="mb-1">
                <div className="w-8 h-5 bg-yellow-400/80 rounded mx-auto"></div>
              </div>
              <p className="text-xs opacity-70">{card.issuer}</p>
            </div>
          </div>
          <div className="text-center w-full">
            <h3 className="text-gray-900">{card.name}</h3>
          </div>
        </div>

        {/* Annual Fee Column */}
        <div className="flex-shrink-0 w-28">
          <p className="text-gray-600 mb-1">Annual Fee</p>
          <p className="text-gray-900">{card.annualFee}</p>
        </div>

        {/* Rewards Column */}
        <div className="flex-1 min-w-[160px]">
          <div className="flex items-center gap-1 mb-1">
            <Info className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600">Rewards</p>
          </div>
          <p className="text-gray-900">{card.rewardRate}</p>
        </div>

        {/* Bonus Column */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-1 mb-1">
            <Info className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600">Bonus</p>
          </div>
          <p className="text-gray-900">{card.signUpBonus}</p>
        </div>

        {/* Apply Button - Right Side */}
        <div className="flex-shrink-0 ml-auto flex flex-col items-center gap-1 self-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            Apply Now
          </button>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Rates & Fees
          </a>
        </div>
      </div>
    </div>
  );
}