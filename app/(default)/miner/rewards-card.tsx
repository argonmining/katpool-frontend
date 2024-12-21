'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AnalyticsCard02() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')

  return (
    <div className="relative flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Miner Rewards</h2>
      </header>

      {/* Live pending balance */}
      <div className="px-5 py-3">
        <div className="flex items-center">
          {/* Red dot */}
          <div className="relative flex items-center justify-center w-3 h-3 mr-3" aria-hidden="true">
            <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-500"></div>
          </div>            
          {/* Pending balance */}
          <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">347.92 KAS</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending Balance</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="grow px-5 pt-3 pb-1">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500">
              <tr>
                <th className="py-2">
                  <div className="font-semibold text-left">Recent Payouts</div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right"></div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right"></div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Row */}
              <tr>
                <td className="py-2">
                  <div className="text-left text-gray-500">0x7d3e...f8a2</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-gray-800 dark:text-gray-100">2,547.83 KAS</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-green-500">$892.74</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="py-2">
                  <div className="text-left text-gray-500">0x3a1f...d4e5</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-gray-800 dark:text-gray-100">1,892.45 KAS</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-green-500">$662.36</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="py-2">
                  <div className="text-left text-gray-500">0x9c2d...b1a3</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-gray-800 dark:text-gray-100">1,256.78 KAS</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-green-500">$439.87</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="py-2">
                  <div className="text-left text-gray-500">0x5e8b...c7f9</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-gray-800 dark:text-gray-100">984.32 KAS</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-green-500">$344.51</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="py-2">
                  <div className="text-left text-gray-500">0x2b4a...e9c8</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-gray-800 dark:text-gray-100">756.91 KAS</div>
                </td>
                <td className="py-2">
                  <div className="font-medium text-right text-green-500">$264.92</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 py-4">
        <div className="flex justify-end">
          <Link 
            className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400" 
            href={`/payouts?wallet=${searchParams.get('wallet') || ''}`}
          >
            Full Payout History →
          </Link>
        </div>
      </div>
    </div>
  )
}
