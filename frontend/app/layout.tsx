import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StakeSense - AI-Powered Staking Portfolio Manager',
  description: 'Optimize your staking portfolio with AI-driven insights and recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
} 