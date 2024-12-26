'use client'

import Link from 'next/link'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import Image from 'next/image'
import NachoIcon from '../../public/images/nacho.svg'

export default function DropdownHelp({ align }: {
  align?: 'left' | 'right'
}) {
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => (
        <>
          <MenuButton
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${open && 'bg-gray-200 dark:bg-gray-800'
              }`}
          >
            <span className="sr-only">Need help?</span>
            <svg
              className="fill-current text-gray-500/80 dark:text-gray-400/80"
              width={16}
              height={16}
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
          </MenuButton>
          <Transition
            as="div"
            className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'
              }`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">Need help?</div>
            <MenuItems as="ul" className="focus:outline-none">
              <MenuItem as="li">
                {({ active }) => (
                  <Link className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} href="https://docs.katpool.xyz">
                    <svg className="w-3 h-3 fill-current text-primary-500 shrink-0 mr-2" viewBox="0 0 12 12">
                      <rect y="3" width="12" height="9" rx="1" />
                      <path d="M2 0h8v2H2z" />
                    </svg>
                    <span>Documentation</span>
                  </Link>
                )}
              </MenuItem>
              <MenuItem as="li">
                {({ active }) => (
                  <Link className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} href="https://NachoWyborski.xyz">
                    <Image
                      src={NachoIcon}
                      alt="Nacho Icon"
                      className="w-3 h-3 text-primary-500 shrink-0 mr-2"
                      width={12}
                      height={12}
                    />
                    <span>Nacho the Kat</span>
                  </Link>
                )}
              </MenuItem>
              <MenuItem as="li">
                {({ active }) => (
                  <Link className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} href="https://ticket.katpool.xyz">
                    <svg className="w-3 h-3 fill-current text-primary-500 shrink-0 mr-2" viewBox="0 0 16 16">
                      <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z"/>
                    </svg>
                    <span>Submit Ticket</span>
                  </Link>
                )}
              </MenuItem>
              <MenuItem as="li">
                {({ active }) => (
                  <Link className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} href="https://discord.gg/nachothekat">
                    <svg className="w-3 h-3 fill-current text-primary-500 shrink-0 mr-2" viewBox="0 0 12 12">
                      <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" />
                    </svg>
                    <span>Contact Us</span>
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