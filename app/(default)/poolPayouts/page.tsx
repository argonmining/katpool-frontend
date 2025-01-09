import PoolPayoutsCard from './poolPayouts-card'

export const metadata = {
  title: 'Pool Payouts - Kat Pool',
  description: 'View all pool payouts on Kat Pool - Where Kaspa Miners Thrive',
}

export default function PoolPayouts() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Pool Payout History</h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        <PoolPayoutsCard />
      </div>
    </div>
  )
}
