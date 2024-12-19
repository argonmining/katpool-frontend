'use client'

import { useSearchParams } from 'next/navigation'

export default function AnalyticsCard04() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Estimated Earnings</h2>
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Time Period</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">USD</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">KAS</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">NACHO</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Hourly Row */}
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Hourly</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">$0.42</div>
                </td>
                <td className="p-2">
                  <div className="text-center">125.4</div>
                </td>
                <td className="p-2">
                  <div className="text-center">0.084</div>
                </td>
              </tr>
              {/* Daily Row */}
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Daily</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">$10.08</div>
                </td>
                <td className="p-2">
                  <div className="text-center">3,009.6</div>
                </td>
                <td className="p-2">
                  <div className="text-center">2.016</div>
                </td>
              </tr>
              {/* Weekly Row */}
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Weekly</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">$70.56</div>
                </td>
                <td className="p-2">
                  <div className="text-center">21,067.2</div>
                </td>
                <td className="p-2">
                  <div className="text-center">14.112</div>
                </td>
              </tr>
              {/* Monthly Row */}
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Monthly</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">$302.40</div>
                </td>
                <td className="p-2">
                  <div className="text-center">90,288.0</div>
                </td>
                <td className="p-2">
                  <div className="text-center">60.48</div>
                </td>
              </tr>
              {/* Yearly Row */}
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Yearly</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">$3,679.20</div>
                </td>
                <td className="p-2">
                  <div className="text-center">1,098,240.0</div>
                </td>
                <td className="p-2">
                  <div className="text-center">735.84</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
