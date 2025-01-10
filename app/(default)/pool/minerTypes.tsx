'use client'

import { useEffect, useState } from 'react'
import DoughnutChart from '@/components/charts/doughnut-chart'
import { tailwindConfig } from '@/components/utils/utils'

export default function MinerTypes() {
  const [chartData, setChartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pool/minerTypes')
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const data = await response.json()
        if (data.status !== 'success') throw new Error(data.message || 'Invalid response')

        setChartData({
          labels: data.data.labels,
          datasets: [
            {
              label: 'Top Manufacturers',
              data: data.data.values,
              backgroundColor: [
                tailwindConfig.theme.colors.primary[500],
                tailwindConfig.theme.colors.sky[500],
                tailwindConfig.theme.colors.primary[800],
                tailwindConfig.theme.colors.sky[800],
              ],
              hoverBackgroundColor: [
                tailwindConfig.theme.colors.primary[600],
                tailwindConfig.theme.colors.sky[600],
                tailwindConfig.theme.colors.primary[900],
                tailwindConfig.theme.colors.sky[900],
              ],
              borderWidth: 0,
            },
          ],
        })
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  return(
    <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-xl z-10 flex items-center justify-center">
          <div className="text-red-500 dark:text-red-400 text-sm font-medium text-center px-4">
            {error}
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Miners by Manufacturer</h2>
      </header>
      
      {chartData && (
        <DoughnutChart data={chartData} width={389} height={260} />
      )}
    </div>
  )
}
