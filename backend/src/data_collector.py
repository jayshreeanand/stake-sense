import os
import json
import asyncio
import aiohttp
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from web3 import Web3
import pandas as pd
import numpy as np

class AVSDataCollector:
    def __init__(self, rpc_url: str, swell_api_url: Optional[str] = None):
        """Initialize the AVS data collector.
        
        Args:
            rpc_url: Ethereum RPC URL
            swell_api_url: Optional Swell API URL for additional data
        """
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.swell_api_url = swell_api_url or "https://api.swell.testnet"
        
    async def fetch_avs_list(self) -> List[Dict]:
        """Fetch list of all available AVS services."""
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.swell_api_url}/avs/list") as response:
                if response.status == 200:
                    return await response.json()
                return []
                
    async def fetch_validator_performance(self, avs_address: str) -> Dict:
        """Fetch validator performance metrics for an AVS."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.swell_api_url}/validators/{avs_address}/metrics"
            ) as response:
                if response.status == 200:
                    return await response.json()
                return {}

    async def fetch_protocol_tvl(self, avs_address: str) -> float:
        """Fetch TVL for an AVS protocol."""
        # This would typically come from a subgraph or blockchain query
        # For now, we'll simulate it
        return float(self.w3.eth.get_balance(avs_address)) / 1e18

    async def fetch_slashing_events(self, avs_address: str) -> List[Dict]:
        """Fetch historical slashing events for an AVS."""
        # This would typically come from event logs
        # For now, we'll return simulated data
        return []

    async def collect_all_data(self) -> pd.DataFrame:
        """Collect all relevant data for all AVS services."""
        avs_list = await self.fetch_avs_list()
        
        all_data = []
        for avs in avs_list:
            performance = await self.fetch_validator_performance(avs['address'])
            tvl = await self.fetch_protocol_tvl(avs['address'])
            slashing_events = await self.fetch_slashing_events(avs['address'])
            
            data = {
                'address': avs['address'],
                'name': avs.get('name', 'Unknown'),
                'yield_rate': float(avs.get('yield_rate', 0)),
                'uptime': float(performance.get('uptime', 0)),
                'tvl': tvl,
                'slashing_count': len(slashing_events),
                'last_updated': datetime.now().isoformat()
            }
            all_data.append(data)
        
        return pd.DataFrame(all_data)

    def save_data(self, data: pd.DataFrame, filename: str = 'avs_data.csv'):
        """Save collected data to a CSV file."""
        data.to_csv(filename, index=False)
        
    def load_data(self, filename: str = 'avs_data.csv') -> pd.DataFrame:
        """Load collected data from a CSV file."""
        try:
            return pd.read_csv(filename)
        except FileNotFoundError:
            return pd.DataFrame()

async def main():
    # Example usage
    collector = AVSDataCollector(
        rpc_url=os.getenv('RPC_URL', 'https://swell-testnet.alt.technology'),
        swell_api_url=os.getenv('SWELL_API_URL')
    )
    
    data = await collector.collect_all_data()
    collector.save_data(data)
    print("Data collected and saved successfully!")

if __name__ == "__main__":
    asyncio.run(main()) 