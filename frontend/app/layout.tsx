import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WagmiProvider } from '@/providers/WagmiProvider'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StakeSense',
  description: 'AI-powered staking portfolio management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto p-6">
              {children}
            </main>
          </div>
        </WagmiProvider>
      </body>
    </html>
  )
} 