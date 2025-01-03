'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { $fetch } from 'ofetch'

export default function AnalyticsCard02() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingBalance, setPendingBalance] = useState<string>('--')

  useEffect(() => {
    const fetchData = async () => {
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
          throw new Error('Invalid response format');
        }

        const rawBalance = response.data.result[0].value[1];
        const balance = Number(BigInt(rawBalance)) / (10 ** 8);
        setPendingBalance(balance.toFixed(2));
        setError(null);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setPendingBalance('--');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

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
      <div className="grow px-5 pt-3 pb-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{pendingBalance} KAS</div>
            <div className="text-sm text-gray-500">Pending Balance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500 mr-2">-- NACHO</div>
            <div className="text-sm text-gray-400">Pending Rebate</div>
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
                  <div className="font-semibold text-right"></div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right"></div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Row */}
              <tr>
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
              {/* Row */}
              <tr>
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
              {/* Row */}
              <tr>
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
              {/* Row */}
              <tr>
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
