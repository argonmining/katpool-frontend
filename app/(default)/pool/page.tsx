export const metadata = {
  title: 'Statistics - Kat Pool',
  description: 'Where Kaspa Miners Thrive',
}

import DashboardCard01 from './dashboard-card-01'
import DashboardCard02 from './dashboard-card-02'
import DashboardCard03 from './dashboard-card-03'
import DashboardCard04 from './dashboard-card-04'
import DashboardCard05 from './dashboard-card-05'
import DashboardCard06 from './dashboard-card-06'
import DashboardCard07 from './dashboard-card-07'
import DashboardCard08 from './dashboard-card-08'
import DashboardCard09 from './dashboard-card-09'
import DashboardCard10 from './dashboard-card-10'
import DashboardCard11 from './dashboard-card-11'

export default function PoolDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Dashboard actions */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Pool Statistics</h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Line chart (Acme Plus) */}
        <DashboardCard01 />
        {/* Line chart (Acme Advanced) */}
        <DashboardCard02 />
        {/* Line chart (Acme Professional) */}
        <DashboardCard03 />
        {/* Bar chart (Direct vs Indirect) */}
        <DashboardCard04 />
        {/* Line chart (Real Time Value) */}
        <DashboardCard05 />
        {/* Doughnut chart (Top Countries) */}
        <DashboardCard06 />
        {/* Table (Top Channels) */}
        <DashboardCard07 />
        {/* Line chart (Sales Over Time) */}
        <DashboardCard08 />
        {/* Stacked bar chart (Sales VS Refunds) */}
        <DashboardCard09 />
        {/* Card (Recent Activity) */}
        <DashboardCard10 />
        {/* Card (Income/Expenses) */}
        <DashboardCard11 />        
      </div>      
    </div>
  )
}
