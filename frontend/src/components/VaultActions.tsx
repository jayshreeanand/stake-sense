import { useState } from 'react'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`

export function VaultActions() {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()

  const { write: deposit, data: depositData } = useContractWrite({
    address: VAULT_ADDRESS,
    abi: [{
      name: 'deposit',
      type: 'function',
      inputs: [],
      outputs: [],
      stateMutability: 'payable',
    }],
    functionName: 'deposit',
    value: amount ? parseEther(amount) : undefined,
  })

  const { write: withdraw, data: withdrawData } = useContractWrite({
    address: VAULT_ADDRESS,
    abi: [{
      name: 'withdraw',
      type: 'function',
      inputs: [{ name: 'amount', type: 'uint256' }],
      outputs: [],
    }],
    functionName: 'withdraw',
    args: amount ? [parseEther(amount)] : undefined,
  })

  const { isLoading: isDepositLoading } = useWaitForTransaction({
    hash: depositData?.hash,
  })

  const { isLoading: isWithdrawLoading } = useWaitForTransaction({
    hash: withdrawData?.hash,
  })

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vault Actions</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (ETH)
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full"
          />
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={() => deposit?.()}
            disabled={!amount || isDepositLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isDepositLoading ? 'Depositing...' : 'Deposit'}
          </Button>
          
          <Button
            onClick={() => withdraw?.()}
            disabled={!amount || isWithdrawLoading}
            variant="outline"
            className="flex-1"
          >
            {isWithdrawLoading ? 'Withdrawing...' : 'Withdraw'}
          </Button>
        </div>
      </div>
    </Card>
  )
} 