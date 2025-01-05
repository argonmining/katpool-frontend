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

        // Group values by day and get the highest value for each day
        const dailyGroups = results.reduce((acc, result) => {
          result.values.forEach(([timestamp, value]) => {
            const date = new Date(timestamp * 1000);
            const dayKey = date.toISOString().split('T')[0];
            const numValue = Number(value);
            
            // Keep track of the highest value for each day
            if (!acc[dayKey] || numValue > acc[dayKey].value) {
              acc[dayKey] = { 
                value: numValue,
                timestamp: timestamp 
              };
            }
          });
          return acc;
        }, {} as Record<string, { value: number; timestamp: number }>);

        // Get sorted days and take only the last 7 for display
        const allSortedDays = Object.keys(dailyGroups)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        
        // Take the last 8 days (7 for display + 1 for calculation)
        const relevantDays = allSortedDays.slice(-8);
        const sortedDays = relevantDays.slice(-7); // Only show last 7 days

        console.log('All days:', allSortedDays);
        console.log('Relevant days:', relevantDays);
        console.log('Display days:', sortedDays);

        // Create one dataset per miner
        const datasets = results.map((result, index) => {
          const colorIndex = index % COLORS.length;
          const minerId = result.metric.miner_id;
          
          // For this miner, calculate their shares for each day
          const data = new Array(sortedDays.length).fill(0);
          sortedDays.forEach((day, i) => {
            const dayIndex = relevantDays.indexOf(day);
            const todayValue = dailyGroups[day].value;
            const previousDay = relevantDays[dayIndex - 1];
            
            if (previousDay) {
              const previousValue = dailyGroups[previousDay].value;
              data[i] = todayValue - previousValue;
            }
          });

          return {
            label: minerId,
            data,
            backgroundColor: COLORS[colorIndex].bg,
            hoverBackgroundColor: COLORS[colorIndex].hover,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
            borderRadius: 4,
          };
        });

        // Format dates for display
        const labels = sortedDays.map(day => {
          const date = new Date(day);
          // Ensure we're in local timezone and format as "Mon 5"
          return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
            .toLocaleDateString('en-US', { 
              weekday: 'short',
              day: 'numeric',
            })
            .replace(',', ''); // Remove comma from date format
        });

        console.log('Daily groups:', dailyGroups);
        console.log('Calculated differences:', datasets.map(ds => ({
          miner: ds.label,
          values: ds.data
        })));

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