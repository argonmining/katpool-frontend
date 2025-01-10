'use client'

import { useState, useEffect } from 'react'
import TimeRangeMenu from '@/components/elements/time-range-menu'
import LineChart01 from '@/components/charts/line-chart-01'
import { chartAreaGradient } from '@/components/charts/chartjs-config'
import { tailwindConfig, hexToRGB, formatHashrate } from '@/components/utils/utils'
import { $fetch } from 'ofetch'
import { ChartData } from 'chart.js'

interface ChartDataPoint {
  timestamp: number;
  value: bigint;
}

// Format hashrate from H/s to appropriate unit
const formatHashrateFromHs = (hashrateInHs: bigint | number): string => {
  const hashrateAsBigInt = typeof hashrateInHs === 'number' ? BigInt(Math.floor(hashrateInHs)) : hashrateInHs;
  const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
  let value = hashrateAsBigInt;
  let unitIndex = 0;

  while (value >= BigInt(1000) && unitIndex < units.length - 1) {
    value = value / BigInt(1000);
    unitIndex++;
  }

  return `${value.toString()} ${units[unitIndex]}`;
};

export default function KaspaHashrateOverTime() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '180d' | '365d'>('30d');
  const [currentHashrate, setCurrentHashrate] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  const fetchData = async (range: string) => {
    try {
      setIsLoading(true);
      const data = await $fetch(`/api/pool/kaspaHashrate/history`, {
        retry: 2,
        retryDelay: 1000,
        timeout: 15000,
      });

      console.log('Received data:', data);

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }

      // Filter data based on time range from now
      const now = Date.now();
      const rangeInMs: { [key: string]: number } = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '180d': 180 * 24 * 60 * 60 * 1000,
        '365d': 365 * 24 * 60 * 60 * 1000,
      };
      const startTime = now - (rangeInMs[range] || rangeInMs['7d']);
      console.log('Current time:', now, 'Start time:', startTime, 'Range:', range);

      const values = data.data
        .map((item: { key: string; value: string }): ChartDataPoint | null => {
          try {
            // Remove decimal portion and parse as integer for timestamp
            const timestamp = parseInt(item.key.split('.')[0]);
            // Parse the value, handling both regular numbers and scientific notation
            const valueNum = Number(item.value);
            const value = BigInt(Math.floor(valueNum));
            
            if (isNaN(timestamp) || value <= 0) {
              console.warn('Invalid data point:', { timestamp, value: value.toString() });
              return null;
            }

            return {
              timestamp,
              value
            };
          } catch (e) {
            console.warn('Error parsing data point:', e, item);
            return null;
          }
        })
        .filter((item: ChartDataPoint | null): item is ChartDataPoint => {
          if (!item) return false;
          // Keep points between startTime and now
          const isValid = item.timestamp >= startTime && item.timestamp <= now;
          if (!isValid) {
            console.log('Filtered out point:', item, 'startTime:', startTime, 'now:', now);
          }
          return isValid;
        });

      console.log('Processed values:', values.length, 'points');

      if (values.length === 0) {
        throw new Error('No valid data points available');
      }

      // Calculate average hashrate
      const sum = values.reduce((acc: bigint, item: ChartDataPoint) => acc + item.value, BigInt(0));
      const averageHashrate = sum / BigInt(values.length);
      setCurrentHashrate(formatHashrateFromHs(averageHashrate));

      setChartData({
        labels: values.map((d: ChartDataPoint) => d.timestamp),
        datasets: [
          {
            data: values.map((d: ChartDataPoint) => ({
              x: d.timestamp,
              y: Number(d.value) // Convert to number for chart display
            })),
            fill: true,
            backgroundColor: function(context: any) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              const gradientOrColor = chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: `rgba(${hexToRGB(tailwindConfig.theme.colors.primary[500])}, 0)` },
                { stop: 1, color: `rgba(${hexToRGB(tailwindConfig.theme.colors.primary[500])}, 0.2)` }
              ]);
              return gradientOrColor || 'transparent';
            },
            borderColor: tailwindConfig.theme.colors.primary[500],
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: tailwindConfig.theme.colors.primary[500],
            pointHoverBackgroundColor: tailwindConfig.theme.colors.primary[500],
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          }
        ],
      });

      setError(null);
    } catch (error) {
      console.error('Error fetching Kaspa hashrate history:', error);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const handleRangeChange = (range: '7d' | '30d' | '90d' | '180d' | '365d') => {
    setTimeRange(range);
  };

  if (error) {
    return (
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Network Hashrate over time</h2>
          <TimeRangeMenu align="right" currentRange={timeRange} onRangeChange={handleRangeChange} />
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Average Hashrate</div>
        <div className="flex items-start">
          {isLoading ? (
            <div className="h-8 w-28 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded"></div>
          ) : (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{currentHashrate}</div>
          )}
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : chartData && (
          <LineChart01 
            data={chartData} 
            width={389} 
            height={128} 
            tooltipFormatter={(value: number) => formatHashrateFromHs(value)}
            tooltipTitleFormatter={(timestamp: string) => {
              const date = new Date(timestamp);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }).replace(/(\d+)(?=(st|nd|rd|th))/, '$1$2');
            }}
          />
        )}
      </div>
    </div>
  );
}
