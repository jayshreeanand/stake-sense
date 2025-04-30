'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { useContractWrite, useAccount, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { useVaultContract } from '@/hooks/useVaultContract';

interface VaultActionsProps {
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
}

export default function VaultActions({ onDeposit, onWithdraw }: VaultActionsProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const { address } = useAccount();
  const vaultContract = useVaultContract();

  const { data: balance } = useBalance({
    address,
  });

  const { write: deposit } = useContractWrite({
    ...vaultContract,
    functionName: 'deposit',
    args: [],
    overrides: {
      value: depositAmount ? parseEther(depositAmount) : undefined
    }
  });

  const { write: withdraw } = useContractWrite({
    ...vaultContract,
    functionName: 'withdraw',
    args: [withdrawAmount ? parseEther(withdrawAmount) : undefined]
  });

  const handleDeposit = () => {
    if (!deposit) return;
    try {
      deposit();
    } catch (error) {
      console.error('Error depositing:', error);
    }
    onDeposit(depositAmount);
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    if (!withdraw) return;
    try {
      withdraw();
    } catch (error) {
      console.error('Error withdrawing:', error);
    }
    onWithdraw(withdrawAmount);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Deposit ETH</h3>
        <div className="flex gap-4">
          <Input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount in ETH"
            min="0"
            step="0.01"
          />
          <Button onClick={handleDeposit}>Deposit</Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Balance: {balance?.formatted} {balance?.symbol}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Withdraw ETH</h3>
        <div className="flex gap-4">
          <Input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Amount in ETH"
            min="0"
            step="0.01"
          />
          <Button onClick={handleWithdraw}>Withdraw</Button>
        </div>
      </div>
    </div>
  );
}