'use client'

import { useState } from 'react'
import TimeRangeMenu from '@/components/elements/time-range-menu'

export default function KaspaHashrateOverTime() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '180d' | '365d'>('30d');

  const handleRangeChange = (range: '7d' | '30d' | '90d' | '180d' | '365d') => {
    setTimeRange(range);
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      {/* Under Development Overlay */}
      <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
        <div className="text-white text-lg font-semibold">Under Development</div>
      </div>

      {/* Original Content (blurred) */}
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Network Hashrate over time</h2>
          <TimeRangeMenu align="right" currentRange={timeRange} onRangeChange={handleRangeChange} />
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Average Hashrate</div>
        <div className="flex items-start">
          <div className="h-8 w-28 bg-gray-100 dark:bg-gray-700/50 rounded"></div>
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px] flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500">Chart placeholder</div>
      </div>
    </div>
  );
}
