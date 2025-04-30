import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import pandas as pd
from datetime import datetime

from data_collector import AVSDataCollector
from ai_engine import AVSStrategyOptimizer

app = FastAPI(title="StakeSense AI AVS Strategy Optimizer")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
collector = AVSDataCollector(
    rpc_url=os.getenv('RPC_URL', 'https://swell-testnet.alt.technology'),
    swell_api_url=os.getenv('SWELL_API_URL')
)

optimizer = AVSStrategyOptimizer(
    risk_tolerance=float(os.getenv('RISK_TOLERANCE', '0.5'))
)

class AllocationRequest(BaseModel):
    risk_tolerance: Optional[float] = 0.5
    current_allocation: Optional[Dict[str, float]] = None

@app.get("/avs/list")
async def get_avs_list():
    """Get list of all available AVS services."""
    try:
        avs_list = await collector.fetch_avs_list()
        return {"status": "success", "data": avs_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/avs/metrics")
async def get_avs_metrics():
    """Get current metrics for all AVS services."""
    try:
        data = await collector.collect_all_data()
        return {
            "status": "success",
            "data": data.to_dict(orient='records'),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/strategy/optimize")
async def optimize_strategy(request: AllocationRequest):
    """Get optimal strategy allocation based on current data."""
    try:
        # Collect latest data
        data = await collector.collect_all_data()
        
        # Update optimizer risk tolerance if provided
        if request.risk_tolerance is not None:
            optimizer.risk_tolerance = request.risk_tolerance
            
        # Calculate optimal allocation
        optimal_allocation = optimizer.optimize_allocation(data)
        
        # Get rebalancing recommendations if current allocation provided
        recommendations = []
        if request.current_allocation:
            recommendations = optimizer.get_rebalancing_recommendations(
                request.current_allocation,
                optimal_allocation
            )
            
        return {
            "status": "success",
            "data": {
                "optimal_allocation": optimal_allocation,
                "rebalancing_recommendations": recommendations,
                "risk_tolerance": optimizer.risk_tolerance
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()} 