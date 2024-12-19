'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function PayoutsCard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')

  useEffect(() => {
    // Get wallet from localStorage using the same key as wallet-card-content
    const savedWallet = localStorage.getItem('kaspaWalletAddress')
    
    // If there's no wallet in the URL but there is one in localStorage,
    // redirect to include it
    if (savedWallet && !walletAddress) {
      router.push(`/payouts?wallet=${savedWallet}`)
    }
  }, [router, walletAddress])

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Payout History</h2>
      </header>
      
      {/* Table content */}
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Your existing table content */}
          </table>
        </div>
      </div>
    </div>
  )
}
