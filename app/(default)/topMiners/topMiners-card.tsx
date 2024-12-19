'use client'

import Image from 'next/image'

export default function TopMinersCard() {

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Worker Details</h2>
      </header>
      <div className="p-3">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap w-1/4">
                  <div className="font-semibold text-left">Worker Name</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[11%]">
                  <div className="font-semibold text-left">15min Hashrate</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[11%]">
                  <div className="font-semibold text-center">1h Hashrate</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[11%]">
                  <div className="font-semibold text-center">12h Hashrate</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[11%]">
                  <div className="font-semibold text-center">24h Hashrate</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[11%]">
                  <div className="font-semibold text-center">Accepted Shares</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[10%]">
                  <div className="font-semibold text-center">Last Share</div>
                </th>
                <th className="p-2 whitespace-nowrap w-[10%]">
                  <div className="font-semibold text-center">Online For</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Row */}
              <tr>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 rounded-full mr-2 sm:mr-3 bg-green-500 w-9 h-9 overflow-hidden">
                      <Image
                        src="/images/iceriver.png"
                        alt="Iceriver"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">rig01</div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.45 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.41 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.38 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.40 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1,247</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2m ago</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">5d 12h</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 rounded-full mr-2 sm:mr-3 bg-green-500 w-9 h-9 overflow-hidden">
                      <Image
                        src="/images/iceriver.png"
                        alt="Iceriver"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">rig02</div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1.92 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1.89 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1.90 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1.91 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">982</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1m ago</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">3d 7h</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 rounded-full mr-2 sm:mr-3 bg-red-500 w-9 h-9 overflow-hidden">
                      <Image
                        src="/images/iceriver.png"
                        alt="Iceriver"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">rig03</div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">0 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">0.85 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1.65 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1.72 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">854</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">45m ago</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2d 19h</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 rounded-full mr-2 sm:mr-3 bg-green-500 w-9 h-9 overflow-hidden">
                      <Image
                        src="/images/iceriver.png"
                        alt="Iceriver"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">rig04</div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">3.12 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">3.15 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">3.10 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">3.11 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1,583</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">30s ago</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">7d 3h</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 rounded-full mr-2 sm:mr-3 bg-green-500 w-9 h-9 overflow-hidden">
                      <Image
                        src="/images/iceriver.png"
                        alt="Iceriver"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">rig05</div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.78 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.75 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.72 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">2.74 GH/s</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">1,392</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">15s ago</div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="text-center">4d 21h</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
