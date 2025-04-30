import React from 'react';
import { Card, CardBody } from './ui';
import { useAccount, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { VAULT_ABI } from '@/config/abis';
import { useVaultContract } from '@/hooks/useVaultContract';

const PortfolioOverview = () => {
  const { address } = useAccount();
  const { vaultContract } = useVaultContract();

  const { data: portfolioInfo } = useContractRead({
    ...vaultContract,
    functionName: 'getPortfolioInfo',
    args: [address],
    watch: true,
  });

  const totalValue = portfolioInfo ? formatEther(portfolioInfo[0]) : '0';
  const totalDeposited = portfolioInfo ? formatEther(portfolioInfo[1]) : '0';
  const totalEarnings = portfolioInfo ? formatEther(portfolioInfo[2]) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardBody>
          <div className="text-sm text-gray-500">Total Value</div>
          <div className="text-2xl font-bold">{totalValue} ETH</div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="text-sm text-gray-500">Total Deposited</div>
          <div className="text-2xl font-bold">{totalDeposited} ETH</div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="text-sm text-gray-500">Total Earnings</div>
          <div className="text-2xl font-bold">{totalEarnings} ETH</div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PortfolioOverview; 