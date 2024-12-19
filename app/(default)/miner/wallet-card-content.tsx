'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function WalletCardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    // First check URL params
    const urlWallet = searchParams.get('wallet')
    console.log('URL Wallet:', urlWallet)
    
    if (urlWallet) {
      console.log('Setting wallet from URL:', urlWallet)
      setWalletAddress(urlWallet)
      localStorage.setItem('kaspaWalletAddress', urlWallet)
    } else {
      // If no URL params, check localStorage
      const storedWallet = localStorage.getItem('kaspaWalletAddress')
      console.log('Stored Wallet:', storedWallet)
      
      if (storedWallet) {
        console.log('Setting wallet from localStorage:', storedWallet)
        setWalletAddress(storedWallet)
        // Redirect to include the wallet in URL
        router.push(`/miner?wallet=${storedWallet}`)
      }
    }
  }, [searchParams, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (walletAddress) {
      console.log('Saving wallet to localStorage:', walletAddress)
      localStorage.setItem('kaspaWalletAddress', walletAddress)
      router.push(`/miner?wallet=${walletAddress}`)
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl w-full">
      <div className="px-5 py-3">
        <form 
          onSubmit={handleSubmit}
          className="flex items-center w-full"
        >
          <div className="grow">
            <input
              type="text"
              className="form-input w-full dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary-500 text-sm"
              placeholder="Enter Kaspa wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn bg-primary-500 hover:bg-primary-600 text-white ml-2 whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
} 