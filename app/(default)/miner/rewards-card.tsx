'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { $fetch } from 'ofetch'

interface Payout {
  walletAddress: string
  amount: number
  timestamp: number
  transactionHash: string
}

export default function AnalyticsCard02() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingBalance, setPendingBalance] = useState<string>('--')
  const [recentPayouts, setRecentPayouts] = useState<Payout[]>([])

  // Fetch pending balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const response = await $fetch(`/api/miner/balance?wallet=${walletAddress}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data');
        }

        if (response.status !== 'success' || !response.data?.result?.[0]?.value?.[1]) {
          setPendingBalance('--');
          return;
        }

        // Convert the string amount to BigInt and handle 8 decimal places
        const rawAmount = BigInt(response.data.result[0].value[1]);
        const amount = Number(rawAmount) / Math.pow(10, 8);
        if (!Number.isFinite(amount)) {
          throw new Error('Invalid amount received');
        }
        setPendingBalance(amount.toFixed(2));
        setError(null);
      } catch (error) {
        console.error('Error fetching pending balance:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setPendingBalance('ERR');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    // Refresh every minute
    const interval = setInterval(fetchBalance, 60000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  // Fetch recent payouts
  useEffect(() => {
    const fetchPayouts = async () => {
      if (!walletAddress) return;

      try {
        const response = await $fetch('/api/pool/payouts')
        if (response.status === 'success') {
          // Filter payouts for this wallet and take the 4 most recent
          const walletPayouts = response.data
            .filter((payout: Payout) => payout.walletAddress === walletAddress)
            .sort((a: Payout, b: Payout) => b.timestamp - a.timestamp)
            .slice(0, 4);
          setRecentPayouts(walletPayouts);
        }
      } catch (error) {
        console.error('Error fetching payouts:', error)
      }
    };

    fetchPayouts();
    // Refresh every minute
    const interval = setInterval(fetchPayouts, 60000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 3)}...${hash.slice(-3)}`
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Reward Payouts</h2>
      </header>
      <div className="grow px-5 py-4">
        <div className="flex items-end justify-between pr-10">
          <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{pendingBalance} KAS</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pending Balance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">-- NACHO</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pending Rebate</div>
          </div>
        </div>
      </div>
      <div className="grow px-5 pt-3 pb-1">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500">
              <tr>
                <th className="py-2">
                  <div className="font-semibold text-left">Recent Payouts</div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right">Reward</div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right">Rebate</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {recentPayouts.map((payout) => (
                <tr key={payout.transactionHash}>
                  <td className="py-2">
                    <div className="text-left text-gray-500">
                      {formatTimestamp(payout.timestamp)}
                      <span className="mx-2">•</span>
                      <a
                        href={`https://explorer.kaspa.org/txs/${payout.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-500 dark:hover:text-primary-400"
                      >
                        {formatTxHash(payout.transactionHash)}
                      </a>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-gray-800 dark:text-gray-100">
                      {formatAmount(payout.amount)} KAS
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-green-500">--</div>
                  </td>
                </tr>
              ))}
              {/* Fill remaining rows with placeholders if less than 4 payouts */}
              {Array.from({ length: Math.max(0, 4 - recentPayouts.length) }).map((_, index) => (
                <tr key={`placeholder-${index}`}>
                  <td className="py-2">
                    <div className="text-left text-gray-500">--</div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-gray-800 dark:text-gray-100">--</div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-green-500">--</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Card footer */}
      <div className="px-5 py-4">
        <div className="flex justify-end">
          <Link
            className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            href={`/payouts?wallet=${searchParams.get('wallet') || ''}`}
          >
            Full Payout History →
          </Link>
        </div>
      </div>
    </div>
  )
}
