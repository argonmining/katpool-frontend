'use client'

import { useState } from 'react'
import Link from 'next/link'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'txHash' | 'kasAmount' | 'krc20Amount' | 'nachoRebate' | 'value' | 'blockHeight'

interface Payout {
  timestamp: number
  txHash: string
  kasAmount: number
  krc20Amount: number
  nachoRebate: number
  value: number
  blockHeight: number
}

export default function PoolPayoutsCard() {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Generate placeholder data
  const placeholderData: Payout[] = Array.from({ length: 50 }, (_, i): Payout => {
    const timestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
    const hasKRC20 = Math.random() > 0.8 // 20% chance of KRC20 payout
    const hasNACHO = Math.random() > 0.7 // 30% chance of NACHO rebate
    return {
      timestamp,
      txHash: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
      kasAmount: Math.random() * 10000,
      krc20Amount: hasKRC20 ? Math.random() * 1000 : 0,
      nachoRebate: hasNACHO ? Math.random() * 50 : 0,
      value: Math.random() * 5000,
      blockHeight: 1500000 - Math.floor(Math.random() * 10000)
    }
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedData = [...placeholderData].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    return (a[sortKey] > b[sortKey] ? 1 : -1) * modifier
  })

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <span className={`ml-1 inline-block ${active ? 'text-primary-500' : 'text-gray-400'}`}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )

  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <div 
      className="font-semibold cursor-pointer hover:text-primary-500 flex items-center justify-center"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon active={sortKey === key} direction={sortDirection} />
    </div>
  )

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Payout History</h2>
      </header>
      
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Time" sortKey="timestamp" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Transaction" sortKey="txHash" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="KAS Amount" sortKey="kasAmount" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="KRC20 Amount" sortKey="krc20Amount" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="NACHO Rebate" sortKey="nachoRebate" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Value (USD)" sortKey="value" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">DAA Score</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedData.map((payout) => (
                <tr key={payout.txHash}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {new Date(payout.timestamp).toLocaleDateString()} 
                      <br />
                      <span className="text-gray-500 text-xs">
                        {new Date(payout.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <Link 
                        href={`https://explorer.kaspa.org/txs/${payout.txHash}`}
                        target="_blank"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {payout.txHash}
                      </Link>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium">
                      {payout.kasAmount > 0 ? payout.kasAmount.toFixed(2) : '-'}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium">
                      {payout.krc20Amount > 0 ? payout.krc20Amount.toFixed(2) : '-'}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium text-green-500">
                      {payout.nachoRebate > 0 ? `+${payout.nachoRebate.toFixed(2)}` : '-'}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">${payout.value.toFixed(2)}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">{payout.blockHeight.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}