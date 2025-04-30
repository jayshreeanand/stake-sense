'use client';

import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useVaultContract } from '../hooks/useVaultContract'
import { useContractWrite, useContractRead } from 'wagmi'

export function VaultActions() {
  const { address } = useAccount()
  const vault = useVaultContract()

  const { data: portfolioInfo } = useContractRead({
    ...vault,
    functionName: 'getPortfolioInfo',
    args: [address || '0x0000000000000000000000000000000000000000'],
    enabled: !!address,
  })

  const { writeAsync: depositFn } = useContractWrite({
    ...vault,
    functionName: 'deposit',
  })

  const { writeAsync: withdrawFn } = useContractWrite({
    ...vault,
    functionName: 'withdraw',
  })

  const handleDeposit = async (amount: string) => {
    if (!depositFn) return
    try {
      await depositFn({
        args: [],
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Error depositing:', error)
    }
  }

  const handleWithdraw = async (amount: string) => {
    if (!withdrawFn) return
    try {
      await withdrawFn({
        args: [parseEther(amount)],
      })
    } catch (error) {
      console.error('Error withdrawing:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Your Portfolio</h2>
        <p>Balance: {portfolioInfo ? Number(portfolioInfo) / 1e18 : 0} ETH</p>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => handleDeposit('0.1')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Deposit 0.1 ETH
        </button>
        
        <button
          onClick={() => handleWithdraw('0.1')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
        >
          Withdraw 0.1 ETH
        </button>
      </div>
    </div>
  )
} 