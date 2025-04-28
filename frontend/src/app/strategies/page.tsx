'use client';

import { useAccount } from 'wagmi';

export default function Strategies() {
  const { isConnected } = useAccount();

  // Mock data for AVS performance metrics
  const avsMetrics = [
    {
      name: 'AVS 1',
      address: '0x1234...5678',
      totalStaked: '1,000 ETH',
      activeValidators: 100,
      uptime: '99.9%',
      slashingEvents: 0,
      apy: '5.2%',
      riskScore: 'Low',
    },
    {
      name: 'AVS 2',
      address: '0x8765...4321',
      totalStaked: '2,500 ETH',
      activeValidators: 250,
      uptime: '99.5%',
      slashingEvents: 1,
      apy: '6.8%',
      riskScore: 'Medium',
    },
    {
      name: 'AVS 3',
      address: '0xabcd...efgh',
      totalStaked: '1,800 ETH',
      activeValidators: 180,
      uptime: '99.7%',
      slashingEvents: 0,
      apy: '5.9%',
      riskScore: 'Low',
    },
  ];

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
        <p className="text-gray-600">Connect your wallet to view strategy information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">AVS Strategies</h1>
        <p className="text-gray-600">
          Detailed information about each Actively Validated Service (AVS) and their performance metrics.
        </p>
      </div>

      {/* Strategy Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avsMetrics.map((avs, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{avs.name}</h3>
                <p className="text-sm text-gray-600">{avs.address}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                avs.riskScore === 'Low' ? 'bg-green-100 text-green-800' :
                avs.riskScore === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {avs.riskScore} Risk
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Staked</p>
                  <p className="font-semibold">{avs.totalStaked}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Validators</p>
                  <p className="font-semibold">{avs.activeValidators}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="font-semibold">{avs.uptime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Slashing Events</p>
                  <p className="font-semibold">{avs.slashingEvents}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Current APY</p>
                  <p className="text-lg font-bold text-blue-600">{avs.apy}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Charts */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Historical Performance</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Performance charts will be displayed here</p>
        </div>
      </section>

      {/* Risk Analysis */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Risk Analysis</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Risk Factors</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Validator reliability and uptime</li>
              <li>Historical slashing events</li>
              <li>Total value locked (TVL)</li>
              <li>Network participation</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Risk Mitigation</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Diversification across multiple AVSs</li>
              <li>Continuous monitoring of validator performance</li>
              <li>Automated rebalancing based on risk metrics</li>
              <li>Emergency withdrawal capabilities</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 