import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta

class AVSStrategyOptimizer:
    def __init__(self, risk_tolerance: float = 0.5):
        """Initialize the AVS Strategy Optimizer.
        
        Args:
            risk_tolerance: Risk tolerance factor (0 to 1), where 1 is highest risk tolerance
        """
        self.risk_tolerance = risk_tolerance
        self.scaler = MinMaxScaler()
        
    def calculate_risk_score(self, avs_data: pd.DataFrame) -> pd.Series:
        """Calculate risk scores for each AVS based on various factors."""
        # Normalize factors
        uptime_score = self.scaler.fit_transform(avs_data[['uptime']]).flatten()
        tvl_score = self.scaler.fit_transform(avs_data[['tvl']]).flatten()
        slashing_score = 1 - self.scaler.fit_transform(avs_data[['slashing_count']]).flatten()
        
        # Weighted risk score (lower is better)
        risk_weights = {
            'uptime': 0.4,
            'tvl': 0.3,
            'slashing': 0.3
        }
        
        risk_score = (
            (1 - uptime_score) * risk_weights['uptime'] +
            (1 - tvl_score) * risk_weights['tvl'] +
            (1 - slashing_score) * risk_weights['slashing']
        )
        
        return pd.Series(risk_score, index=avs_data.index)
        
    def calculate_expected_return(self, avs_data: pd.DataFrame) -> pd.Series:
        """Calculate expected returns for each AVS."""
        return pd.Series(avs_data['yield_rate'])
        
    def optimize_allocation(self, avs_data: pd.DataFrame) -> Dict[str, float]:
        """Optimize allocation across AVS services based on risk-adjusted returns.
        
        Returns:
            Dict mapping AVS addresses to allocation percentages (0-100)
        """
        if len(avs_data) == 0:
            return {}
            
        # Calculate risk and return metrics
        risk_scores = self.calculate_risk_score(avs_data)
        expected_returns = self.calculate_expected_return(avs_data)
        
        # Calculate risk-adjusted returns
        # Higher risk tolerance means we care less about risk
        risk_adjustment = 1 - (1 - self.risk_tolerance) * risk_scores
        risk_adjusted_returns = expected_returns * risk_adjustment
        
        # Normalize to get allocation percentages
        total_score = risk_adjusted_returns.sum()
        if total_score == 0:
            # Equal allocation if all scores are 0
            allocations = pd.Series(100 / len(avs_data), index=avs_data.index)
        else:
            allocations = (risk_adjusted_returns / total_score) * 100
            
        # Create allocation dictionary
        return {
            address: float(allocation)
            for address, allocation in zip(avs_data['address'], allocations)
        }
        
    def get_rebalancing_recommendations(
        self,
        current_allocation: Dict[str, float],
        optimal_allocation: Dict[str, float],
        min_change_threshold: float = 5.0
    ) -> List[Tuple[str, float]]:
        """Get recommendations for rebalancing the portfolio.
        
        Args:
            current_allocation: Current allocation percentages by AVS address
            optimal_allocation: Optimal allocation percentages by AVS address
            min_change_threshold: Minimum change in percentage to trigger rebalancing
            
        Returns:
            List of (avs_address, target_allocation) tuples
        """
        recommendations = []
        
        for avs_address, optimal_pct in optimal_allocation.items():
            current_pct = current_allocation.get(avs_address, 0.0)
            change = abs(optimal_pct - current_pct)
            
            if change >= min_change_threshold:
                recommendations.append((avs_address, optimal_pct))
                
        return sorted(recommendations, key=lambda x: abs(
            x[1] - current_allocation.get(x[0], 0.0)
        ), reverse=True)

def main():
    # Example usage
    sample_data = pd.DataFrame({
        'address': ['0x123', '0x456', '0x789'],
        'name': ['AVS1', 'AVS2', 'AVS3'],
        'yield_rate': [0.1, 0.15, 0.08],
        'uptime': [0.99, 0.95, 0.98],
        'tvl': [1000000, 500000, 2000000],
        'slashing_count': [0, 2, 1]
    })
    
    optimizer = AVSStrategyOptimizer(risk_tolerance=0.7)
    optimal_allocation = optimizer.optimize_allocation(sample_data)
    
    current_allocation = {
        '0x123': 40.0,
        '0x456': 30.0,
        '0x789': 30.0
    }
    
    recommendations = optimizer.get_rebalancing_recommendations(
        current_allocation,
        optimal_allocation
    )
    
    print("Optimal Allocation:", optimal_allocation)
    print("Rebalancing Recommendations:", recommendations)

if __name__ == "__main__":
    main() 