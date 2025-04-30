'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart2, Brain, Lock, Repeat, Shield, Wallet } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'AI-Powered Strategy',
    description: 'Dynamic allocation weights optimized by machine learning for the best risk-adjusted yields',
    icon: Brain,
  },
  {
    title: 'Real-Time Monitoring',
    description: 'Track AVS yields, validator uptime, and slashing risks with live updates',
    icon: BarChart2,
  },
  {
    title: 'Automated Rebalancing',
    description: 'Smart portfolio rebalancing to maintain optimal exposure across AVS services',
    icon: Repeat,
  },
  {
    title: 'Secure Architecture',
    description: 'Upgradeable contracts with emergency withdrawals and multi-layer security',
    icon: Shield,
  },
];

const benefits = [
  {
    title: 'Smart Deposits',
    description: 'Deposit ETH once and let our AI optimize your restaking strategy',
    icon: Wallet,
  },
  {
    title: 'Risk Management',
    description: 'Advanced risk scoring system to protect your assets',
    icon: Lock,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            StakeSense
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-powered strategy optimizer for restaking yields — smarter staking, safer returns.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="https://explorer.testnet.swell.technology/address/0x80AFC56FfDFaB6858c2F2D233024E0a9581Db4bB" 
               target="_blank" 
               rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                View Contract
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powered by Advanced Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gray-900 border-gray-800">
                <div className="flex items-start">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-gray-900 border-gray-800">
                <div className="flex items-start">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gray-900 border-gray-800 text-center">
              <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Multiple AVS
              </h3>
              <p className="text-gray-400">Support for various Actively Validated Services</p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-800 text-center">
              <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Real-Time
              </h3>
              <p className="text-gray-400">Live monitoring and instant rebalancing</p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-800 text-center">
              <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                AI-Driven
              </h3>
              <p className="text-gray-400">Machine learning optimized strategies</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to optimize your restaking strategy?
          </h2>
          <p className="text-gray-400 mb-8">
            Join StakeSense today and let AI maximize your yields while minimizing risks.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
