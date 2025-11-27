import { PageConfig } from '../types/creditCard';
import { CreditCardItem } from './CreditCardItem';

interface CreditCardPageProps {
  config: PageConfig;
}

export function CreditCardPage({ config }: CreditCardPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-gray-900 mb-2">{config.title}</h1>
          {config.subtitle && (
            <p className="text-gray-600">{config.subtitle}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {config.description && (
          <div className="mb-8">
            <p className="text-gray-700 max-w-3xl">{config.description}</p>
          </div>
        )}

        {/* Card Grid */}
        <div className="space-y-4">
          {config.cards.map((card) => (
            <CreditCardItem key={card.id} card={card} />
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-8 text-center text-gray-600">
          Showing {config.cards.length} {config.cards.length === 1 ? 'card' : 'cards'}
        </div>
      </main>
    </div>
  );
}