'use client'

import Link from 'next/link'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'

export default function DropdownAnnouncements({ align }: {
  align?: 'left' | 'right'
}) {
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => (
        <>
          <MenuButton
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${
              open && 'bg-gray-200 dark:bg-gray-800'
            }`}
          >
            <span className="sr-only">Announcements</span>
            <svg
              className="fill-current text-gray-500/80 dark:text-gray-400/80"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 11h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3zm3-4h8L19 3v16l-5-4H6z" />
              <path d="M17 11h4" />
            </svg>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
          </MenuButton>
          <Transition
            as="div"
            className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-[20rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4">Announcements</div>
            <MenuItems as="ul" className="focus:outline-none">
              <MenuItem as="li" className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                {({ active }) => (
                  <Link className={`block py-2 px-4 ${active && 'bg-gray-50 dark:bg-gray-700/20'}`} href="#0">
                    <span className="block text-sm mb-2">
                      📣 <span className="font-medium text-gray-800 dark:text-gray-100">Edit your information in a swipe</span> Sint occaecat cupidatat non proident,
                      sunt in culpa qui officia deserunt mollit anim.
                    </span>
                    <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Feb 12, 2024</span>
                  </Link>
                )}
              </MenuItem>
              <MenuItem as="li" className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                {({ active }) => (
                  <Link className={`block py-2 px-4 ${active && 'bg-gray-50 dark:bg-gray-700/20'}`} href="#0">
                    <span className="block text-sm mb-2">
                      📣 <span className="font-medium text-gray-800 dark:text-gray-100">Edit your information in a swipe</span> Sint occaecat cupidatat non proident,
                      sunt in culpa qui officia deserunt mollit anim.
                    </span>
                    <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Feb 9, 2024</span>
                  </Link>
                )}
              </MenuItem>
              <MenuItem as="li" className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                {({ active }) => (
                  <Link className={`block py-2 px-4 ${active && 'bg-gray-50 dark:bg-gray-700/20'}`} href="#0">
                    <span className="block text-sm mb-2">
                      🚀<span className="font-medium text-gray-800 dark:text-gray-100">Say goodbye to paper receipts!</span> Sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim.
                    </span>
                    <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Jan 24, 2024</span>
                  </Link>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  )
}
