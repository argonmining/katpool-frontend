'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { $fetch } from 'ofetch'

interface SharesData {
  metric: {
    __name__: string;
    miner_id: string;
    wallet_address: string;
    [key: string]: string;
  };
  values: [number, string][];
}

export default function AnalyticsCard11() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workers, setWorkers] = useState<SharesData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const response = await $fetch(`/api/miner/shares?wallet=${walletAddress}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data');
        }

        const results: SharesData[] = response.data.result;
        if (!results || results.length === 0) {
          throw new Error('No data available');
        }

        setWorkers(results);
        setError(null);
      } catch (error) {
        console.error('Error fetching worker data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff >= 12 * 60 * 60) {
      return '12+ hours ago';
    }

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Worker Details</h2>
      </header>
      <div className="p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              {/* Table header */}
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
                <tr>
                  <th className="p-2 whitespace-nowrap w-1/4">
                    <div className="font-semibold text-left">Worker Name</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-left">15min Hashrate</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-center">1h Hashrate</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-center">12h Hashrate</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-center">24h Hashrate</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-center">Accepted Shares</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[10%]">
                    <div className="font-semibold text-center">Last Share</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[10%]">
                    <div className="font-semibold text-center">Online For</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {workers.map((worker) => {
                  const lastShareTimestamp = worker.values[0][0];
                  const lastShareValue = worker.values[0][1];
                  
                  const isOnline = (Date.now() / 1000 - lastShareTimestamp < 300) && 
                                  (Date.now() / 1000 - lastShareTimestamp < 12 * 60 * 60);

                  return (
                    <tr key={worker.metric.miner_id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`shrink-0 rounded-full mr-2 sm:mr-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'} w-9 h-9 overflow-hidden`}>
                            <Image
                              src="/images/iceriver.png"
                              alt="Iceriver"
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">{worker.metric.miner_id}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">--</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">--</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">--</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">--</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">{lastShareValue}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          {formatTimeAgo(lastShareTimestamp)}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">--</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
