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

interface AggregatedPayout {
  amount: number
  timestamp: number
  transactionHash: string
}

const downloadCSV = (data: AggregatedPayout[]) => {
  const headers = ['Time', 'Transaction Hash', 'Amount (KAS)']
  const csvContent = [
    headers.join(','),
    ...data.map(payout => [
      new Date(payout.timestamp).toISOString(),
      payout.transactionHash,
      (Math.floor(payout.amount * 100) / 100).toFixed(8)
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `pool-payouts-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function PoolPayoutsCard() {
  const [isLoading, setIsLoading] = useState(true)
  const [payouts, setPayouts] = useState<AggregatedPayout[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setIsLoading(true)
        const response = await $fetch('/api/pool/payouts')
        if (response.status === 'success') {
          // Aggregate payouts by transaction hash
          const aggregated = Object.values(
            response.data.reduce((acc: Record<string, AggregatedPayout>, payout: Payout) => {
              if (!acc[payout.transactionHash]) {
                acc[payout.transactionHash] = {
                  amount: 0,
                  timestamp: payout.timestamp,
                  transactionHash: payout.transactionHash
                }
              }
              acc[payout.transactionHash].amount += payout.amount
              return acc
            }, {})
          ) as AggregatedPayout[]
          setPayouts(aggregated)
        }
      } catch (error) {
        console.error('Error fetching payouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayouts()
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
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    return `${dateStr} @ ${timeStr}`
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
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Payouts</h2>
        <button
          onClick={() => downloadCSV(sortedPayouts)}
          className="px-3 py-1 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
        >
          Export CSV
        </button>
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