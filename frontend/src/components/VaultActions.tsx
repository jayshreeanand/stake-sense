'use client';

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`

const vaultABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: []
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: []
  }
] as const

export function VaultActions() {
  const [amount, setAmount] = useState('')
  const { isConnected } = useAccount()
  const { writeContract, data: txData } = useWriteContract()

  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({
    hash: txData
  })

  const handleDeposit = async () => {
    if (!amount) return
    
    try {
      await writeContract({
        address: VAULT_ADDRESS,
        abi: vaultABI,
        functionName: 'deposit',
        value: parseEther(amount)
      })
    } catch (error) {
      console.error('Deposit failed:', error)
    }
  }

  const handleWithdraw = async () => {
    if (!amount) return
    
    try {
      await writeContract({
        address: VAULT_ADDRESS,
        abi: vaultABI,
        functionName: 'withdraw',
        args: [parseEther(amount)]
      })
    } catch (error) {
      console.error('Withdrawal failed:', error)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Please connect your wallet to interact with the vault.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (ETH)
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="mt-1"
          />
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={handleDeposit}
            disabled={!amount || isTransactionLoading}
            className="flex-1"
          >
            {isTransactionLoading ? 'Processing...' : 'Deposit'}
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={!amount || isTransactionLoading}
            className="flex-1"
          >
            {isTransactionLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>
      </div>
    </Card>
  )
} 