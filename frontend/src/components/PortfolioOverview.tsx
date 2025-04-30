'use client';

import { useEffect, useState } from 'react'
import { useReadContract, useAccount, useChainId } from 'wagmi'
import { formatEther } from 'viem'
import { Card } from './ui/card'
import { useVaultContract } from '../hooks/useVaultContract'

interface Strategy {
  avsAddress: string
  allocation: bigint
  active: boolean
}

type PortfolioInfo = [bigint, Strategy[]]

const SWELL_TESTNET_CHAIN_ID = 1924

export function PortfolioOverview() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [mounted, setMounted] = useState(false)
  const vault = useVaultContract()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isCorrectNetwork = chainId === SWELL_TESTNET_CHAIN_ID

  const { data: portfolioInfo, isError, isLoading } = useReadContract({
    ...vault,
    functionName: 'getPortfolioInfo',
    args: [],
  }) as { data: PortfolioInfo | undefined, isError: boolean, isLoading: boolean }

  // Handle server-side rendering / hydration
  if (!mounted) {
    return (
      <Card className="p-6">
        <p>Loading...</p>
      </Card>
    )
  }

  // Handle wallet connection state
  if (!isConnected) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">Please connect your wallet to view portfolio information.</p>
      </Card>
    )
  }

  // Handle wrong network
  if (!isCorrectNetwork) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Please switch to Swell Testnet to view portfolio information.</p>
        <p className="text-sm text-gray-500 mt-2">Current network: {chainId === SWELL_TESTNET_CHAIN_ID ? 'Swell Testnet' : 'Wrong Network'}</p>
      </Card>
    )
  }

  // Get total value from portfolio info
  let totalValue = '0'
  if (portfolioInfo?.[0]) {
    totalValue = formatEther(portfolioInfo[0])
  }

  // Get strategies from portfolio info
  const strategies = portfolioInfo?.[1] ?? [] as Strategy[]

  if (isLoading) {
    return (
      <Card className="p-6">
        <p>Loading portfolio information...</p>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-red-500">Error loading portfolio information.</p>
          <p className="text-sm text-gray-500">Make sure you are connected to Swell Testnet and try again.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-3xl font-bold">{totalValue} ETH</p>
          </div>
          
          {strategies.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Strategy Allocations</p>
              {strategies.map((strategy: Strategy, index: number) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm">Strategy {index + 1}</span>
                  <span className="text-sm font-medium">
                    {(Number(strategy.allocation) / 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 