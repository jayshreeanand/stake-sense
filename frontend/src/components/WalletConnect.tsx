'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from './ui/button'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: injected()
  })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <Button onClick={() => disconnect()}>
        Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={() => connect()}>
      Connect Wallet
    </Button>
  )
} 