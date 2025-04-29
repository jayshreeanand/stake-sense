'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { WagmiConfig, createConfig, http } from 'wagmi'
import { Chain } from 'viem'

// Define Swellchain testnet
const swellTestnet = {
  id: 1924,
  name: 'Swellchain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://swell-testnet.alt.technology'],
    },
    public: {
      http: ['https://swell-testnet.alt.technology'],
    },
  },
  blockExplorers: {
    default: { name: 'Swellchain Explorer', url: 'https://explorer.swellnetwork.io' },
  },
} as const satisfies Chain

const config = createConfig({
  chains: [swellTestnet],
  transports: {
    [swellTestnet.id]: http(),
  },
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  )
} 