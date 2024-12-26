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
              <path d="M18.71 10.83C19.46 9.55 20 8.08 20 6.5C20 3.46 17.54 1 14.5 1C12.92 1 11.45 1.54 10.17 2.29L18.71 10.83Z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.17 2.29C8.52 3.27 7.31 4.87 6.84 6.75L18.25 18.16C20.13 17.69 21.73 16.48 22.71 14.83L10.17 2.29Z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.84 6.75C6.37 8.63 5.16 10.23 3.51 11.21L15.63 23.33C17.28 22.35 18.88 21.14 19.86 19.49L6.84 6.75Z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 11.21C1.86 12.19 1 13.79 1 15.5C1 18.54 3.46 21 6.5 21C8.21 21 9.81 20.14 10.79 18.49L3.51 11.21Z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
          </MenuButton>
          <Transition
            as="div"
            className={`origin-top-right z-10 absolute top-full -mr-2 sm:mr-0 min-w-[20rem] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
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
