import React from 'react';
import AIRecommendations from '@/components/AIRecommendations';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">StakeSense Dashboard</h1>
        <p className="text-gray-600 mt-2">
          AI-powered insights and recommendations for your staking portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AIRecommendations />
        </div>
      </div>
    </div>
  );
} 