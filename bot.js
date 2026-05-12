/**
 * APEXBOT — Questrade Trading Bot
 * Strategy: Dual Moving Average (20/50) + RSI(14) Filter
 * Deploy as a Background Worker on Render.com
 */

const https = require('https');
const http = require('http');

// ─── Config from environment variables ───────────────────
const CONFIG = {
  refreshToken:  process.env.QUESTRADE_REFRESH_TOKEN,
  symbol:        process.env.SYMBOL        || 'SPY',
  budgetCAD:     parseFloat(process.env.BUDGET_CAD    || '500'),
  stopLossPct:   parseFloat(process.env.STOP_LOSS_PCT || '3') / 100,
  intervalSec:   parseInt(process.env.INTERVAL_SEC    || '120'),
  // Set to 'true' to skip placing real orders (dry run / read-only mode)
  dryRun:        process.env.DRY_RUN === 'true',
};

// ─── Auth state ───────────────────────────────────────────
let auth = {
  accessToken: null,
  apiServer:   null,
  expiresAt:   0,
  // Questrade issues a NEW refresh token each time you use one
  currentRefreshToken: CONFIG.refreshToken,
};

// ─── State ────────────────────────────────────────────────
let state = {
  accountId:  null,
  trades:     0,
  checks:     0,
};

// ─── Logging ──────────────────────────────────────────────
function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] ${msg}`);
}

function logError(msg, err) {
  log(`${msg}: ${err?.message || err}`, 'ERROR');
}

// ─── HTTP helper ──────────────────────────────────────────
function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   options.method || 'GET',
      headers:  options.headers || {},
    };

    const req = lib.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch { resolve(data); }
        } else {
          let errMsg = `HTTP ${res.statusCode}`;
          try {
            const parsed = JSON.parse(data);
            errMsg += `: ${parsed.message || parsed.error || data}`;
          } catch { errMsg += `: ${data}`; }
          reject(new Error(errMsg));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

// ─── Questrade Auth ───────────────────────────────────────
async function refreshAccessToken() {
  log('Refreshing Questrade access token...');
  const url = `https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(auth.currentRefreshToken)}`;
  const data = await request(url, { method: 'POST' });

  auth.accessToken = data.access_token;
  auth.apiServer   = data.api_server.replace(/\/$/, '');
  auth.expiresAt   = Date.now() + (data.expires_in - 60) * 1000; // 60s buffer
  // Questrade rotates refresh tokens — always save the new one
  auth.currentRefreshToken = data.refresh_token;

  log(`Token refreshed. Server: ${auth.apiServer} | Expires in: ${data.expires_in}s`);
  log(`⚠️  NEW REFRESH TOKEN: ${data.refresh_token} — update your env var if this restarts`);
}

async function ensureToken() {
  if (!auth.accessToken || Date.now() >= auth.expiresAt) {
    await refreshAccessToken();
  }
}

function authHeaders() {
  return {
    'Authorization': `Bearer ${auth.accessToken}`,
    'Content-Type':  'application/json',
  };
}

// ─── Questrade API ────────────────────────────────────────
async function getAccounts() {
  return request(`${auth.apiServer}/v1/accounts`, { headers: authHeaders() });
}

async function getPositions(accountId) {
  return request(`${auth.apiServer}/v1/accounts/${accountId}/positions`, { headers: authHeaders() });
}

async function getBalances(accountId) {
  return request(`${auth.apiServer}/v1/accounts/${accountId}/balances`, { headers: authHeaders() });
}

async function searchSymbol(symbol) {
  const data = await request(
    `${auth.apiServer}/v1/symbols/search?prefix=${encodeURIComponent(symbol)}&offset=0`,
    { headers: authHeaders() }
  );
  const symbols = data.symbols || [];
  if (symbols.length === 0) throw new Error(`Symbol not found: ${symbol}`);
  return symbols.find(s => s.symbol === symbol) || symbols[0];
}

async function getCandles(symbolId, startTime, endTime) {
  const url = `${auth.apiServer}/v1/markets/candles/${symbolId}` +
    `?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&interval=OneDay`;
  const data = await request(url, { headers: authHeaders() });
  return data.candles || [];
}

async function placeOrder(accountId, symbolId, qty, action) {
  const body = {
    accountNumber: String(accountId),
    symbolId,
    quantity:        qty,
    icebergQuantity: 0,
    isAllOrNone:     false,
    isAnonymous:     false,
    orderType:       'Market',
    timeInForce:     'Day',
    action,           // 'Buy' or 'Sell'
    primaryRoute:    'AUTO',
    secondaryRoute:  'AUTO',
  };

  if (CONFIG.dryRun) {
    log(`[DRY RUN] Would place ${action} order: ${qty} × symbolId ${symbolId}`);
    return { orders: [{ id: 'DRY_RUN', status: 'DryRun' }] };
  }

  return request(
    `${auth.apiServer}/v1/accounts/${accountId}/orders`,
    { method: 'POST', headers: authHeaders() },
    body
  );
}

// ─── Indicators ───────────────────────────────────────────
function sma(closes, period) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function rsi(closes, period = 14) {
  if (closes.length < period + 1) return null;
  const slice = closes.slice(-(period + 1));
  let gains = 0, losses = 0;
  for (let i = 1; i < slice.length; i++) {
    const diff = slice[i] - slice[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

// ─── Core trading tick ────────────────────────────────────
async function tick() {
  state.checks++;
  log(`--- Tick #${state.checks} | Symbol: ${CONFIG.symbol} | Total trades: ${state.trades} ---`);

  await ensureToken();

  // 1. Fetch historical candles (~110 calendar days ≈ 70+ trading days)
  const endDate   = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 110);
  const fmt = d => d.toISOString().split('.')[0] + '-05:00';

  const symInfo  = await searchSymbol(CONFIG.symbol);
  const symbolId = symInfo.symbolId;
  log(`Symbol resolved: ${symInfo.symbol} (ID: ${symbolId})`);

  const candles = await getCandles(symbolId, fmt(startDate), fmt(endDate));
  if (candles.length < 52) {
    log(`Only ${candles.length} candles available — need 52+. Skipping tick.`, 'WARN');
    return;
  }

  const closes = candles.map(c => c.close);
  const price  = closes[closes.length - 1];

  // Calculate indicators
  const ma20     = sma(closes, 20);
  const ma50     = sma(closes, 50);
  const ma20prev = sma(closes.slice(0, -1), 20);
  const ma50prev = sma(closes.slice(0, -1), 50);
  const rsiVal   = rsi(closes, 14);

  log(`Price: $${price.toFixed(2)} | MA20: ${ma20?.toFixed(2)} | MA50: ${ma50?.toFixed(2)} | RSI: ${rsiVal?.toFixed(1)}`);

  // 2. Check open position
  const posData = await getPositions(state.accountId);
  const pos     = (posData.positions || []).find(
    p => p.symbol === CONFIG.symbol && p.openQuantity > 0
  );

  if (pos) {
    // ── We have a position ──────────────────────────────
    const qty        = pos.openQuantity;
    const entryPrice = pos.averageEntryPrice;
    const unrealPL   = pos.openPnl || 0;
    const pct        = (price - entryPrice) / entryPrice;

    log(`Holding ${qty} × ${CONFIG.symbol} | Entry: $${entryPrice.toFixed(2)} | P&L: $${unrealPL.toFixed(2)} (${(pct*100).toFixed(2)}%)`);

    // Stop-loss
    if (pct <= -CONFIG.stopLossPct) {
      log(`STOP-LOSS triggered at ${(pct*100).toFixed(2)}% — placing SELL order`, 'WARN');
      const order = await placeOrder(state.accountId, symbolId, qty, 'Sell');
      state.trades++;
      log(`SELL order placed (stop-loss). Order: ${JSON.stringify(order?.orders?.[0])}`);
      return;
    }

    // Death cross or overbought
    const deathCross = ma20prev >= ma50prev && ma20 < ma50;
    const overbought = rsiVal > 75;

    if (deathCross || overbought) {
      const reason = deathCross ? 'death cross (MA20 < MA50)' : `RSI overbought (${rsiVal.toFixed(1)})`;
      log(`SELL signal: ${reason} — placing SELL order`);
      const order = await placeOrder(state.accountId, symbolId, qty, 'Sell');
      state.trades++;
      log(`SELL order placed. Est. P&L: $${unrealPL.toFixed(2)}. Order: ${JSON.stringify(order?.orders?.[0])}`);
    } else {
      log('No sell signal — holding position.');
    }

  } else {
    // ── No position ─────────────────────────────────────
    const goldenCross   = ma20prev <= ma50prev && ma20 > ma50;
    const notOverbought = rsiVal < 65;

    if (goldenCross && notOverbought) {
      // Check available cash
      const balData = await getBalances(state.accountId);
      const cadBal  = (balData.perCurrencyBalances || []).find(b => b.currency === 'CAD');
      const cash    = cadBal ? cadBal.cash : 0;
      const maxSpend = Math.min(CONFIG.budgetCAD, cash);
      const shares   = Math.floor(maxSpend / price);

      log(`BUY signal: golden cross + RSI ${rsiVal.toFixed(1)} | Cash: $${cash.toFixed(2)} CAD | Can buy: ${shares} shares`);

      if (shares < 1) {
        log(`Insufficient cash ($${cash.toFixed(2)}) to buy 1 share at $${price.toFixed(2)}`, 'WARN');
        return;
      }

      const order = await placeOrder(state.accountId, symbolId, shares, 'Buy');
      state.trades++;
      log(`BUY order placed: ${shares} × ${CONFIG.symbol} @ ~$${price.toFixed(2)}. Order: ${JSON.stringify(order?.orders?.[0])}`);

    } else {
      const reason = !goldenCross
        ? `no golden cross (MA20=${ma20?.toFixed(2)} MA50=${ma50?.toFixed(2)})`
        : `RSI too high (${rsiVal.toFixed(1)})`;
      log(`No buy signal — ${reason}.`);
    }
  }
}

// ─── Startup ──────────────────────────────────────────────
async function init() {
  log('========================================');
  log(' APEXBOT starting up');
  log(`  Symbol:    ${CONFIG.symbol}`);
  log(`  Budget:    $${CONFIG.budgetCAD} CAD`);
  log(`  Stop-loss: ${(CONFIG.stopLossPct * 100).toFixed(1)}%`);
  log(`  Interval:  ${CONFIG.intervalSec}s`);
  log(`  Dry run:   ${CONFIG.dryRun}`);
  log('========================================');

  if (!CONFIG.refreshToken) {
    log('QUESTRADE_REFRESH_TOKEN env var is not set. Exiting.', 'ERROR');
    process.exit(1);
  }

  // Authenticate
  await refreshAccessToken();

  // Get primary account
  const acctData = await getAccounts();
  const accounts  = acctData.accounts || [];
  if (accounts.length === 0) throw new Error('No accounts found on this token');

  const primary     = accounts.find(a => a.isPrimary) || accounts[0];
  state.accountId   = primary.number;
  log(`Account: ${primary.type} #${state.accountId} | Status: ${primary.status}`);

  // Run first tick immediately, then on interval
  await tick();
  setInterval(async () => {
    try {
      await tick();
    } catch (err) {
      logError('Tick failed', err);
      // If auth error, force a token refresh next tick
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        auth.expiresAt = 0;
      }
    }
  }, CONFIG.intervalSec * 1000);
}

// ─── Run ──────────────────────────────────────────────────
init().catch(err => {
  logError('Fatal startup error', err);
  process.exit(1);
});
