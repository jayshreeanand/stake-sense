import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">StakeSense</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-foreground hover:text-primary">
                Dashboard
              </a>
              <a href="/dashboard/portfolio" className="text-foreground hover:text-primary">
                Portfolio
              </a>
              <a href="/dashboard/analytics" className="text-foreground hover:text-primary">
                Analytics
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
} 