'use client'

import { useState } from 'react'
import Announcements from '@/components/elements/dropdown-announcements'
import DropdownHelp from '@/components/elements/dropdown-help'
import Nav from './nav'

export default function Header({
  variant = 'default',
}: {
  variant?: 'default' | 'v2' | 'v3'
}) {
  return (
    <header className={`sticky top-0 z-30 ${
      variant === 'default'
        ? 'bg-white dark:bg-gray-900'
        : 'bg-white dark:bg-gray-800'
    } border-b border-gray-200 dark:border-gray-700/60`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Navigation */}
          <Nav />

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <Announcements align="right" />
            <DropdownHelp align="right" />
          </div>
        </div>
      </div>
    </header>
  )
}
