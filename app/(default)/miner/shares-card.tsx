'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import BarChart03 from '@/components/charts/bar-chart-03'
import { tailwindConfig } from '@/components/utils/utils'
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

const COLORS = [
  { bg: tailwindConfig.theme.colors.primary[700], hover: tailwindConfig.theme.colors.primary[800] },
  { bg: tailwindConfig.theme.colors.primary[500], hover: tailwindConfig.theme.colors.primary[600] },
  { bg: tailwindConfig.theme.colors.primary[300], hover: tailwindConfig.theme.colors.primary[400] },
  { bg: tailwindConfig.theme.colors.primary[100], hover: tailwindConfig.theme.colors.primary[200] },
];

export default function AnalyticsCard03() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const response = await $fetch(`/api/miner/sharesHistory?wallet=${walletAddress}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data');
        }

        // Transform the data for the chart
        const results: SharesData[] = response.data.result;
        if (!results || results.length === 0) {
          throw new Error('No data available');
        }

        // Create an array of the last 7 days (including today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Array.from({length: 7}, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));  // Start 6 days ago, end with today
          return Math.floor(date.getTime() / 1000);
        }).reverse();  // Reverse to get oldest first

        // Format dates for labels
        const labels = days.map(timestamp => 
          new Date(timestamp * 1000).toISOString().split('T')[0]  // Use ISO date format
        );

        // Create datasets for each miner
        const datasets = results.map((result, index) => {
          const colorIndex = index % COLORS.length;
          return {
            label: result.metric.miner_id,
            data: days.map(targetTimestamp => {
              // Convert target timestamp to date string for comparison
              const targetDate = new Date(targetTimestamp * 1000);
              targetDate.setHours(0, 0, 0, 0);
              const targetDateStr = targetDate.toISOString().split('T')[0];
              
              // Find matching data point
              const dataPoint = result.values.find(([timestamp, _]) => {
                const dataDate = new Date(timestamp * 1000);
                dataDate.setHours(0, 0, 0, 0);
                return dataDate.toISOString().split('T')[0] === targetDateStr;
              });
              
              return dataPoint ? Number(dataPoint[1]) : 0;
            }),
            backgroundColor: COLORS[colorIndex].bg,
            hoverBackgroundColor: COLORS[colorIndex].hover,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
            borderRadius: 4,
          };
        });

        setChartData({
          labels,
          datasets,
        });

        setError(null);
      } catch (error) {
        console.error('Error fetching shares data:', error);
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

  return(
    <div className="relative flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Shares by Worker</h2>
      </header>

      <div className="grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-[248px]">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[248px] text-red-500">{error}</div>
        ) : chartData ? (
          <BarChart03 data={chartData} width={595} height={248} />
        ) : null}
      </div>
    </div>
  )
}
