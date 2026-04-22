'use client'

import { wallets } from '@/lib/data'

const TAG_STYLES = {
  smart: 'bg-terminal-green/10 text-terminal-green border border-terminal-green/30',
  degen: 'bg-terminal-red/10 text-terminal-red border border-terminal-red/30',
  whale: 'bg-terminal-amber/10 text-terminal-amber border border-terminal-amber/30',
}

export default function WalletTracker() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] tracking-widest text-terminal-green-muted border-b border-terminal-border pb-1.5 mb-2">
        ■ WALLET TRACKER
      </div>
      <div className="flex flex-col gap-0 overflow-auto flex-1">
        {wallets.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-1.5 border-b border-terminal-border/50 last:border-0 hover:bg-terminal-green/5 transition-colors px-1 rounded"
          >
            <span className="text-[10px] text-terminal-green-dim flex-1 truncate">{w.addr}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${TAG_STYLES[w.tag]}`}>{w.tag}</span>
            <span className={`text-[10px] min-w-[44px] text-right font-bold ${w.pos ? 'text-terminal-green' : 'text-terminal-red'}`}>
              {w.pct}
            </span>
            <span className="text-[10px] text-terminal-green-muted min-w-[32px] text-right">{w.vol}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
