import { Sparkles, ArrowRight, Zap } from "lucide-react";

export function UpgradeBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]" />
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm">
              Premium Feature
            </span>
          </div>
          <h3 className="text-white mb-2">Upgrade to Optimized Portfolio</h3>
          <p className="text-white/90 mb-2">
            Get AI-powered recommendations to maximize your rewards and minimize fees
          </p>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Smart optimization</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Save up to $500/year</span>
            </div>
          </div>
        </div>
        
        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2 group whitespace-nowrap shadow-lg">
          <span>Upgrade Now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
