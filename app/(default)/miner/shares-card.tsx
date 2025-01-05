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

        // Group values by day and get the highest value for each day per miner
        const minerDailyGroups = results.reduce((acc, result) => {
          const minerId = result.metric.miner_id;
          if (!acc[minerId]) acc[minerId] = {};

          result.values.forEach(([timestamp, value]) => {
            // Convert timestamp to local date at midnight
            const date = new Date(timestamp * 1000);
            date.setHours(0, 0, 0, 0);
            const dayKey = date.toISOString().split('T')[0];
            const numValue = Number(value);
            
            console.log(`Processing timestamp ${timestamp} (${new Date(timestamp * 1000).toLocaleString()}) for miner ${minerId}`);
            console.log(`Mapped to day: ${dayKey}`);
            
            // Keep track of the highest value for each day for this miner
            if (!acc[minerId][dayKey] || numValue > acc[minerId][dayKey].value) {
              acc[minerId][dayKey] = { 
                value: numValue,
                timestamp: timestamp 
              };
            }
          });
          return acc;
        }, {} as Record<string, Record<string, { value: number; timestamp: number }>>);

        // Get all unique days and sort them
        const allDays = new Set<string>();
        Object.values(minerDailyGroups).forEach(minerData => {
          Object.keys(minerData).forEach(day => allDays.add(day));
        });
        const sortedDays = Array.from(allDays).sort();

        // Log the full date range we're working with
        console.log('Date range analysis:');
        console.log('First timestamp in data:', new Date(results[0].values[0][0] * 1000).toLocaleString());
        console.log('Last timestamp in data:', new Date(results[0].values[results[0].values.length - 1][0] * 1000).toLocaleString());
        console.log('Today is:', new Date().toLocaleString());
        console.log('Sorted days we have:', sortedDays.map(day => ({
          day,
          date: new Date(day).toLocaleString()
        })));

        // Create one dataset per miner
        const datasets = results.map((result, index) => {
          const colorIndex = index % COLORS.length;
          const minerId = result.metric.miner_id;
          const minerData = minerDailyGroups[minerId];
          
          // Calculate daily differences for this miner
          const data = sortedDays.map((day, i) => {
            const todayValue = minerData[day]?.value || 0;
            if (i === 0) {
              // For the first day (Jan 3rd), use the actual value since we don't have previous day
              console.log(`${minerId} value for first day ${day}: ${todayValue}`);
              return todayValue;
            }
            const previousValue = minerData[sortedDays[i - 1]]?.value || 0;
            const diff = todayValue - previousValue;
            console.log(`${minerId} difference for ${day}: ${diff} (${todayValue} - ${previousValue})`);
            return diff;
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
          const dayOfMonth = date.getDate();
          const suffix = dayOfMonth === 1 ? 'st' : dayOfMonth === 2 ? 'nd' : dayOfMonth === 3 ? 'rd' : 'th';
          const isToday = new Date(day).toDateString() === new Date().toDateString();
          
          const formatted = date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }).replace(',', '') + suffix;

          return isToday ? `${formatted} (Today)` : formatted;
        });

        console.log('Final formatted labels:', labels);

        console.log('Miner daily groups:', minerDailyGroups);
        console.log('Days:', sortedDays);
        console.log('Calculated shares:', datasets.map(ds => ({
          miner: ds.label,
          shares: ds.data
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