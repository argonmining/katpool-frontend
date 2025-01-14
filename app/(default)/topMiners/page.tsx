export const metadata = {
  title: 'Top Miners - Kat Pool',
  description: 'Where Kaspa Miners Thrive',
}

import TopMinersCard from './topMiners-card'

export default function TopMiners() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Top Miners</h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        <TopMinersCard />
      </div>
    </div>
  )
}
