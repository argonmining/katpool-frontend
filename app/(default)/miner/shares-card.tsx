'use client'

import { useSearchParams } from 'next/navigation'
import BarChart03 from '@/components/charts/bar-chart-03'

// Import utilities
import { tailwindConfig } from '@/components/utils/utils'

export default function AnalyticsCard03() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')

  const chartData = {
    labels: [
      '12-01-2022', '01-01-2023', '02-01-2023',
      '03-01-2023', '04-01-2023', '05-01-2023',
    ],
    datasets: [
      // Stack
      {
        label: 'Rig1',
        data: [
          5000, 4000, 4000, 3800, 5200, 5100,
        ],
        backgroundColor: tailwindConfig.theme.colors.primary[700],
        hoverBackgroundColor: tailwindConfig.theme.colors.primary[800],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Stack
      {
        label: 'Rig2',
        data: [
          2500, 2600, 4000, 4000, 4800, 3500,
        ],
        backgroundColor: tailwindConfig.theme.colors.primary[500],
        hoverBackgroundColor: tailwindConfig.theme.colors.primary[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Stack
      {
        label: 'Rig3',
        data: [
          2300, 2000, 3100, 2700, 1300, 2600,
        ],
        backgroundColor: tailwindConfig.theme.colors.primary[300],
        hoverBackgroundColor: tailwindConfig.theme.colors.primary[400],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Stack
      {
        label: 'Rig4',
        data: [
          4800, 4200, 4800, 1800, 3300, 3500,
        ],
        backgroundColor: tailwindConfig.theme.colors.primary[100],
        hoverBackgroundColor: tailwindConfig.theme.colors.primary[200],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  }

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
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Shares by Miner</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      <BarChart03 data={chartData} width={595} height={248} />
    </div>
  )
}
