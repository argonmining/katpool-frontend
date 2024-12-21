import { ofetch } from 'ofetch';
import type { 
  BalanceResponse, 
  UtxoResponse, 
  NetworkInfo, 
  BlockModel,
  TxModel,
  HalvingInfo
} from './types';

const BASE_URL = 'https://api.kaspa.org';

// Create an instance of ofetch with common config
const api = ofetch.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const KaspaAPI = {
  // Kaspa Addresses
  addresses: {
    getBalance: async (address: string): Promise<BalanceResponse> => {
      return await api(`/addresses/${address}/balance`);
    },

    getUtxos: async (address: string): Promise<UtxoResponse[]> => {
      return await api(`/addresses/${address}/utxos`);
    },

    getMultipleBalances: async (addresses: string[]): Promise<BalanceResponse[]> => {
      return await api('/addresses/balances', {
        method: 'POST',
        body: { addresses },
      });
    },

    getTransactions: async (address: string) => {
      return await api(`/addresses/${address}/transactions`);
    },

    getTransactionCount: async (address: string) => {
      return await api(`/addresses/${address}/transactions-count`);
    },
  },

  // Network Info
  network: {
    getInfo: async (): Promise<NetworkInfo> => {
      return await api('/info/network');
    },

    getBlockdag: async () => {
      return await api('/info/blockdag');
    },

    getCoinSupply: async () => {
      return await api('/info/coinsupply');
    },

    getCirculatingSupply: async (inBillion: boolean = false) => {
      return await api('/info/coinsupply/circulating', {
        query: { in_billion: inBillion },
      });
    },

    getPrice: async (stringOnly: boolean = false) => {
      return await api('/info/price', {
        query: { stringOnly },
      });
    },

    getHashrate: async (stringOnly: boolean = false) => {
      return await api('/info/hashrate', {
        query: { stringOnly },
      });
    },

    getBlockReward: async (stringOnly: boolean = false) => {
      return await api('/info/blockreward', {
        query: { stringOnly },
      });
    },

    getMarketCap: async (stringOnly: boolean = false) => {
      return await api('/info/marketcap', {
        query: { stringOnly },
      });
    },

    getFeeEstimate: async () => {
      return await api('/info/fee-estimate');
    },

    getMaxHashrate: async () => {
      return await api('/info/hashrate/max');
    },

    getHealth: async () => {
      return await api('/info/health');
    },

    getTotalSupply: async () => {
      return await api('/info/coinsupply/total');
    },

    getHalvingInfo: async (): Promise<HalvingInfo> => {
      return await api('/info/halving');
    },
  },

  // Blocks
  blocks: {
    getBlock: async (blockId: string, includeColor: boolean = false): Promise<BlockModel> => {
      return await api(`/blocks/${blockId}`, {
        query: { includeColor },
      });
    },

    getBlocks: async (lowHash: string, includeBlocks: boolean = false, includeTransactions: boolean = false) => {
      return await api('/blocks', {
        query: { lowHash, includeBlocks, includeTransactions },
      });
    },

    getBlocksFromBlueScore: async (blueScore: number = 43679173, includeTransactions: boolean = false) => {
      return await api('/blocks-from-bluescore', {
        query: { blueScore, includeTransactions },
      });
    },
  },

  // Transactions
  transactions: {
    getTransaction: async (
      txId: string, 
      inputs: boolean = true, 
      outputs: boolean = true, 
      resolvePreviousOutpoints: 'no' | 'light' | 'full' = 'no'
    ): Promise<TxModel> => {
      return await api(`/transactions/${txId}`, {
        query: { 
          inputs, 
          outputs, 
          resolve_previous_outpoints: resolvePreviousOutpoints 
        },
      });
    },

    submitTransaction: async (transaction: any, replaceByFee: boolean = false) => {
      return await api('/transactions', {
        method: 'POST',
        body: { transaction },
        query: { replaceByFee },
      });
    },

    calculateMass: async (transaction: any) => {
      return await api('/transactions/mass', {
        method: 'POST',
        body: transaction,
      });
    },

    searchTransactions: async (transactionIds: string[]) => {
      return await api('/transactions/search', {
        method: 'POST',
        body: { transactionIds },
      });
    },
  },
}; 