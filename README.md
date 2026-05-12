# APEXBOT — Questrade Trading Bot

Dual Moving Average (20/50) + RSI(14) strategy. Runs 24/7 as a Background Worker on Render.com.

## Strategy

**BUY** when all 3 are true:
- 20-day SMA crosses above 50-day SMA (golden cross)
- RSI(14) is below 65 (not overbought)
- No existing open position

**SELL** when any of these:
- 20-day SMA crosses below 50-day SMA (death cross)
- RSI(14) exceeds 75 (overbought)
- Price drops below your stop-loss % from entry

---

## Deploy to Render (Step by Step)

### 1. Get your Questrade refresh token
1. Log into questrade.com on desktop
2. Go to **My Account → Settings → API Centre**
3. Click **Generate New Token** — copy it immediately

> ⚠️ Questrade rotates refresh tokens on every use. The bot logs the new token each time
> it refreshes. If the service restarts, update `QUESTRADE_REFRESH_TOKEN` with the latest
> logged token, or it will fail to authenticate.

### 2. Push this repo to GitHub
```bash
git init
git add .
git commit -m "Initial bot"
git remote add origin https://github.com/YOUR_USERNAME/questrade-bot.git
git push -u origin main
```

### 3. Create a Background Worker on Render
1. Go to dashboard.render.com → **New → Background Worker**
2. Connect your GitHub repo
3. Set:
   - **Name**: apexbot
   - **Runtime**: Node
   - **Build Command**: (leave blank — no dependencies)
   - **Start Command**: `node bot.js`

### 4. Add environment variables in Render
Go to your service → **Environment** tab and add:

| Key | Value | Required |
|-----|-------|----------|
| `QUESTRADE_REFRESH_TOKEN` | Your token from API Centre | ✅ |
| `SYMBOL` | e.g. `SPY`, `XIU.TO`, `SHOP.TO` | default: SPY |
| `BUDGET_CAD` | Max to spend per position | default: 500 |
| `STOP_LOSS_PCT` | e.g. `3` for 3% | default: 3 |
| `INTERVAL_SEC` | Seconds between checks | default: 120 |
| `DRY_RUN` | `true` to run without placing real orders | default: false |

### 5. Deploy & monitor
- Click **Deploy** — Render starts the bot
- Watch logs in the Render dashboard
- **Start with `DRY_RUN=true`** to verify it connects and signals correctly before going live

---

## Important Notes

- Questrade charges commissions (~$4.95/trade) — factor this into your budget
- The bot uses **market orders** (fills at current price)
- Only trades **one position at a time** in the configured symbol
- Token rotation: always check logs for the `NEW REFRESH TOKEN` line if the service restarts

## Zero external dependencies
Uses only Node.js built-in `https` and `http` modules. No npm install needed.
