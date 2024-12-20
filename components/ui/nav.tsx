'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Nav() {
  const pathname = usePathname()
  const [minerLink, setMinerLink] = useState('/miner')

  useEffect(() => {
    const storedWallet = localStorage.getItem('kaspaWalletAddress')
    if (storedWallet) {
      setMinerLink(`/miner?wallet=${storedWallet}`)
    }
  }, [])

  return (
    <nav className="hidden lg:flex lg:grow">
      {/* Primary menu */}
      <ul className="flex grow justify-start flex-wrap items-center">
        <li className="relative group">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors`}
          >
            <Image
              src="/images/navlogo.png"
              alt="Navigation Logo"
              width={128}
              height={32}
              className={`mr-6 ${pathname === '/' ? 'opacity-100' : 'opacity-75'}`}
            />
          </Link>
        </li>
        <li className="relative group">
          <a
            href="https://katpool.xyz"
            className="flex items-center px-3 py-2 text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <span>Home</span>
          </a>
        </li>
        <li className="relative group">
          <Link
            href="/connect"
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/connect'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
          >
            <span>Get Started</span>
          </Link>
        </li>
        <li className="relative group">
          <Link
            href={minerLink}
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/miner'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
          >
            <span>Miner Dashboard</span>
          </Link>
        </li>
        <li className="relative group">
          <Link
            href="/pool"
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/pool'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
          >
            <span>Pool Statistics</span>
          </Link>
        </li>
        <li className="relative group">
          <Link
            href="/topMiners"
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/topMiners'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
          >
            <span>Top Miners</span>
          </Link>
        </li>
        <li className="relative group">
          <Link
            href="/payouts"
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/payouts'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
          >
            <span>Payouts</span>
          </Link>
        </li>
        <li className="relative group">
          <Link
            href="/resources"
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/resources'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
          >
            <span>Resources</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
} 