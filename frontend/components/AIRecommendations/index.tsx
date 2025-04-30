'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
} from '../ui';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

interface RiskMetrics {
  operational_risk: number;
  technical_risk: number;
  financial_risk: number;
  network_risk: number;
  composite_score: number;
}

interface AVSAllocation {
  avs_name: string;
  allocation: number;
  risk_metrics: RiskMetrics;
}

interface HistoricalPerformance {
  returns: number[];
  volatility: number[];
  sharpe_ratio: number[];
  max_drawdown: number[];
}

// Mock data for development
const mockData = {
  allocations: [
    {
      avs_name: "EigenLayer",
      allocation: 40,
      risk_metrics: {
        operational_risk: 0.2,
        technical_risk: 0.15,
        financial_risk: 0.25,
        network_risk: 0.18,
        composite_score: 0.8
      }
    },
    {
      avs_name: "StakeWise",
      allocation: 30,
      risk_metrics: {
        operational_risk: 0.25,
        technical_risk: 0.2,
        financial_risk: 0.3,
        network_risk: 0.22,
        composite_score: 0.75
      }
    },
    {
      avs_name: "Lido",
      allocation: 30,
      risk_metrics: {
        operational_risk: 0.18,
        technical_risk: 0.22,
        financial_risk: 0.28,
        network_risk: 0.2,
        composite_score: 0.78
      }
    }
  ],
  historical_performance: {
    returns: [0.05, 0.08, 0.12, 0.15, 0.18, 0.22, 0.25],
    volatility: [0.02, 0.03, 0.04, 0.03, 0.05, 0.04, 0.03],
    sharpe_ratio: [2.5, 2.7, 3.0, 5.0, 3.6, 5.5, 8.3],
    max_drawdown: [-0.02, -0.03, -0.02, -0.04, -0.03, -0.02, -0.01]
  }
};

const AIRecommendations: React.FC = () => {
  const [allocations, setAllocations] = useState<AVSAllocation[]>([]);
  const [historicalPerformance, setHistoricalPerformance] = useState<HistoricalPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllocations(mockData.allocations);
      setHistoricalPerformance(mockData.historical_performance);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderAllocationChart = () => {
    const data = allocations.map(item => ({
      name: item.avs_name,
      value: item.allocation,
    }));

    return (
      <Card className="w-full h-96">
        <CardHeader>
          <h3 className="text-lg font-semibold">Recommended Allocations</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height="100%">
            <Doughnut
              data={{
                labels: data.map(item => item.name),
                datasets: [
                  {
                    data: data.map(item => item.value),
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </ResponsiveContainer>
        </CardBody>
      </Card>
    );
  };

  const renderRiskMetrics = () => {
    return (
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Risk Analysis</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allocations.map(avs => (
              <div key={avs.avs_name} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{avs.avs_name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Operational Risk:</span>
                    <Badge
                      variant={getRiskVariant(avs.risk_metrics.operational_risk)}
                    >
                      {(avs.risk_metrics.operational_risk * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical Risk:</span>
                    <Badge
                      variant={getRiskVariant(avs.risk_metrics.technical_risk)}
                    >
                      {(avs.risk_metrics.technical_risk * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Risk:</span>
                    <Badge
                      variant={getRiskVariant(avs.risk_metrics.financial_risk)}
                    >
                      {(avs.risk_metrics.financial_risk * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Risk:</span>
                    <Badge
                      variant={getRiskVariant(avs.risk_metrics.network_risk)}
                    >
                      {(avs.risk_metrics.network_risk * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Composite Score:</span>
                    <Badge
                      variant={getScoreVariant(avs.risk_metrics.composite_score)}
                    >
                      {(avs.risk_metrics.composite_score * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  };

  const renderPerformanceChart = () => {
    if (!historicalPerformance) return null;

    const data = historicalPerformance.returns.map((value, index) => ({
      name: `Day ${index + 1}`,
      return: value,
      volatility: historicalPerformance.volatility[index],
      sharpe: historicalPerformance.sharpe_ratio[index],
    }));

    return (
      <Card className="w-full h-96">
        <CardHeader>
          <h3 className="text-lg font-semibold">Historical Performance</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="return"
                stroke="#8884d8"
                name="Returns"
              />
              <Line
                type="monotone"
                dataKey="volatility"
                stroke="#82ca9d"
                name="Volatility"
              />
              <Line
                type="monotone"
                dataKey="sharpe"
                stroke="#ffc658"
                name="Sharpe Ratio"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    );
  };

  const getRiskVariant = (risk: number): 'default' | 'destructive' | 'success' => {
    if (risk >= 0.7) return 'destructive';
    if (risk <= 0.3) return 'success';
    return 'default';
  };

  const getScoreVariant = (score: number): 'default' | 'destructive' | 'success' => {
    if (score >= 0.7) return 'success';
    if (score <= 0.3) return 'destructive';
    return 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Strategy Recommendations</h2>
        <Button onClick={fetchRecommendations}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderAllocationChart()}
        {renderPerformanceChart()}
      </div>

      {renderRiskMetrics()}
    </div>
  );
};

export default AIRecommendations; 