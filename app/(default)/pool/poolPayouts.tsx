import Link from 'next/link'
import Image from 'next/image'

export default function PoolPayouts() {
  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Pool Payouts</h2>
      </header>
      <div className="p-3">
        {/* Today's payouts */}
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Today</header>
          <ul className="my-1">
            {/* Payout Item */}
            <li className="flex px-2">
              <div className="w-9 h-9 shrink-0 my-2 mr-3">
                <Image
                  src="/images/kaspa-dark.svg"
                  alt="Kaspa Logo"
                  width={36}
                  height={36}
                  className="w-full h-full text-primary-500"
                />
              </div>
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-green-500">15,234.56 KAS</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-gray-500 dark:text-gray-400">243 miners</span>
                  </div>
                  <div className="shrink-0 self-end ml-2">
                    <span className="text-gray-400 dark:text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
            </li>
            {/* Repeat pattern for more items */}
            <li className="flex px-2">
              <div className="w-9 h-9 shrink-0 my-2 mr-3">
                <Image
                  src="/images/kaspa-dark.svg"
                  alt="Kaspa Logo"
                  width={36}
                  height={36}
                  className="w-full h-full text-primary-500"
                />
              </div>
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-green-500">14,876.32 KAS</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-gray-500 dark:text-gray-400">238 miners</span>
                  </div>
                  <div className="shrink-0 self-end ml-2">
                    <span className="text-gray-400 dark:text-gray-500">8 hours ago</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Yesterday's payouts */}
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Yesterday</header>
          <ul className="my-1">
            <li className="flex px-2">
              <div className="w-9 h-9 shrink-0 my-2 mr-3">
                <Image
                  src="/images/kaspa-dark.svg"
                  alt="Kaspa Logo"
                  width={36}
                  height={36}
                  className="w-full h-full text-primary-500"
                />
              </div>
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-green-500">15,987.45 KAS</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-gray-500 dark:text-gray-400">251 miners</span>
                  </div>
                  <div className="shrink-0 self-end ml-2">
                    <span className="text-gray-400 dark:text-gray-500">Yesterday at 8:00 PM</span>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex px-2">
              <div className="w-9 h-9 shrink-0 my-2 mr-3">
                <Image
                  src="/images/kaspa-dark.svg"
                  alt="Kaspa Logo"
                  width={36}
                  height={36}
                  className="w-full h-full text-primary-500"
                />
              </div>
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-green-500">14,543.21 KAS</span>
                    <span className="text-gray-500 dark:text-gray-400"> • </span>
                    <span className="text-gray-500 dark:text-gray-400">245 miners</span>
                  </div>
                  <div className="shrink-0 self-end ml-2">
                    <span className="text-gray-400 dark:text-gray-500">Yesterday at 2:00 PM</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Footer with link to full history */}
        <div className="px-5 py-4">
          <div className="flex justify-end">
            <Link 
              href="/poolPayouts"
              className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Pool Payout History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
