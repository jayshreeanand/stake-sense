# StakeSense

AI-powered strategy optimizer for restaking yields — smarter staking, safer returns.

## Overview

StakeSense is an on-chain, AI-powered restaking strategy optimizer that:

- Monitors restaking AVSs and strategies (Actively Validated Services)
- Evaluates yield, slashing risk, validator reliability, and restaking performance
- Auto-allocates user funds to optimal strategies in real time

## Project Structure

```
stakesense/
├── contracts/           # Solidity smart contracts
├── strategy/           # AI strategy module (Python)
├── frontend/           # Next.js + TailwindCSS frontend
└── docs/              # Documentation
```

## Components

### 1. Smart Contracts

- Written in Solidity
- Handles deposits, withdrawals, and strategy management
- Implements access control and portfolio tracking

### 2. AI Strategy Module

- Python-based strategy optimizer
- Fetches and analyzes AVS/restaking data
- Recommends optimal allocation weights

### 3. Frontend

- Built with Next.js and TailwindCSS
- Modern, responsive UI
- Real-time portfolio tracking and management

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.9
- Foundry (for smart contract development)
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/stakesense.git
cd stakesense
```

2. Install dependencies:

```bash
# Smart contracts
cd contracts
forge install

# Frontend
cd ../frontend
npm install

# Strategy module
cd ../strategy
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

### Development

1. Start local blockchain:

```bash
cd contracts
forge test
```

2. Deploy contracts:

```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url <your-rpc-url> --broadcast
```

3. Run strategy module:

```bash
cd strategy
python main.py
```

4. Start frontend:

```bash
cd frontend
npm run dev
```

## Testing

```bash
# Smart contracts
cd contracts
forge test

# Frontend
cd frontend
npm test

# Strategy module
cd strategy
pytest
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
