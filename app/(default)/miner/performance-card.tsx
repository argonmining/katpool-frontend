'use client'

import { useSearchParams } from 'next/navigation'
import LineChart03 from '@/components/charts/line-chart-03'
import { chartAreaGradient } from '@/components/charts/chartjs-config'

// Import utilities
import { tailwindConfig, hexToRGB } from '@/components/utils/utils'
import { subDays } from 'date-fns'

export default function AnalyticsCard01() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')

  // Generate dates for the last 7 days with 6-hour intervals
  const generateTimeLabels = () => {
    const labels = []
    const data = []
    const now = new Date()
    
    // Go back 7 days and start from midnight
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)

    // Generate 28 points (7 days * 4 six-hour intervals)
    for (let i = 0; i < 28; i++) {
      const date = new Date(startDate)
      date.setHours(date.getHours() + (i * 6))
      
      // Store the actual timestamp for the x-axis
      labels.push(date.getTime())
      
      // Generate realistic-looking hashrate data
      const baseHashrate = 45 // Base hashrate in TH/s
      const variance = Math.random() * 10 - 5 // Random variance between -5 and +5
      const timeOfDayFactor = Math.sin(date.getHours() * Math.PI / 12) * 2 // Slight daily pattern
      data.push(Math.max(baseHashrate + variance + timeOfDayFactor, 0))
    }

    return { labels, data }
  }

  const { labels, data } = generateTimeLabels()

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Hashrate',
        data: data.map((value, index) => ({
          x: labels[index],
          y: value
        })),
        fill: true,
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
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
  }

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd HH:mm',
          unit: 'day',
          displayFormats: {
            day: 'MMM D'
          },
          tooltipFormat: 'MMM D, ha'
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 7,
          maxRotation: 0,
          color: '#64748b', // slate-500
          font: {
            size: 12
          },
          autoSkip: true
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#e2e8f0' // slate-200
        },
        border: {
          display: false,
        },
        ticks: {
          callback: (value: number) => `${value} TH/s`,
          color: '#64748b', // slate-500
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
          },
          label: (context: any) => {
            return `Hashrate: ${context.parsed.y.toFixed(1)} TH/s`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (
    <div className="relative flex flex-col col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Miner Performance</h2>
      </header>
      <div className="px-5 py-1">
        <div className="flex flex-wrap max-sm:*:w-1/2">
          {/* Unique Visitors */}
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">24.7 th</div>
                <div className="text-sm font-medium text-green-600">+49%</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Realtime Hashrate</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          {/* Total Pageviews */}
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">42.3 th</div>
                <div className="text-sm font-medium text-green-600">+7%</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 2h Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          {/* Bounce Rate */}
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">42.8 th</div>
                <div className="text-sm font-medium text-red-500">-7%</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 12h Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">47.3 th</div>
                <div className="text-sm font-medium text-red-500">-7%</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 24h Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          {/* Visit Duration*/}
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">16.5 th</div>
                <div className="text-sm font-medium text-green-500">+7%</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 48h Avg</div>
            </div>
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        <LineChart03 
          data={chartData} 
          width={800} 
          height={300} 
          options={chartOptions} 
        />
      </div>
    </div>
  )
}
