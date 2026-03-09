// src/services/api/fxService.ts
// Fetches live USD exchange rates and converts prices for display.
// Uses open.er-api.com — free, no API key required.
// Rates are cached in-memory for 1 hour to avoid redundant fetches.

import { devLog, errorLog } from '@config/environment';

const FX_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface RateCache {
  rates: Record<string, number>;
  timestamp: number;
}

let _cache: RateCache | null = null;

const getRates = async (): Promise<Record<string, number>> => {
  const now = Date.now();
  if (_cache && now - _cache.timestamp < CACHE_TTL_MS) {
    devLog('💱 FX: using cached rates');
    return _cache.rates;
  }
  try {
    devLog('💱 FX: fetching live rates');
    const response = await fetch(FX_URL);
    const data = await response.json();
    if (data.result === 'success' && data.rates) {
      _cache = { rates: data.rates, timestamp: now };
      return data.rates;
    }
  } catch (err) {
    errorLog('FX fetch error:', err);
  }
  return {};
};

/**
 * Convert a USD amount to the target currency.
 * Returns { amount, currency } — currency may fall back to 'USD' if rate unavailable.
 */
export const convertFromUSD = async (
  usdAmount: number,
  targetCurrency: string,
): Promise<{ amount: number; currency: string }> => {
  const rates = await getRates();
  const rate = rates[targetCurrency];
  if (!rate) return { amount: usdAmount, currency: 'USD' };
  return { amount: usdAmount * rate, currency: targetCurrency };
};

/**
 * Format a number as a currency string using the device locale.
 * e.g. formatCurrency(5000, 'NGN') → '₦5,000'
 *      formatCurrency(3.99, 'USD') → '$3.99'
 */
export const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
};
