import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { Button } from './ui/button'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="text-sm"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => connect()}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Connect Wallet
    </Button>
  )
} 