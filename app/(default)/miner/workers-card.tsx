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

interface WorkerHashrateData {
  metric: {
    __name__: string;
    wallet_address: string;
    miner_id: string;
    [key: string]: string;
  };
  averages: {
    fifteenMin: number;
    oneHour: number;
    twelveHour: number;
    twentyFourHour: number;
  };
}

interface WorkerData {
  minerId: string;
  totalShares: number;
  invalidShares?: number;
  duplicatedShares?: number;
  jobsNotFound?: number;
  lastShareTimestamp: number;
  hashrates: {
    fifteenMin: number;
    oneHour: number;
    twelveHour: number;
    twentyFourHour: number;
  };
}

interface Worker {
  metric: {
    __name__: string;
    wallet_address: string;
    worker_name: string;
  };
  currentHashrate: number;
  averages: {
    oneHour: number;
    twelveHour: number;
    twentyFourHour: number;
  };
}

export default function AnalyticsCard11() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workers, setWorkers] = useState<WorkerData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        
        // Fetch data from all endpoints
        const [totalSharesRes, /* invalidSharesRes, duplicatedSharesRes, jobsNotFoundRes, */ hashrateRes] = await Promise.all([
          $fetch(`/api/miner/shares?wallet=${walletAddress}`, {
            retry: 3,
            retryDelay: 1000,
            timeout: 10000,
          }),
          /* $fetch(`/api/miner/invalidShares?wallet=${walletAddress}`, {
            retry: 3,
            retryDelay: 1000,
            timeout: 10000,
          }),
          $fetch(`/api/miner/duplicatedShares?wallet=${walletAddress}`, {
            retry: 3,
            retryDelay: 1000,
            timeout: 10000,
          }),
          $fetch(`/api/miner/jobsNotFound?wallet=${walletAddress}`, {
            retry: 3,
            retryDelay: 1000,
            timeout: 10000,
          }), */
          $fetch(`/api/miner/workerHashrate?wallet=${walletAddress}`, {
            retry: 3,
            retryDelay: 1000,
            timeout: 10000,
          })
        ]);

        // Process hashrate data
        const hashrateMap = new Map<string, { 
          fifteenMin: number;
          oneHour: number;
          twelveHour: number;
          twentyFourHour: number;
        }>();

        if (hashrateRes?.status === 'success' && hashrateRes.data?.result) {
          hashrateRes.data.result.forEach((result: any) => {
            const minerId = result.metric.miner_id;
            hashrateMap.set(minerId, result.averages);
          });
        }

        // Process total shares data
        const totalSharesMap = new Map<string, { shares: number; timestamp: number }>();
        if (totalSharesRes?.data?.result) {
          totalSharesRes.data.result.forEach((result: SharesData) => {
            totalSharesMap.set(result.metric.miner_id, {
              shares: Number(result.values[0][1]),
              timestamp: result.values[0][0]
            });
          });
        }

        /* // Process invalid shares data
        const invalidSharesMap = new Map<string, number>();
        if (invalidSharesRes?.data?.result) {
          invalidSharesRes.data.result.forEach((result: SharesData) => {
            invalidSharesMap.set(result.metric.miner_id, Number(result.values[0][1]));
          });
        }

        // Process duplicated shares data
        const duplicatedSharesMap = new Map<string, number>();
        if (duplicatedSharesRes?.data?.result) {
          duplicatedSharesRes.data.result.forEach((result: SharesData) => {
            duplicatedSharesMap.set(result.metric.miner_id, Number(result.values[0][1]));
          });
        }

        // Process jobs not found data
        const jobsNotFoundMap = new Map<string, number>();
        if (jobsNotFoundRes?.data?.result) {
          jobsNotFoundRes.data.result.forEach((result: SharesData) => {
            jobsNotFoundMap.set(result.metric.miner_id, Number(result.values[0][1]));
          });
        } */

        // Combine all data
        const processedWorkers: WorkerData[] = Array.from(totalSharesMap.entries()).map(([minerId, data]) => ({
          minerId,
          totalShares: data.shares,
          /* invalidShares: invalidSharesMap.get(minerId) || 0,
          duplicatedShares: duplicatedSharesMap.get(minerId) || 0,
          jobsNotFound: jobsNotFoundMap.get(minerId) || 0, */
          lastShareTimestamp: data.timestamp,
          hashrates: hashrateMap.get(minerId) || {
            fifteenMin: 0,
            oneHour: 0,
            twelveHour: 0,
            twentyFourHour: 0,
          },
        }));

        setWorkers(processedWorkers);
        setError(null);
      } catch (error) {
        console.error('Error fetching worker data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
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

  const formatHashrate = (hashrate: number | null) => {
    if (hashrate === null) return '--';
    
    // Input is in GH/s, we can scale both up and down
    const units = ['MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
    let unitIndex = 1; // Start at GH/s (index 1)
    let value = hashrate;

    // Scale down if less than 1 GH/s
    if (value < 1) {
      value *= 1000; // Convert to MH/s
      unitIndex = 0;
    }
    
    // Scale up if needed
    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000;
      unitIndex++;
    }
    
    return `${value.toFixed(2)} ${units[unitIndex]}`;
  };

  const getWorkerStatus = (worker: WorkerData) => {
    const secondsSinceLastShare = Date.now() / 1000 - worker.lastShareTimestamp;
    const isOnline = secondsSinceLastShare < 300; // 5 minutes
    return isOnline ? 'online' : 'offline';
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
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="p-2 whitespace-nowrap w-1/4">
                    <div className="font-semibold text-left">Worker Name</div>
                  </th>
                  <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-center">15min Hashrate</div>
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
                    <div className="font-semibold text-center">Accepted</div>
                  </th>
                  {/* <th className="p-2 whitespace-nowrap w-[11%]">
                    <div className="font-semibold text-center">Rejected</div>
                  </th> */}
                  <th className="p-2 whitespace-nowrap w-[10%]">
                    <div className="font-semibold text-center">Last Share</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {workers.map((worker) => {
                  const secondsSinceLastShare = Date.now() / 1000 - worker.lastShareTimestamp;
                  const isOnline = secondsSinceLastShare < 300; // 5 minutes
                  
                  // const rejectedShares = worker.invalidShares + worker.duplicatedShares + worker.jobsNotFound;

                  return (
                    <tr key={worker.minerId}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`shrink-0 rounded-full mr-2 sm:mr-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'} w-2 h-2`}></div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">{worker.minerId}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">{formatHashrate(worker.hashrates.fifteenMin)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">{formatHashrate(worker.hashrates.oneHour)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">{formatHashrate(worker.hashrates.twelveHour)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">{formatHashrate(worker.hashrates.twentyFourHour)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center text-green-500">{worker.totalShares}</div>
                      </td>
                      {/* <td className="p-2 whitespace-nowrap">
                        <div className="text-center text-red-500">{rejectedShares}</div>
                      </td> */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          {formatTimeAgo(worker.lastShareTimestamp)}
                        </div>
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
