'use client';

import Link from 'next/link';
import { ConnectButton } from './ConnectButton';

export function Navbar() {
  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              StakeSense
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/app" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              App
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 