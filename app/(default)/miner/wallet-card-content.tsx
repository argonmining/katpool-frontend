'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function WalletCardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [walletAddress, setWalletAddress] = useState('')
  const [isValid, setIsValid] = useState(true)

  const isValidKaspaAddress = (address: string): boolean => {
    const kaspaAddressRegex = /^kaspa:[a-z0-9]{61,63}$/
    return kaspaAddressRegex.test(address)
  }

  useEffect(() => {
    // First check URL params
    const urlWallet = searchParams.get('wallet')
    
    if (urlWallet && isValidKaspaAddress(urlWallet)) {
      setWalletAddress(urlWallet)
      localStorage.setItem('kaspaWalletAddress', urlWallet)
      setIsValid(true)
    } else if (urlWallet) {
      // Invalid wallet in URL, clear it
      router.push('/miner')
      setIsValid(false)
    } else {
      // If no URL params, check localStorage
      const storedWallet = localStorage.getItem('kaspaWalletAddress')
      
      if (storedWallet && isValidKaspaAddress(storedWallet)) {
        setWalletAddress(storedWallet)
        router.push(`/miner?wallet=${storedWallet}`)
        setIsValid(true)
      } else if (storedWallet) {
        // Invalid wallet in localStorage, clear it
        localStorage.removeItem('kaspaWalletAddress')
        setIsValid(false)
      }
    }
  }, [searchParams, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (walletAddress && isValidKaspaAddress(walletAddress)) {
      localStorage.setItem('kaspaWalletAddress', walletAddress)
      router.push(`/miner?wallet=${walletAddress}`)
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl w-full">
      <div className="px-5 py-3">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col w-full"
        >
          <div className="grow">
            <input
              type="text"
              className={`form-input w-full dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary-500 text-sm ${
                !isValid && walletAddress 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary-500'
              }`}
              placeholder="Enter Kaspa wallet address"
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value)
                setIsValid(true) // Reset validation on change
              }}
            />
            {!isValid && walletAddress && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid Kaspa address (format: kaspa:...)
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn bg-primary-500 hover:bg-primary-600 text-white mt-2 whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
} 