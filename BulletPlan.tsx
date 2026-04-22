'use client'

import Header from '@/components/Header'
import WalletTracker from '@/components/WalletTracker'
import TopWallets from '@/components/TopWallets'
import ActiveTrades from '@/components/ActiveTrades'
import PnLChart from '@/components/PnLChart'
import ClosedPositions from '@/components/ClosedPositions'
import BulletPlan from '@/components/BulletPlan'

const Panel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-terminal-panel border border-terminal-border rounded-sm p-2.5 ${className}`}>
    {children}
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-terminal-bg relative">
      {/* Scanline overlay */}
      <div className="scanline fixed inset-0 pointer-events-none z-50" />

      <Header />

      <main className="p-2 flex flex-col gap-2">
        {/* Top row — 3 panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Panel><WalletTracker /></Panel>
          <Panel><TopWallets /></Panel>
          <Panel><ActiveTrades /></Panel>
        </div>

        {/* Chart */}
        <Panel className="h-[220px]">
          <PnLChart />
        </Panel>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Panel><ClosedPositions /></Panel>
          <Panel><BulletPlan /></Panel>
        </div>
      </main>
    </div>
  )
}
