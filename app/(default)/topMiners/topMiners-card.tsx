'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type SortDirection = 'asc' | 'desc'
type SortKey = 'rank' | 'wallet' | 'hashrate' | 'workers' | 'shares' | 'rewards' | 'poolShare' | 'firstSeen'

interface Miner {
  rank: number
  wallet: string
  hashrate: number
  workers: number
  shares: number
  rewards: number
  poolShare: number
  firstSeen: number
}

export default function TopMinersCard() {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Generate 40 rows of placeholder data
  const initialData: Miner[] = Array.from({ length: 40 }, (_, i) => ({
    rank: i + 1,
    wallet: `kaspa:qr${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
    hashrate: Number((Math.random() * 300 + 5).toFixed(1)),
    workers: Math.floor(Math.random() * 100 + 1),
    shares: Math.floor(Math.random() * 1000000 + 10000),
    rewards: Math.floor(Math.random() * 10000 + 100),
    poolShare: Number((Math.random() * 5).toFixed(2)),
    firstSeen: Math.floor(Math.random() * 180 + 1)
  }))

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = [...initialData].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    if (sortKey === 'wallet') {
      return a[sortKey].localeCompare(b[sortKey]) * modifier
    }
    
    return (a[sortKey] - b[sortKey]) * modifier
  })

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <span className={`ml-1 inline-block ${active ? 'text-primary-500' : 'text-gray-400'}`}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )

  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <div 
      className="font-semibold text-left cursor-pointer hover:text-primary-500 flex items-center justify-start"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon active={sortKey === key} direction={sortDirection} />
    </div>
  )

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Leaders</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Rank" sortKey="rank" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Wallet" sortKey="wallet" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <SortableHeader label="24h Hashrate" sortKey="hashrate" />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <SortableHeader label="Active Workers" sortKey="workers" />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <SortableHeader label="24h Shares" sortKey="shares" />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <SortableHeader label="24h Rewards" sortKey="rewards" />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <SortableHeader label="Pool Share" sortKey="poolShare" />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <SortableHeader label="First Seen" sortKey="firstSeen" />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Details</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedData.map((miner) => (
                <tr key={miner.wallet}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium">#{miner.rank}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-gray-500">{miner.wallet}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium">{miner.hashrate.toFixed(1)} TH/s</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">{miner.workers}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">{miner.shares.toLocaleString()}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center text-green-500">{miner.rewards.toLocaleString()} KAS</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">{miner.poolShare}%</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">{miner.firstSeen} days ago</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <Link 
                        href={`/miner?wallet=${miner.wallet}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        View
                      </Link>
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
