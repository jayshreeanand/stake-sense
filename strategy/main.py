import os
import json
import time
from typing import List, Dict, Tuple
import numpy as np
import pandas as pd
from web3 import Web3
from dotenv import load_dotenv
from sklearn.preprocessing import MinMaxScaler
from eth_account import Account
import requests
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class AVSStrategy:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))
        self.contract_address = os.getenv('CONTRACT_ADDRESS')
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = Account.from_key(self.private_key)
        
        # Load contract ABI
        with open('contracts/abi/StakeSenseVault.json', 'r') as f:
            contract_abi = json.load(f)
        
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=contract_abi
        )
        
        # Initialize data sources
        self.avs_data = {}
        self.risk_scores = {}
        self.yield_data = {}
        
    def fetch_avs_data(self) -> Dict:
        """
        Fetch AVS data from various sources (subgraphs, APIs, etc.)
        Returns a dictionary of AVS metrics
        """
        try:
            # Example: Fetch data from a subgraph
            # In production, implement actual data fetching logic
            avs_data = {
                'avs1': {
                    'address': '0x...',
                    'total_staked': 1000,
                    'active_validators': 100,
                    'slashing_events': 0,
                    'uptime': 0.99
                },
                'avs2': {
                    'address': '0x...',
                    'total_staked': 2000,
                    'active_validators': 200,
                    'slashing_events': 1,
                    'uptime': 0.98
                }
            }
            return avs_data
        except Exception as e:
            logger.error(f"Error fetching AVS data: {e}")
            return {}

    def calculate_risk_scores(self, avs_data: Dict) -> Dict:
        """
        Calculate risk scores for each AVS based on various metrics
        """
        risk_scores = {}
        for avs_id, data in avs_data.items():
            # Example risk scoring formula
            # In production, implement more sophisticated risk assessment
            risk_score = (
                (1 - data['uptime']) * 0.4 +
                (data['slashing_events'] / data['active_validators']) * 0.3 +
                (1 / data['total_staked']) * 0.3
            )
            risk_scores[avs_id] = risk_score
        return risk_scores

    def fetch_yield_data(self) -> Dict:
        """
        Fetch yield data for each AVS
        """
        try:
            # Example: Fetch yield data from APIs
            # In production, implement actual yield data fetching
            yield_data = {
                'avs1': 0.05,  # 5% APY
                'avs2': 0.07,  # 7% APY
            }
            return yield_data
        except Exception as e:
            logger.error(f"Error fetching yield data: {e}")
            return {}

    def optimize_strategy(self) -> List[Dict]:
        """
        Optimize strategy allocation using ML/AI
        Returns a list of strategy configurations
        """
        # Fetch latest data
        self.avs_data = self.fetch_avs_data()
        self.risk_scores = self.calculate_risk_scores(self.avs_data)
        self.yield_data = self.fetch_yield_data()

        # Prepare data for optimization
        avs_ids = list(self.avs_data.keys())
        risk_values = np.array([self.risk_scores[avs_id] for avs_id in avs_ids])
        yield_values = np.array([self.yield_data[avs_id] for avs_id in avs_ids])

        # Normalize data
        risk_scaler = MinMaxScaler()
        yield_scaler = MinMaxScaler()
        
        risk_normalized = risk_scaler.fit_transform(risk_values.reshape(-1, 1))
        yield_normalized = yield_scaler.fit_transform(yield_values.reshape(-1, 1))

        # Calculate optimal weights using a simple optimization approach
        # In production, implement more sophisticated optimization
        weights = []
        for i in range(len(avs_ids)):
            # Example scoring formula: yield_score - risk_score
            score = yield_normalized[i][0] - risk_normalized[i][0]
            weights.append(max(0, score))  # Ensure non-negative weights

        # Normalize weights to sum to 1
        weights = np.array(weights)
        weights = weights / weights.sum()

        # Prepare strategy configurations
        strategies = []
        for i, avs_id in enumerate(avs_ids):
            strategy = {
                'avsAddress': self.avs_data[avs_id]['address'],
                'allocation': int(weights[i] * 10000),  # Convert to basis points
                'active': True
            }
            strategies.append(strategy)

        return strategies

    def update_strategy(self):
        """
        Update the strategy on the smart contract
        """
        try:
            # Get optimized strategy
            strategies = self.optimize_strategy()
            
            # Prepare transaction
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            
            # Build transaction
            transaction = self.contract.functions.setStrategy(strategies).build_transaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 2000000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            logger.info(f"Strategy updated successfully. Transaction hash: {receipt['transactionHash'].hex()}")
            
            return receipt
        except Exception as e:
            logger.error(f"Error updating strategy: {e}")
            return None

    def run(self):
        """
        Main loop to continuously monitor and update strategies
        """
        while True:
            try:
                logger.info("Starting strategy optimization cycle...")
                self.update_strategy()
                logger.info("Strategy optimization cycle completed")
                
                # Wait for next cycle
                time.sleep(3600)  # Run every hour
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                time.sleep(300)  # Wait 5 minutes before retrying

if __name__ == "__main__":
    strategy = AVSStrategy()
    strategy.run() 