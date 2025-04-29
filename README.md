# StakeSense

AI-Powered Restaking Strategy Optimizer for Ethereum stakers.

## Overview

StakeSense is a decentralized application that helps Ethereum stakers optimize their restaking yields through intelligent portfolio management and risk optimization. The platform uses AI to analyze AVS (Actively Validated Services) data and calculate risk scores to provide optimal allocation strategies.

## Features

- **Smart Portfolio Management**: Automatically rebalance your portfolio across multiple AVSs based on real-time performance data.
- **Risk Assessment**: Advanced AI algorithms evaluate slashing risks and validator reliability to protect your assets.
- **Yield Optimization**: Maximize your returns by identifying and capitalizing on the best restaking opportunities.

## Project Structure

- `contracts/`: Smart contracts for the StakeSense vault
- `frontend/`: Next.js frontend application
- `strategy/`: Python-based AI strategy optimizer

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Foundry (for smart contract development)
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stake-sense.git
   cd stake-sense
   ```

2. Install smart contract dependencies:

   ```bash
   cd contracts
   forge install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install strategy module dependencies:
   ```bash
   cd strategy
   pip install -r requirements.txt
   ```

### Configuration

1. Set up environment variables for the frontend:

   ```
   # Network Configuration
   NEXT_PUBLIC_NETWORK_ID=1924
   NEXT_PUBLIC_RPC_URL=https://swell-testnet.alt.technology
   NEXT_PUBLIC_CHAIN_NAME=Swellchain Testnet

   # Contract Addresses
   NEXT_PUBLIC_VAULT_ADDRESS=0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB
   ```

2. Set up environment variables for the contracts:
   ```
   PRIVATE_KEY=your_private_key
   RPC_URL=https://swell-testnet.alt.technology
   CHAIN_ID=1924
   VAULT_ADDRESS=0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB
   ```

### Running the Application

1. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Connect your wallet and start using StakeSense!

## Testing

### Smart Contracts

```bash
cd contracts
forge test
```

### Frontend

```bash
cd frontend
npm test
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
