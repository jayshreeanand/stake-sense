'use client';

import { PortfolioOverview } from '@/components/PortfolioOverview'
import { VaultActions } from '@/components/VaultActions'
import { useAccount } from 'wagmi'

export default function AppPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to view your portfolio and manage your deposits.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PortfolioOverview />
      <VaultActions />
    </div>
  )
} 