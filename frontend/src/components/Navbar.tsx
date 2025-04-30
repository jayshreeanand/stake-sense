'use client';

import Link from 'next/link';
import { ConnectButton } from './ConnectButton';

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              StakeSense
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 