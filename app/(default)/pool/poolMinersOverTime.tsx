'use client'

import EditMenu from '@/components/elements/edit-menu'
import LineChart01 from '@/components/charts/line-chart-01'
import { chartAreaGradient } from '@/components/charts/chartjs-config'
import { tailwindConfig, hexToRGB } from '@/components/utils/utils'

export default function poolMinersOverTime() {
  // Generate dates for the last 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = {
    labels: dates,
    datasets: [
      {
        data: [
          245, 288, 274, 258, 269, 283, 290
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

  return(
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Pool Miners over Time</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Last 7 Days Average</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">273</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart01 data={chartData} width={389} height={128} />
      </div>
    </div>
  )
}
