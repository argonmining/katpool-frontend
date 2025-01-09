'use client'

import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'

interface TimeRangeMenuProps {
  align?: 'left' | 'right'
  className?: string
  currentRange: '7d' | '30d' | '90d' | '180d' | '365d'
  onRangeChange: (range: '7d' | '30d' | '90d' | '180d' | '365d') => void
}

const TIME_RANGE_LABELS: Record<string, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 3 Months',
  '180d': 'Last 6 Months',
  '365d': 'Last Year'
};

export default function TimeRangeMenu({
  align = 'right',
  className = '',
  currentRange,
  onRangeChange
}: TimeRangeMenuProps) {
  return (
    <Menu as="div" className={`relative inline-flex ${className}`}>
      {({ open }) => (
        <>
          <MenuButton
            className={`flex items-center rounded-lg px-3 py-1.5 ${
              open 
                ? 'bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400' 
                : 'text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span className="text-sm font-medium">{TIME_RANGE_LABELS[currentRange]}</span>
            <svg className="w-4 h-4 ml-2 fill-current" viewBox="0 0 16 16">
              <path d="M8 11.4l-4.7-4.7 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4z" />
            </svg>
          </MenuButton>
          <Transition
            as="div"
            className={`origin-top-right z-10 absolute top-full min-w-[9rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <MenuItems as="ul" className="focus:outline-none">
              {Object.entries(TIME_RANGE_LABELS).map(([range, label]) => (
                <MenuItem key={range} as="li">
                  {({ active }) => (
                    <button
                      onClick={() => onRangeChange(range as '7d' | '30d' | '90d' | '180d' | '365d')}
                      className={`font-medium text-sm w-full text-left py-1 px-3 ${
                        range === currentRange
                          ? 'text-primary-500 dark:text-primary-400'
                          : active
                          ? 'text-gray-800 dark:text-gray-200'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  )
} 