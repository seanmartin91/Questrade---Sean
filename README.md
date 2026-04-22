# Wallet Hunter 🎯

A real-time crypto wallet tracking dashboard built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

![Wallet Hunter Dashboard](./public/preview.png)

## Features

- 📊 Live P&L chart with area visualization
- 👛 Wallet tracker with smart/degen/whale tags
- 🏆 Top wallets leaderboard with win streaks
- ⚡ Active trade monitoring
- 📋 Closed position history
- 🎯 Bullet plan with net P&L target
- 🔴 Live indicator with scanline terminal aesthetic

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deploy to Vercel

### Option 1 — One-click deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Click **Deploy** — Vercel auto-detects Next.js, no config needed

### Option 2 — Vercel CLI
```bash
npm i -g vercel
vercel
```

## Project Structure

```
wallet-hunter/
├── app/
│   ├── globals.css       # Tailwind + scanline styles
│   ├── layout.tsx        # Root layout with font
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── Header.tsx        # Top stats bar
│   ├── WalletTracker.tsx # Wallet list panel
│   ├── TopWallets.tsx    # Leaderboard panel
│   ├── ActiveTrades.tsx  # Open positions panel
│   ├── PnLChart.tsx      # Recharts area chart
│   ├── ClosedPositions.tsx
│   └── BulletPlan.tsx
├── lib/
│   └── data.ts           # Mock data + TypeScript types
├── tailwind.config.js
└── next.config.js
```

## Customization

Replace the mock data in `lib/data.ts` with your real API calls. Each component is self-contained and accepts data from the shared lib.

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) — P&L chart
- [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) — Terminal font
