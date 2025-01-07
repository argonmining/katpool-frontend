'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'

interface Payout {
  walletAddress: string
  amount: number
  timestamp: number
  transactionHash: string
}

export default function PoolPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const response = await $fetch('/api/pool/payouts')
        if (response.status === 'success') {
          setPayouts(response.data)
        }
      } catch (error) {
        console.error('Error fetching pool payouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayouts()
    // Refresh every minute
    const interval = setInterval(fetchPayouts, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 3)}...${hash.slice(-3)}`
  }

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  // Group payouts by day
  const groupedPayouts = payouts.reduce((groups: Record<string, Payout[]>, payout) => {
    const date = new Date(payout.timestamp)
    const day = date.toLocaleDateString('en-US', { weekday: 'long' })
    if (!groups[day]) {
      groups[day] = []
    }
    groups[day].push(payout)
    return groups
  }, {})

  if (isLoading) {
    return (
      <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Pool Payouts</h2>
        </header>
        <div className="p-3">
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Pool Payouts</h2>
      </header>
      <div className="p-3">
        {Object.entries(groupedPayouts).map(([day, dayPayouts], index) => (
          <div key={day}>
            <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
              {index === 0 ? 'Today' : day}
            </header>
            <ul className="my-1">
              {dayPayouts.map((payout) => (
                <li key={payout.transactionHash} className="flex px-2">
                  <div className="w-9 h-9 shrink-0 my-2 mr-3">
                    <Image
                      src="/images/kaspa-dark.svg"
                      alt="Kaspa Logo"
                      width={36}
                      height={36}
                      className="w-full h-full text-primary-500"
                    />
                  </div>
                  <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                    <div className="grow flex justify-between">
                      <div className="self-center">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                        <span className="text-gray-500 dark:text-gray-400"> • </span>
                        <span className="text-green-500">{formatAmount(payout.amount)} KAS</span>
                        <span className="text-gray-500 dark:text-gray-400"> • </span>
                        <a
                          href={`https://explorer.kaspa.org/txs/${payout.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                        >
                          {formatTxHash(payout.transactionHash)}
                        </a>
                      </div>
                      <div className="shrink-0 self-end ml-2">
                        <span className="text-gray-400 dark:text-gray-500">{getRelativeTime(payout.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Footer with link to full history */}
        <div className="px-5 py-4">
          <div className="flex justify-end">
            <Link 
              href="/poolPayouts"
              className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Pool Payout History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
