'use client'

import { closedPositions } from '@/lib/data'

export default function ClosedPositions() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] tracking-widest text-terminal-green-muted border-b border-terminal-border pb-1.5 mb-2">
        ▼ CLOSED POSITIONS
      </div>
      <div className="flex flex-col gap-0 flex-1 overflow-auto">
        {closedPositions.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-1.5 border-b border-terminal-border/50 last:border-0 hover:bg-terminal-green/5 transition-colors px-1 rounded"
          >
            <span className="text-[11px] font-bold text-terminal-green flex-1">{p.token}</span>
            <span className="text-[9px] text-terminal-green-muted">{p.duration}</span>
            <span className={`text-[10px] font-bold ${p.pos ? 'text-terminal-green' : 'text-terminal-red'}`}>
              {p.pnl}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${
              p.pos
                ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/20'
                : 'bg-terminal-red/10 text-terminal-red border border-terminal-red/20'
            }`}>
              {p.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
