'use client'

import { Suspense } from 'react'
import WalletCardContent from './wallet-card-content'

export default function WalletCard() {
  return (
    <Suspense fallback={<div className="h-[52px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"/>}>
      <WalletCardContent />
    </Suspense>
  )
} 