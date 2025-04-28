import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-6">
          AI-Powered Restaking Strategy Optimizer
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Maximize your restaking yields with intelligent portfolio management and risk optimization.
        </p>
        <Link
          href="/dashboard"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Smart Portfolio Management</h3>
          <p className="text-gray-600">
            Automatically rebalance your portfolio across multiple AVSs based on real-time performance data.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
          <p className="text-gray-600">
            Advanced AI algorithms evaluate slashing risks and validator reliability to protect your assets.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Yield Optimization</h3>
          <p className="text-gray-600">
            Maximize your returns by identifying and capitalizing on the best restaking opportunities.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">1</div>
            <h3 className="font-semibold mb-2">Connect Wallet</h3>
            <p className="text-gray-600">Link your Web3 wallet to get started</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">2</div>
            <h3 className="font-semibold mb-2">Deposit Funds</h3>
            <p className="text-gray-600">Add ETH or LST to your portfolio</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">3</div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">Our AI evaluates optimal strategies</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">4</div>
            <h3 className="font-semibold mb-2">Auto-Rebalance</h3>
            <p className="text-gray-600">Portfolio automatically adjusts for best returns</p>
          </div>
        </div>
      </section>
    </div>
  );
}
