'use client'

import BarChart01 from '@/components/charts/bar-chart-01'
import { tailwindConfig } from '@/components/utils/utils'

export default function FeesVSPayout() {

  const chartData = {
    labels: [
      '12-01-2022', '01-01-2023', '02-01-2023',
      '03-01-2023', '04-01-2023', '05-01-2023',
    ],
    datasets: [
      // Light blue bars
      {
        label: 'KRC20 Payouts',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: tailwindConfig.theme.colors.sky[500],
        hoverBackgroundColor: tailwindConfig.theme.colors.sky[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Blue bars
      {
        label: 'Kaspa Payouts',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: tailwindConfig.theme.colors.primary[500],
        hoverBackgroundColor: tailwindConfig.theme.colors.primary[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  }

  return(
    <div className="relative flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center px-4">
          KRC20 Payout Feature Under Development
        </div>
      </div>

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">KRC20 vs Kaspa Payouts</h2>
      </header>
      <BarChart01 data={chartData} width={595} height={248} />
    </div>
  )
}
