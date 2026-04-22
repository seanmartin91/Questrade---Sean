'use client'

import { headerStats } from '@/lib/data'

export default function Header() {
  return (
    <header className="flex flex-wrap items-center gap-x-5 gap-y-2 px-3 py-2 border-b border-terminal-border bg-terminal-panel">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-terminal-green text-xs tracking-[3px] font-bold">◆ WALLET HUNTER</span>
      </div>

      <span className="text-terminal-border hidden sm:block">|</span>

      {/* Stats */}
      {headerStats.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className={`text-sm font-bold leading-none ${
            s.color === 'green' ? 'text-terminal-green' :
            s.color === 'amber' ? 'text-terminal-amber' :
            'text-terminal-green-dim'
          }`}>{s.val}</span>
          <span className="text-[9px] text-terminal-green-muted leading-none mt-0.5">{s.label}</span>
        </div>
      ))}

      {/* Live indicator */}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-blink block" />
        <span className="text-[10px] text-terminal-green-muted tracking-widest">LIVE</span>
      </div>
    </header>
  )
}
