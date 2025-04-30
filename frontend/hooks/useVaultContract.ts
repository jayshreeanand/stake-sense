import { useContract, useProvider } from 'wagmi';
import { StakeSenseVault } from '@/types/contracts';
import vaultABI from '@/abi/StakeSenseVault.json';

export function useVaultContract() {
  const provider = useProvider();
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;

  return useContract({
    address: vaultAddress,
    abi: vaultABI,
    signerOrProvider: provider,
  }) as StakeSenseVault;
} 