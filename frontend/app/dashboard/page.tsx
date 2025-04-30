'use client';

import { Card } from '@/components/ui/card';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { VaultActions } from '@/components/VaultActions';
import AIRecommendations from '@/components/AIRecommendations';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <PortfolioOverview />
        <div className="mt-6">
          <VaultActions />
        </div>
      </div>
      <div>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">AI Strategy Recommendations</h2>
          <AIRecommendations />
        </Card>
      </div>
    </div>
  );
} 