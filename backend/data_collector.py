import aiohttp
import asyncio
import pandas as pd
from typing import List, Dict
import json
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataCollector:
    def __init__(self):
        self.session = None
        self.cache = {}
        self.cache_duration = timedelta(minutes=5)
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
            
    async def fetch_avs_list(self) -> List[Dict]:
        """Fetch list of available AVS services."""
        if self._is_cache_valid('avs_list'):
            return self.cache['avs_list']
            
        # Example endpoints - replace with actual API endpoints
        endpoints = [
            'https://api.eigenlayer.xyz/avs/list',
            'https://api.stakewise.io/operators',
            'https://api.rocketpool.net/nodes'
        ]
        
        avs_list = []
        for endpoint in endpoints:
            try:
                async with self.session.get(endpoint) as response:
                    if response.status == 200:
                        data = await response.json()
                        avs_list.extend(self._process_avs_data(data))
            except Exception as e:
                logger.error(f"Error fetching AVS list from {endpoint}: {str(e)}")
                
        self.cache['avs_list'] = avs_list
        self.cache['avs_list_timestamp'] = datetime.now()
        return avs_list
        
    async def fetch_avs_metrics(self, avs_id: str) -> Dict:
        """Fetch comprehensive metrics for a specific AVS."""
        cache_key = f'metrics_{avs_id}'
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]
            
        metrics = {}
        
        # Fetch operational metrics
        metrics.update(await self._fetch_operational_metrics(avs_id))
        
        # Fetch technical metrics
        metrics.update(await self._fetch_technical_metrics(avs_id))
        
        # Fetch financial metrics
        metrics.update(await self._fetch_financial_metrics(avs_id))
        
        # Fetch network metrics
        metrics.update(await self._fetch_network_metrics(avs_id))
        
        # Fetch social metrics
        metrics.update(await self._fetch_social_metrics(avs_id))
        
        self.cache[cache_key] = metrics
        self.cache[f'{cache_key}_timestamp'] = datetime.now()
        return metrics
        
    async def _fetch_operational_metrics(self, avs_id: str) -> Dict:
        """Fetch operational metrics including uptime, performance, and incidents."""
        metrics = {
            'uptime': 0,
            'performance_score': 0,
            'incident_count': 0,
            'response_time': 0,
            'success_rate': 0
        }
        
        try:
            # Fetch uptime and performance data
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/metrics') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics.update(data.get('operational', {}))
                    
            # Fetch incident history
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/incidents') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics['incident_count'] = len(data.get('incidents', []))
        except Exception as e:
            logger.error(f"Error fetching operational metrics for {avs_id}: {str(e)}")
            
        return metrics
        
    async def _fetch_technical_metrics(self, avs_id: str) -> Dict:
        """Fetch technical metrics including code quality, audits, and bug reports."""
        metrics = {
            'audit_score': 0,
            'code_quality_score': 0,
            'critical_bugs': 0,
            'test_coverage': 0,
            'deployment_frequency': 0
        }
        
        try:
            # Fetch audit and code quality data
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/technical') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics.update(data.get('technical', {}))
                    
            # Fetch GitHub metrics if available
            async with self.session.get(f'https://api.github.com/repos/{avs_id}') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics['github_stars'] = data.get('stargazers_count', 0)
                    metrics['github_forks'] = data.get('forks_count', 0)
        except Exception as e:
            logger.error(f"Error fetching technical metrics for {avs_id}: {str(e)}")
            
        return metrics
        
    async def _fetch_financial_metrics(self, avs_id: str) -> Dict:
        """Fetch financial metrics including TVL, market data, and economic metrics."""
        metrics = {
            'tvl': 0,
            'market_share': 0,
            'price_volatility': 0,
            'volume_24h': 0,
            'revenue': 0
        }
        
        try:
            # Fetch TVL and market data
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/financial') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics.update(data.get('financial', {}))
                    
            # Fetch additional market data from CoinGecko or similar
            async with self.session.get(f'https://api.coingecko.com/api/v3/simple/token_price/{avs_id}') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics['token_price'] = data.get('price', 0)
        except Exception as e:
            logger.error(f"Error fetching financial metrics for {avs_id}: {str(e)}")
            
        return metrics
        
    async def _fetch_network_metrics(self, avs_id: str) -> Dict:
        """Fetch network metrics including validator stats and network health."""
        metrics = {
            'validator_count': 0,
            'geographic_distribution': 0,
            'network_load': 0,
            'peer_count': 0,
            'network_latency': 0
        }
        
        try:
            # Fetch network statistics
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/network') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics.update(data.get('network', {}))
                    
            # Fetch validator metrics
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/validators') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics['active_validators'] = len(data.get('validators', []))
        except Exception as e:
            logger.error(f"Error fetching network metrics for {avs_id}: {str(e)}")
            
        return metrics
        
    async def _fetch_social_metrics(self, avs_id: str) -> Dict:
        """Fetch social metrics including community engagement and social media presence."""
        metrics = {
            'twitter_followers': 0,
            'discord_members': 0,
            'telegram_members': 0,
            'community_growth': 0,
            'sentiment_score': 0
        }
        
        try:
            # Fetch social media metrics
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/social') as response:
                if response.status == 200:
                    data = await response.json()
                    metrics.update(data.get('social', {}))
        except Exception as e:
            logger.error(f"Error fetching social metrics for {avs_id}: {str(e)}")
            
        return metrics
        
    def _process_avs_data(self, data: Dict) -> List[Dict]:
        """Process and standardize AVS data from different sources."""
        processed_data = []
        for item in data.get('items', []):
            processed_item = {
                'id': item.get('id'),
                'name': item.get('name'),
                'description': item.get('description'),
                'website': item.get('website'),
                'type': item.get('type'),
                'status': item.get('status')
            }
            processed_data.append(processed_item)
        return processed_data
        
    def _is_cache_valid(self, key: str) -> bool:
        """Check if cached data is still valid."""
        if key in self.cache and f'{key}_timestamp' in self.cache:
            age = datetime.now() - self.cache[f'{key}_timestamp']
            return age < self.cache_duration
        return False
        
    async def get_historical_data(self, avs_id: str, start_date: str, end_date: str) -> pd.DataFrame:
        """Fetch historical performance data for an AVS."""
        try:
            async with self.session.get(
                f'https://api.eigenlayer.xyz/avs/{avs_id}/historical',
                params={'start_date': start_date, 'end_date': end_date}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    df = pd.DataFrame(data.get('historical_data', []))
                    return df
        except Exception as e:
            logger.error(f"Error fetching historical data for {avs_id}: {str(e)}")
            return pd.DataFrame()
            
    async def get_market_sentiment(self, avs_id: str) -> Dict:
        """Analyze market sentiment from various sources."""
        sentiment = {
            'overall_score': 0,
            'social_sentiment': 0,
            'news_sentiment': 0,
            'market_sentiment': 0
        }
        
        try:
            # Fetch sentiment data from various sources
            async with self.session.get(f'https://api.eigenlayer.xyz/avs/{avs_id}/sentiment') as response:
                if response.status == 200:
                    data = await response.json()
                    sentiment.update(data.get('sentiment', {}))
        except Exception as e:
            logger.error(f"Error fetching market sentiment for {avs_id}: {str(e)}")
            
        return sentiment 