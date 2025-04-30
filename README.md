# StakeSense

AI-powered strategy optimizer for restaking yields — smarter staking, safer returns.

## Overview

StakeSense is an on-chain AI-powered strategy optimizer that helps users allocate their restaked assets across AVSs (Actively Validated Services) for the best risk-adjusted yield. It functions like a DeFi AI-advisor for the restaking economy.

## Deployment

The project is deployed on Swell Testnet (Chain ID: 1924).

Demo URL: https://stake-sense.vercel.app

### Contract Addresses

- StakeSenseVault: `0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB`
- RPC URL: `https://swell-testnet.alt.technology`

### Test Transactions

Recent test transactions have confirmed the following functionality:

- Deposit: [0x729aebbdf427236d9c4df85966f0b73bf9df4c667472ae70267ebaca1f0f3da4](https://explorer.testnet.swell.technology/tx/0x729aebbdf427236d9c4df85966f0b73bf9df4c667472ae70267ebaca1f0f3da4)
- Strategy Management: [0xfd6437530d3368529afb784643080e4c4fbc61ab37faeb0590cf80919cc3869c](https://explorer.testnet.swell.technology/tx/0xfd6437530d3368529afb784643080e4c4fbc61ab37faeb0590cf80919cc3869c)
- Withdrawal: [0x6f81188888e6cddca7229e99be310b1184435f8c10503cdc9963c4bf833d2013](https://explorer.testnet.swell.technology/tx/0x6f81188888e6cddca7229e99be310b1184435f8c10503cdc9963c4bf833d2013)

## Features

### Smart Contracts

- **StakeSenseVault**: Manages user deposits and withdrawals

  - Accepts ETH deposits
  - Allocates funds across AVSs based on strategy weights
  - Supports emergency withdrawals
  - Deployed at: `0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB` (Swell Testnet)

- **Strategy Management**:
  - Dynamic allocation weights for each AVS
  - Admin-controlled strategy updates
  - Real-time portfolio information

### AI Engine

- **Data Collection**:

  - AVS yield monitoring
  - Validator uptime tracking
  - Slashing risk assessment
  - Real-time ROI calculations

- **Strategy Optimization**:
  - Risk-adjusted scoring system
  - Dynamic weight calculations
  - Automated rebalancing recommendations

### Frontend Interface

- **Portfolio Overview**:

  - Total balance display
  - Current strategy allocations
  - Performance metrics

- **User Actions**:
  - Deposit ETH
  - Withdraw ETH
  - View strategy details

## Architecture

### Smart Contracts (Solidity)

```
contracts/
├── src/
│   ├── StakeSenseVault.sol    # Main vault contract
│   ├── interfaces/            # Contract interfaces
│   └── test/                  # Contract tests
└── script/                    # Deployment scripts
```

### AI Engine (Python)

```
backend/
├── data_collector.py    # AVS metrics collection
├── ai_engine.py         # Strategy optimization
└── main.py             # API endpoints
```

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks
│   └── lib/           # Utilities
└── public/            # Static assets
```

## Setup and Installation

### Prerequisites

- Node.js 18+
- Python 3.9+
- Foundry

### Smart Contracts

```bash
# Install dependencies
cd contracts
forge install

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url https://swell-testnet.alt.technology --broadcast --chain-id 1924

# Run tests
forge test
```

### Backend

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Start server
python main.py
```

### Frontend

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## Configuration

### Environment Variables

#### Frontend (.env)

```
NEXT_PUBLIC_NETWORK_ID=1924
NEXT_PUBLIC_RPC_URL=https://swell-testnet.alt.technology
NEXT_PUBLIC_CHAIN_NAME=Swellchain Testnet
NEXT_PUBLIC_VAULT_ADDRESS=0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB
```

#### Backend (.env)

```
RPC_URL=https://swell-testnet.alt.technology
VAULT_ADDRESS=0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB
```

## Testing

### Smart Contract Tests

```bash
cd contracts
forge test -vv
```

### Integration Tests

```bash
cd contracts
forge script script/TestVault.s.sol:TestVaultScript --rpc-url https://swell-testnet.alt.technology --broadcast --chain-id 1924
```

## API Endpoints

### Backend API

- `GET /avs/list`: List all available AVS services
- `GET /avs/metrics`: Get current metrics for all AVS services
- `POST /strategy/optimize`: Get optimal allocation strategy
- `GET /health`: Health check endpoint

## Security

- All contracts are upgradeable via proxy pattern
- Admin controls for strategy updates
- Emergency withdrawal functionality
- Rate limiting on rebalancing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Contact

For questions and support, please open an issue in the repository.
