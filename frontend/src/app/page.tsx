import { PortfolioOverview } from '@/components/PortfolioOverview'
import { VaultActions } from '@/components/VaultActions'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PortfolioOverview />
          <VaultActions />
        </div>
      </div>
    </main>
  )
}
