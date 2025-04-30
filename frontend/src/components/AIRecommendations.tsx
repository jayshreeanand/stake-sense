'use client';

import { useEffect, useState } from 'react';

export default function AIRecommendations() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulated API call to get recommendations
    setTimeout(() => {
      setRecommendations([
        'Consider increasing allocation to EigenLayer for higher potential returns',
        'StakeWise has shown consistent performance in the last month',
        'Market conditions suggest maintaining current strategy allocation'
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="min-w-4 h-4 mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600">{recommendation}</p>
        </div>
      ))}
    </div>
  );
} 