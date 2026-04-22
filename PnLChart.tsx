'use client'

import { bulletPlan } from '@/lib/data'

export default function BulletPlan() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] tracking-widest text-terminal-green-muted border-b border-terminal-border pb-1.5 mb-2">
        ■ BULLET PLAN
      </div>
      <div className="flex flex-col gap-0 flex-1">
        {bulletPlan.slice(0, -1).map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1.5 border-b border-terminal-border/50 px-1"
          >
            <span className="text-[10px] text-terminal-green-muted">{p.label}</span>
            <span className="text-[10px] font-bold text-terminal-green-dim">{p.val}</span>
          </div>
        ))}
      </div>
      {/* Net plan highlight */}
      <div className="mt-3 bg-terminal-green/10 border border-terminal-green/30 rounded p-3 text-center">
        <div className="text-[9px] text-terminal-green-muted tracking-widest mb-1">NET PLAN</div>
        <div className="text-base font-bold text-terminal-green">+$400.48</div>
      </div>
    </div>
  )
}
