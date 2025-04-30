'use client';

import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { useVaultContract } from '../hooks/useVaultContract'

export function PortfolioOverview() {
  const { address } = useAccount()
  const vault = useVaultContract()

  const { data: userInfo } = useReadContract({
    ...vault,
    functionName: 'userInfo',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  const { data: strategy } = useReadContract({
    ...vault,
    functionName: 'strategies',
    args: [BigInt(0)],
  })

  // Safely handle userInfo data
  const balance = userInfo && Array.isArray(userInfo) && userInfo[0] 
    ? formatEther(userInfo[0]) 
    : '0'

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-3xl font-bold">{balance} ETH</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Strategy Allocations</p>
            {strategy && Array.isArray(strategy) && strategy[0] && (
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{strategy[0].toString().slice(0, 6)}...{strategy[0].toString().slice(-4)}</span>
                  <span>{Number(strategy[1] || BigInt(0)) / 100}%</span>
                </div>
                <Progress value={Number(strategy[1] || BigInt(0)) / 100} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 