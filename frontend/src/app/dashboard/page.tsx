'use client';

import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Contract reads
  const { data: portfolioInfo } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: [{
      name: 'getPortfolioInfo',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [
        { name: 'totalValue', type: 'uint256' },
        { name: 'currentStrategies', type: 'tuple[]', components: [
          { name: 'avsAddress', type: 'address' },
          { name: 'allocation', type: 'uint256' },
          { name: 'active', type: 'bool' }
        ]}
      ]
    }],
    functionName: 'getPortfolioInfo',
    enabled: isConnected,
  });

  // Contract writes
  const { write: deposit, data: depositData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: [{
      name: 'deposit',
      type: 'function',
      stateMutability: 'payable',
      inputs: [],
      outputs: []
    }],
    functionName: 'deposit',
  });

  const { write: withdraw, data: withdrawData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: [{
      name: 'withdraw',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'amount', type: 'uint256' }],
      outputs: []
    }],
    functionName: 'withdraw',
  });

  // Transaction status
  const { isLoading: isDepositLoading } = useWaitForTransaction({
    hash: depositData?.hash,
  });

  const { isLoading: isWithdrawLoading } = useWaitForTransaction({
    hash: withdrawData?.hash,
  });

  const handleDeposit = () => {
    if (!depositAmount) return;
    deposit({
      value: parseEther(depositAmount),
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    withdraw({
      args: [parseEther(withdrawAmount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
        <p className="text-gray-600">Connect your wallet to view your portfolio and manage your deposits.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-blue-600">
              {portfolioInfo ? `${Number(portfolioInfo[0]) / 1e18} ETH` : 'Loading...'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Active Strategies</h3>
            <p className="text-3xl font-bold text-blue-600">
              {portfolioInfo ? portfolioInfo[1].filter(s => s.active).length : 'Loading...'}
            </p>
          </div>
        </div>
      </section>

      {/* Deposit/Withdraw Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Deposit */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Deposit</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="0.0"
                min="0"
                step="0.01"
              />
            </div>
            <button
              onClick={handleDeposit}
              disabled={isDepositLoading || !depositAmount}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isDepositLoading ? 'Depositing...' : 'Deposit'}
            </button>
          </div>
        </section>

        {/* Withdraw */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Withdraw</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="0.0"
                min="0"
                step="0.01"
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawLoading || !withdrawAmount}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400"
            >
              {isWithdrawLoading ? 'Withdrawing...' : 'Withdraw'}
            </button>
          </div>
        </section>
      </div>

      {/* Strategy Allocations */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Strategy Allocations</h2>
        <div className="space-y-4">
          {portfolioInfo?.currentStrategies.map((strategy, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">AVS {index + 1}</p>
                <p className="text-sm text-gray-600">{strategy.avsAddress}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(Number(strategy.allocation) / 100).toFixed(2)}%</p>
                <p className="text-sm text-gray-600">{strategy.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 