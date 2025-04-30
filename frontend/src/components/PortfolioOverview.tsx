'use client';

import { useAccount, useReadContract } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { useVaultContract } from '../hooks/useVaultContract'

interface UserInfo {
  totalDeposits: bigint
  lastUpdateTimestamp: bigint
}

interface Strategy {
  avsAddress: Address
  allocation: bigint
  active: boolean
}

export function PortfolioOverview() {
  const { address } = useAccount()
  const vault = useVaultContract()

  const { data: userInfo } = useReadContract<typeof vault.abi, 'userInfo', UserInfo>({
    ...vault,
    functionName: 'userInfo',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  const { data: strategy } = useReadContract<typeof vault.abi, 'strategies', Strategy>({
    ...vault,
    functionName: 'strategies',
    args: [0n],
  })

  const balance = userInfo ? formatEther(userInfo.totalDeposits) : '0'

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
            {strategy && (
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{strategy.avsAddress.slice(0, 6)}...{strategy.avsAddress.slice(-4)}</span>
                  <span>{Number(strategy.allocation) / 100}%</span>
                </div>
                <Progress value={Number(strategy.allocation) / 100} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
} 