'use client'

import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'transactionHash' | 'amount'

interface Payout {
  walletAddress: string
  amount: number
  timestamp: number
  transactionHash: string
}

export default function PoolPayoutsCard() {
  const [isLoading, setIsLoading] = useState(true)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setIsLoading(true)
        const response = await $fetch('/api/pool/payouts')
        if (response.status === 'success') {
          setPayouts(response.data)
        }
      } catch (error) {
        console.error('Error fetching payouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayouts()
    // Refresh every minute
    const interval = setInterval(fetchPayouts, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' @')
  }

  const formatAmount = (amount: number) => {
    // Use a string-based approach to avoid floating point errors
    return (Math.floor(amount * 100) / 100).toFixed(8)
  }

  const sortedPayouts = [...payouts].sort((a, b) => {
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

  if (isLoading) {
    return (
      <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    )
  }

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
                  <SortableHeader label="Transaction" sortKey="transactionHash" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="KAS Amount" sortKey="amount" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">KRC20 Amount</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">NACHO Rebate</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Value (USD)</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedPayouts.map((payout) => (
                <tr key={payout.transactionHash}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {formatTimestamp(payout.timestamp)}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <a 
                        href={`https://explorer.kaspa.org/txs/${payout.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {`${payout.transactionHash.slice(0, 8)}...${payout.transactionHash.slice(-8)}`}
                      </a>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium">
                      {formatAmount(payout.amount)}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium">
                      --
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center font-medium text-green-500">
                      --
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">--</div>
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