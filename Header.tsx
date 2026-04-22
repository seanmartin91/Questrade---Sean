'use client'

import { activeTrades } from '@/lib/data'

export default function ActiveTrades() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] tracking-widest text-terminal-green-muted border-b border-terminal-border pb-1.5 mb-2">
        ◆ ACTIVE TRADES
      </div>
      <div className="flex flex-col gap-0 flex-1 overflow-auto">
        {activeTrades.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-2 border-b border-terminal-border/50 last:border-0 hover:bg-terminal-green/5 transition-colors px-1 rounded"
          >
            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-bold text-terminal-green">{t.token}</span>
              <span className="text-[9px] text-terminal-green-muted mt-0.5">{t.entry} → {t.now}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className={`text-[11px] font-bold ${t.pos ? 'text-terminal-green' : 'text-terminal-red'}`}>
                {t.pct}
              </span>
              <div className="flex gap-1">
                <span className="text-[9px] text-terminal-green-muted">{t.age}</span>
                <span className="text-[9px] text-terminal-amber">{t.mcap}</span>
              </div>
            </div>
            {/* Pos indicator bar */}
            <div className={`w-1 h-8 rounded-full ${t.pos ? 'bg-terminal-green' : 'bg-terminal-red'} opacity-60`} />
          </div>
        ))}
        {activeTrades.length === 0 && (
          <div className="text-[10px] text-terminal-green-muted text-center mt-4">no active trades</div>
        )}
      </div>
    </div>
  )
}
