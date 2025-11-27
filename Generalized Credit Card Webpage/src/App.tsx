import { useState } from 'react';
import { CreditCardPage } from './components/CreditCardPage';
import { pageConfigs } from './data/mockCardData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'best2025' | 'airline' | 'all'>('best2025');

  return (
    <div>
      {/* Demo Navigation - Remove this in production */}
      <div className="bg-gray-900 text-white py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Demo Navigation:</span>
            <button
              onClick={() => setCurrentPage('best2025')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'best2025'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Best Cards 2025
            </button>
            <button
              onClick={() => setCurrentPage('airline')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'airline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Airline Cards
            </button>
            <button
              onClick={() => setCurrentPage('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Cards
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <CreditCardPage config={pageConfigs[currentPage]} />
    </div>
  );
}
