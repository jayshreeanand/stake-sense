import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardBody } from '@/components/ui';

const AIRecommendations = dynamic(() => import('@/components/AIRecommendations'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

const VaultActions = dynamic(() => import('@/components/VaultActions'), {
  ssr: false,
});

const PortfolioOverview = dynamic(() => import('@/components/PortfolioOverview'), {
  ssr: false,
});

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Portfolio Overview Section */}
      <section>
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-2">
            Track your staking portfolio performance and metrics
          </p>
        </div>
        <PortfolioOverview />
      </section>

      {/* Vault Actions Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Vault Actions</h2>
          <p className="text-muted-foreground mt-2">
            Manage your deposits and withdrawals
          </p>
        </div>
        <Card>
          <CardBody>
            <VaultActions />
          </CardBody>
        </Card>
      </section>

      {/* AI Recommendations Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">AI Strategy Recommendations</h2>
          <p className="text-muted-foreground mt-2">
            Get AI-powered insights and recommendations for your staking portfolio
          </p>
        </div>
        <AIRecommendations />
      </section>
    </div>
  );
} 