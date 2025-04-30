import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Tuple
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random

class DQNNetwork(nn.Module):
    def __init__(self, input_size: int, output_size: int):
        super(DQNNetwork, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, output_size)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)

class RLOptimizer:
    def __init__(self, state_size: int, action_size: int):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.policy_net = DQNNetwork(state_size, action_size).to(self.device)
        self.target_net = DQNNetwork(state_size, action_size).to(self.device)
        self.target_net.load_state_dict(self.policy_net.state_dict())
        
        self.optimizer = optim.Adam(self.policy_net.parameters())
        self.memory = deque(maxlen=10000)
        self.batch_size = 64
        self.gamma = 0.99
        
    def store_transition(self, state, action, reward, next_state):
        self.memory.append((state, action, reward, next_state))
        
    def optimize_model(self):
        if len(self.memory) < self.batch_size:
            return
            
        batch = random.sample(self.memory, self.batch_size)
        states, actions, rewards, next_states = zip(*batch)
        
        state_batch = torch.tensor(states, dtype=torch.float32).to(self.device)
        action_batch = torch.tensor(actions, dtype=torch.long).to(self.device)
        reward_batch = torch.tensor(rewards, dtype=torch.float32).to(self.device)
        next_state_batch = torch.tensor(next_states, dtype=torch.float32).to(self.device)
        
        current_q_values = self.policy_net(state_batch).gather(1, action_batch.unsqueeze(1))
        next_q_values = self.target_net(next_state_batch).max(1)[0].detach()
        expected_q_values = reward_batch + self.gamma * next_q_values
        
        loss = nn.MSELoss()(current_q_values.squeeze(), expected_q_values)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

class AIEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.rl_optimizer = None
        self.historical_data = pd.DataFrame()
        
    def calculate_risk_metrics(self, avs_data: Dict) -> Dict[str, float]:
        """Calculate comprehensive risk metrics for an AVS."""
        metrics = {
            'operational_risk': self._calculate_operational_risk(avs_data),
            'technical_risk': self._calculate_technical_risk(avs_data),
            'financial_risk': self._calculate_financial_risk(avs_data),
            'network_risk': self._calculate_network_risk(avs_data),
            'composite_score': 0.0
        }
        
        # Calculate weighted composite score
        weights = {
            'operational_risk': 0.3,
            'technical_risk': 0.3,
            'financial_risk': 0.2,
            'network_risk': 0.2
        }
        
        metrics['composite_score'] = sum(
            metrics[key] * weights[key] 
            for key in weights.keys()
        )
        
        return metrics
        
    def _calculate_operational_risk(self, avs_data: Dict) -> float:
        """Calculate operational risk based on uptime, performance, and reliability."""
        uptime = avs_data.get('uptime', 0)
        performance = avs_data.get('performance_score', 0)
        incidents = avs_data.get('incident_count', 0)
        
        risk_score = (
            0.4 * (1 - uptime/100) +
            0.4 * (1 - performance/100) +
            0.2 * min(incidents/10, 1)
        )
        return risk_score
        
    def _calculate_technical_risk(self, avs_data: Dict) -> float:
        """Calculate technical risk based on code quality, audits, and technical metrics."""
        audit_score = avs_data.get('audit_score', 0)
        code_quality = avs_data.get('code_quality_score', 0)
        bug_count = avs_data.get('critical_bugs', 0)
        
        risk_score = (
            0.4 * (1 - audit_score/100) +
            0.3 * (1 - code_quality/100) +
            0.3 * min(bug_count/5, 1)
        )
        return risk_score
        
    def _calculate_financial_risk(self, avs_data: Dict) -> float:
        """Calculate financial risk based on TVL, market metrics, and financial stability."""
        tvl = avs_data.get('tvl', 0)
        market_share = avs_data.get('market_share', 0)
        volatility = avs_data.get('price_volatility', 0)
        
        risk_score = (
            0.4 * (1 - min(tvl/1000000, 1)) +
            0.3 * (1 - market_share/100) +
            0.3 * min(volatility/100, 1)
        )
        return risk_score
        
    def _calculate_network_risk(self, avs_data: Dict) -> float:
        """Calculate network risk based on decentralization and network metrics."""
        validator_count = avs_data.get('validator_count', 0)
        geographic_distribution = avs_data.get('geographic_distribution', 0)
        network_load = avs_data.get('network_load', 0)
        
        risk_score = (
            0.4 * (1 - min(validator_count/100, 1)) +
            0.3 * (1 - geographic_distribution/100) +
            0.3 * min(network_load/100, 1)
        )
        return risk_score
        
    def optimize_portfolio(self, avs_list: List[Dict], constraints: Dict) -> List[Dict[str, float]]:
        """Optimize portfolio allocation using reinforcement learning."""
        if not self.rl_optimizer:
            state_size = len(avs_list) * 4  # 4 risk metrics per AVS
            action_size = len(avs_list)
            self.rl_optimizer = RLOptimizer(state_size, action_size)
            
        # Prepare state representation
        state = []
        for avs in avs_list:
            metrics = self.calculate_risk_metrics(avs)
            state.extend([
                metrics['operational_risk'],
                metrics['technical_risk'],
                metrics['financial_risk'],
                metrics['network_risk']
            ])
            
        # Get action from policy network
        state_tensor = torch.tensor(state, dtype=torch.float32).to(self.rl_optimizer.device)
        with torch.no_grad():
            action_probs = torch.softmax(self.rl_optimizer.policy_net(state_tensor), dim=0)
            
        # Convert to allocation percentages
        allocations = action_probs.cpu().numpy()
        allocations = allocations / allocations.sum() * 100  # Normalize to percentages
        
        # Apply constraints
        min_allocation = constraints.get('min_allocation', 0)
        max_allocation = constraints.get('max_allocation', 100)
        allocations = np.clip(allocations, min_allocation, max_allocation)
        allocations = allocations / allocations.sum() * 100  # Renormalize
        
        # Prepare result
        result = []
        for i, avs in enumerate(avs_list):
            result.append({
                'avs_name': avs['name'],
                'allocation': float(allocations[i]),
                'risk_metrics': self.calculate_risk_metrics(avs)
            })
            
        return result
        
    def update_model(self, reward: float):
        """Update the RL model based on received reward."""
        if len(self.rl_optimizer.memory) > 0:
            self.rl_optimizer.optimize_model()
            
    def get_historical_performance(self) -> Dict:
        """Get historical performance metrics."""
        return {
            'returns': self.historical_data.get('returns', []),
            'volatility': self.historical_data.get('volatility', []),
            'sharpe_ratio': self.historical_data.get('sharpe_ratio', []),
            'max_drawdown': self.historical_data.get('max_drawdown', [])
        } 