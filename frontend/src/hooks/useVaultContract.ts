import { type Address } from 'viem'
import vaultABI from '@/abi/StakeSenseVault.json'

export function useVaultContract() {
  // Get the vault address from environment variables
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address

  return {
    address: vaultAddress,
    abi: vaultABI.abi,
  }
} 