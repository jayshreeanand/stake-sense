'use client';

import { createConfig, http } from 'wagmi';
import { type Chain } from 'viem';
import { WagmiProvider as Provider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const swellTestnet = {
  id: 1924,
  name: 'Swell Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
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
} as const satisfies Chain;

const config = createConfig({
  chains: [swellTestnet],
  transports: {
    [swellTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
} 