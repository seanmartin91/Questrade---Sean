'use client'

import { topWallets } from '@/lib/data'

export default function TopWallets() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] tracking-widest text-terminal-green-muted border-b border-terminal-border pb-1.5 mb-2">
        ▲ TOP WALLETS
      </div>
      <div className="flex flex-col gap-0 flex-1 overflow-auto">
        {topWallets.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-1.5 border-b border-terminal-border/50 last:border-0 hover:bg-terminal-green/5 transition-colors px-1 rounded"
          >
            <span className="text-[10px] text-terminal-green-muted min-w-[12px]">{i + 1}</span>
            <span className="text-[10px] text-terminal-green-dim flex-1 truncate">{w.addr}</span>
            <span className="text-[9px] text-terminal-green-muted">{w.wins}W</span>
            <span className="text-[9px] text-terminal-green-muted">{w.winRate}</span>
            <span className="text-[10px] text-terminal-green font-bold">{w.pnl}</span>
            <span className="text-[9px] bg-terminal-green/10 border border-terminal-green/20 text-terminal-green px-1 rounded-sm">
              {w.streak}🔥
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
