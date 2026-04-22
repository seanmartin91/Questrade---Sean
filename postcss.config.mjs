export type Wallet = {
  addr: string
  tag: 'smart' | 'degen' | 'whale'
  pct: string
  pos: boolean
  vol: string
  txCount: number
}

export type TopWallet = {
  addr: string
  wins: number
  pnl: string
  streak: number
  winRate: string
}

export type Trade = {
  token: string
  entry: string
  now: string
  pct: string
  pos: boolean
  age: string
  mcap: string
}

export type ClosedPosition = {
  token: string
  pnl: string
  pct: string
  pos: boolean
  duration: string
}

export type PnlPoint = {
  t: string
  v: number
}

export const wallets: Wallet[] = [
  { addr: '0x7f3a...e9b2', tag: 'smart', pct: '+48.3%', pos: true, vol: '$2.1k', txCount: 47 },
  { addr: '0xDeadBeef...31f', tag: 'degen', pct: '+31.5%', pos: true, vol: '$890', txCount: 182 },
  { addr: '0xa91c...bb7d', tag: 'smart', pct: '+22.1%', pos: true, vol: '$4.3k', txCount: 23 },
  { addr: '0x1234...5678', tag: 'whale', pct: '-4.2%', pos: false, vol: '$18k', txCount: 9 },
  { addr: '0xc0de...cafe', tag: 'degen', pct: '+9.7%', pos: true, vol: '$560', txCount: 341 },
  { addr: '0xfeed...babe', tag: 'smart', pct: '-1.8%', pos: false, vol: '$1.2k', txCount: 61 },
  { addr: '0xb33f...a1d2', tag: 'degen', pct: '+17.4%', pos: true, vol: '$320', txCount: 98 },
  { addr: '0x9c2f...0012', tag: 'whale', pct: '+5.1%', pos: true, vol: '$42k', txCount: 6 },
]

export const topWallets: TopWallet[] = [
  { addr: '0x7f3a...e9b2', wins: 47, pnl: '+$4.2k', streak: 7, winRate: '81%' },
  { addr: '0xa91c...bb7d', wins: 38, pnl: '+$2.8k', streak: 4, winRate: '74%' },
  { addr: '0xc0de...cafe', wins: 29, pnl: '+$1.1k', streak: 2, winRate: '62%' },
  { addr: '0xDeadBeef...31f', wins: 21, pnl: '+$780', streak: 3, winRate: '55%' },
  { addr: '0xfeed...babe', wins: 14, pnl: '+$310', streak: 1, winRate: '48%' },
]

export const activeTrades: Trade[] = [
  { token: '$PEPE2', entry: '0.0000041', now: '0.0000053', pct: '+29.3%', pos: true, age: '3m', mcap: '$2.1M' },
  { token: '$WOJAK', entry: '0.00018', now: '0.00021', pct: '+16.7%', pos: true, age: '11m', mcap: '$890k' },
  { token: '$BASED', entry: '0.0072', now: '0.0069', pct: '-4.2%', pos: false, age: '22m', mcap: '$5.4M' },
]

export const closedPositions: ClosedPosition[] = [
  { token: '$DOGE2', pnl: '+$140', pct: '+42%', pos: true, duration: '8m' },
  { token: '$FLOKI3', pnl: '+$88', pct: '+31%', pos: true, duration: '14m' },
  { token: '$COPE', pnl: '-$44', pct: '-18%', pos: false, duration: '3m' },
  { token: '$BONK2', pnl: '+$212', pct: '+67%', pos: true, duration: '31m' },
  { token: '$WIF2', pnl: '-$19', pct: '-8%', pos: false, duration: '5m' },
  { token: '$POPCAT', pnl: '+$56', pct: '+22%', pos: true, duration: '19m' },
]

export const pnlHistory: PnlPoint[] = [
  { t: '00:00', v: 0 }, { t: '00:05', v: 12 }, { t: '00:10', v: 8 },
  { t: '00:15', v: 28 }, { t: '00:20', v: 22 }, { t: '00:25', v: 45 },
  { t: '00:30', v: 38 }, { t: '00:35', v: 62 }, { t: '00:40', v: 55 },
  { t: '00:45', v: 80 }, { t: '00:50', v: 72 }, { t: '00:55', v: 98 },
  { t: '01:00', v: 88 }, { t: '01:05', v: 115 }, { t: '01:10', v: 104 },
  { t: '01:15', v: 132 }, { t: '01:20', v: 121 }, { t: '01:25', v: 148 },
  { t: '01:30', v: 138 }, { t: '01:35', v: 162 }, { t: '01:40', v: 155 },
  { t: '01:45', v: 178 }, { t: '01:50', v: 170 }, { t: '01:55', v: 192 },
  { t: '02:00', v: 185 }, { t: '02:05', v: 210 }, { t: '02:10', v: 198 },
  { t: '02:15', v: 224 }, { t: '02:20', v: 215 }, { t: '02:25', v: 242 },
  { t: '02:30', v: 230 }, { t: '02:35', v: 258 }, { t: '02:40', v: 248 },
  { t: '02:45', v: 270 }, { t: '02:50', v: 262 }, { t: '02:55', v: 285 },
  { t: '03:00', v: 312 },
]

export const bulletPlan = [
  { label: 'Entry budget', val: '$500' },
  { label: 'Target exit', val: '+35%' },
  { label: 'Stop loss', val: '-12%' },
  { label: 'Max trades', val: '4' },
  { label: 'Time limit', val: '90min' },
  { label: 'Net plan', val: '+$400.48' },
]

export const headerStats = [
  { val: '+$312', label: 'P&L', color: 'green' as const },
  { val: '6', label: 'wallets', color: 'white' as const },
  { val: '12.6%', label: 'win rate', color: 'amber' as const },
  { val: '1.2%', label: 'avg trade', color: 'white' as const },
  { val: '3min', label: 'last buy', color: 'white' as const },
  { val: '1', label: 'active', color: 'white' as const },
  { val: '14,000', label: 'tokens', color: 'white' as const },
]
