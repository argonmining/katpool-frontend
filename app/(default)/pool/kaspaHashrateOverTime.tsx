'use client'

import LineChart01 from '@/components/charts/line-chart-01'
import { chartAreaGradient } from '@/components/charts/chartjs-config'
import { tailwindConfig, hexToRGB, formatHashrate } from '@/components/utils/utils'

export default function kaspaHashrateOverTime() {
  // Generate dates for the last 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  // Using more realistic network hashrate values (in GH/s)
  const chartData = {
    labels: dates,
    datasets: [
      {
        data: [
          1250000, 1280000, 1275000, 1290000, 1310000, 1295000, 1320000
        ],
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
  }

  // Calculate average hashrate from the data
  const averageHashrate = chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length;

  return(
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
        <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">Under Development</div>
      </div>
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Network Hashrate over time</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Placeholder Data</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{formatHashrate(averageHashrate)}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart01 
          data={chartData} 
          width={389} 
          height={128} 
          tooltipFormatter={(value: number) => formatHashrate(value)}
        />
      </div>
    </div>
  )
}
