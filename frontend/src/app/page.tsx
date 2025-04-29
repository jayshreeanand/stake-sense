import { WalletConnect } from '@/components/WalletConnect'
import { PortfolioOverview } from '@/components/PortfolioOverview'
import { VaultActions } from '@/components/VaultActions'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">StakeSense</h1>
          <WalletConnect />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PortfolioOverview />
          <VaultActions />
        </div>
      </div>
    </main>
  )
}
