'use client';

import { useAccount, useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { Card } from './ui/card'
import { Progress } from './ui/progress'

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`

export function PortfolioOverview() {
  const { address } = useAccount()

  const { data: userInfo } = useContractRead({
    address: VAULT_ADDRESS,
    abi: [{
      name: 'userInfo',
      type: 'function',
      inputs: [{ name: 'user', type: 'address' }],
      outputs: [
        { name: 'totalDeposits', type: 'uint256' },
        { name: 'lastDepositTime', type: 'uint256' }
      ],
    }],
    functionName: 'userInfo',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: strategies } = useContractRead({
    address: VAULT_ADDRESS,
    abi: [{
      name: 'getStrategies',
      type: 'function',
      inputs: [],
      outputs: [{
        name: 'strategies',
        type: 'tuple[]',
        components: [
          { name: 'avsAddress', type: 'address' },
          { name: 'allocation', type: 'uint256' },
          { name: 'active', type: 'bool' }
        ]
      }],
    }],
    functionName: 'getStrategies',
  })

  const balance = userInfo ? formatEther(userInfo[0]) : '0'

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
            {strategies?.map((strategy, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{strategy.avsAddress.slice(0, 6)}...{strategy.avsAddress.slice(-4)}</span>
                  <span>{strategy.allocation / 100}%</span>
                </div>
                <Progress value={strategy.allocation / 100} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
} 