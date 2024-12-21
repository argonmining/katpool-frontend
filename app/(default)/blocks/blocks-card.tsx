'use client'

import { useState } from 'react'
import Link from 'next/link'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'blockHeight' | 'reward'

interface Block {
  timestamp: number
  blockHeight: number
  reward: number
}

export default function BlocksCard() {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Generate placeholder data
  const placeholderData: Block[] = Array.from({ length: 50 }, (_, i): Block => {
    const timestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
    return {
      timestamp,
      blockHeight: 1500000 - Math.floor(Math.random() * 10000),
      reward: 89.32 // Fixed reward for now
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
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Found Blocks</h2>
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
                  <SortableHeader label="Block Height" sortKey="blockHeight" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Reward" sortKey="reward" />
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedData.map((block) => (
                <tr key={block.blockHeight}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {new Date(block.timestamp).toLocaleDateString()} 
                      <br />
                      <span className="text-gray-500 text-xs">
                        {new Date(block.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <Link 
                        href={`https://explorer.kaspa.org/blocks/${block.blockHeight}`}
                        target="_blank"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {block.blockHeight.toLocaleString()}
                      </Link>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium text-green-500">
                      {block.reward.toFixed(2)} KAS
                    </div>
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
