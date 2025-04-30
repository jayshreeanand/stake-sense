# StakeSense

StakeSense is an AI-powered staking portfolio management platform built on SwellChain that helps users optimize their staking strategies across various Ethereum AVS (Actively Validated Services) providers.

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

- AI-driven staking strategy recommendations
- Real-time portfolio tracking and analytics
- Automated rebalancing suggestions
- Secure wallet integration
- Performance monitoring across multiple AVS providers

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, wagmi v2
- **Smart Contracts**: Solidity, Foundry
- **AI Strategy Module**: Python, FastAPI
- **Chain**: Swell Testnet

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Foundry
- MetaMask wallet

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stake-sense.git
   cd stake-sense
   ```

2. Install Foundry (if not already installed):

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install Python dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Configuration

1. Set up environment variables:

Frontend (.env.local):

```env
# Contract Configuration
NEXT_PUBLIC_VAULT_ADDRESS=0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB

# Network Configuration
NEXT_PUBLIC_RPC_URL=https://swell-testnet.alt.technology
NEXT_PUBLIC_CHAIN_ID=1924
NEXT_PUBLIC_CHAIN_NAME=Swell Testnet
```

Backend (.env):

```env
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

2. Deploy the smart contract (if deploying a new instance):

```bash
cd contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url https://swell-testnet.alt.technology --broadcast --chain-id 1924
```

3. Test the contract:

```bash
cd contracts
forge script script/TestVault.s.sol:TestVaultScript --rpc-url https://swell-testnet.alt.technology --broadcast --chain-id 1924
```

### Running the Application

1. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

2. Start the backend server:

   ```bash
   cd backend
   python run.py
   ```

The application will be available at `http://localhost:3000`.

## Testing

### Smart Contracts

```bash
cd contracts
forge test
```

### Frontend

```bash
cd frontend
npm run test
```

### Backend

```bash
cd backend
pytest
```

## Architecture

### Smart Contracts

- `StakeSenseVault.sol`: Main vault contract for managing user deposits and strategy execution
- `StrategyManager.sol`: Handles strategy allocation and rebalancing

### Frontend Components

- `PortfolioOverview`: Displays user's current portfolio status
- `VaultActions`: Handles deposit/withdraw operations
- `AIRecommendations`: Shows AI-generated strategy suggestions

### Backend Services

- Data Collection Layer: Fetches AVS metrics and performance data
- AI Decision Engine: Processes data and generates strategy recommendations
- API Service: Provides endpoints for frontend integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
