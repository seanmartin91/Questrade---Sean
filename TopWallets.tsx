'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { pnlHistory } from '@/lib/data'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-terminal-panel border border-terminal-border px-2 py-1 rounded text-[10px]">
        <p className="text-terminal-green-muted">{label}</p>
        <p className="text-terminal-green font-bold">+${payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function PnLChart() {
  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="flex items-center gap-6 pb-3 border-b border-terminal-border mb-3">
        <div>
          <div className="text-xl font-bold text-terminal-green">+$382</div>
          <div className="text-[9px] text-terminal-green-muted tracking-widest">UNREALIZED P&L</div>
        </div>
        <div className="flex gap-5 ml-auto flex-wrap">
          {[
            { v: '6', l: 'trades' },
            { v: '12.5%', l: 'win', amber: true },
            { v: '1.2%', l: 'avg' },
            { v: '3min', l: 'last' },
            { v: '1', l: 'open' },
            { v: '0.38', l: 'score' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className={`text-xs font-bold ${s.amber ? 'text-terminal-amber' : 'text-terminal-green-dim'}`}>{s.v}</span>
              <span className="text-[9px] text-terminal-green-muted">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pnlHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              tick={{ fill: '#3a7a3a', fontSize: 9 }}
              axisLine={{ stroke: '#1a3a1a' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#3a7a3a', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#00ff88"
              strokeWidth={2}
              fill="url(#pnlGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#00ff88', stroke: '#00ff88' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
