// src/services/api/walletService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export interface WalletResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CoinPackage {
  _id: string;
  id: string;
  name: string;        // e.g. "Starter Pack", "Elite Pack"
  coins: number;       // base coins granted
  bonusCoins: number;  // bonus coins (may be 0)
  priceUSD: number;    // base price in USD (App Store/Play Store IAP base)
  currency: string;    // "USD" (base currency from backend)
  productId: string;   // store product ID for IAP (platformProductId)
  isActive: boolean;
}

export interface CoinAction {
  _id: string;
  actionKey: string;  // e.g. "swipe", "super_like", "boost"
  label: string;      // display label
  cost: number;       // coins required
  isActive: boolean;
}

export interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  source: string;
  description: string;
  createdAt: string;
}

// ─── Get Balance ─────────────────────────────────────────────
// GET /api/wallet/balance

const getBalance = async (): Promise<WalletResponse> => {
  try {
    devLog('💰 Wallet: Fetching balance');
    const response = await apiClient.get('/api/wallet/balance');
    return {
      success: true,
      message: 'Balance fetched',
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    errorLog('Wallet getBalance error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch balance',
    };
  }
};

// ─── Get Coin Packages ───────────────────────────────────────
// GET /api/wallet/packages

const getPackages = async (): Promise<WalletResponse> => {
  try {
    devLog('📦 Wallet: Fetching packages');
    const response = await apiClient.get('/api/wallet/packages');
    // Backend returns { data: { packages: [...] } }
    const raw: any[] =
      response.data?.data?.packages ||
      response.data?.data ||
      response.data ||
      [];
    // Normalize backend shape → CoinPackage shape, keep only USD packages (IAP products)
    const packages: CoinPackage[] = (Array.isArray(raw) ? raw : [])
      .filter((p: any) => p.isActive && (p.currency === 'USD' || !p.currency))
      .map((p: any) => ({
        _id: p._id,
        id: p._id,
        name: p.label || p.name || '',
        coins: p.coins ?? 0,
        bonusCoins: p.bonus ?? p.bonusCoins ?? 0,
        priceUSD: p.price ?? 0,
        currency: p.currency ?? 'NGN',
        productId: p.platformProductId || p.productId || p._id,
        isActive: p.isActive,
      }));
    return {
      success: true,
      message: 'Packages fetched',
      data: packages,
    };
  } catch (error: any) {
    errorLog('Wallet getPackages error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch packages',
    };
  }
};

// ─── Get Coin-Gated Actions ──────────────────────────────────
// GET /api/wallet/actions

const getActions = async (): Promise<WalletResponse> => {
  try {
    devLog('🎯 Wallet: Fetching actions');
    const response = await apiClient.get('/api/wallet/actions');
    return {
      success: true,
      message: 'Actions fetched',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Wallet getActions error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch actions',
    };
  }
};

// ─── Get Transaction History ─────────────────────────────────
// GET /api/wallet/transactions

const getTransactions = async (limit = 20, offset = 0): Promise<WalletResponse> => {
  try {
    devLog('📜 Wallet: Fetching transactions', { limit, offset });
    const response = await apiClient.get('/api/wallet/transactions', {
      params: { limit, offset },
    });
    return {
      success: true,
      message: 'Transactions fetched',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Wallet getTransactions error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch transactions',
    };
  }
};

// ─── Purchase Coins ──────────────────────────────────────────
// POST /api/wallet/purchase
// platform: 'android' | 'ios' | 'mock'
// Use 'mock' for testing without a real payment gateway.

const purchase = async (
  platform: 'android' | 'ios' | 'mock',
  productId: string,
  receiptToken: string,
): Promise<WalletResponse> => {
  try {
    devLog('💳 Wallet: Purchasing', productId, 'on', platform);
    const response = await apiClient.post('/api/wallet/purchase', {
      platform,
      productId,
      receiptToken,
    });
    return {
      success: true,
      message: response.data?.message || 'Purchase successful',
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    errorLog('Wallet purchase error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Purchase failed',
    };
  }
};

// ─── Spend Coins ─────────────────────────────────────────────
// POST /api/wallet/spend

const spend = async (actionKey: string): Promise<WalletResponse> => {
  try {
    devLog('💸 Wallet: Spending coins for action:', actionKey);
    const response = await apiClient.post('/api/wallet/spend', { actionKey });
    return {
      success: true,
      message: response.data?.message || 'Coins spent',
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    errorLog('Wallet spend error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to spend coins',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const walletService = {
  getBalance,
  getPackages,
  getActions,
  getTransactions,
  purchase,
  spend,
};

export default walletService;
