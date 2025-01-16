interface ResourceCardProps {
  title: string
  description: string
  link: string
  icon: React.ReactNode
  isAffiliate?: boolean
}

function ResourceCard({ title, description, link, icon, isAffiliate }: ResourceCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col p-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 hover:border-primary-300 dark:hover:border-primary-500/50 transition-colors"
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-primary-500">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
          {isAffiliate && (
            <span className="ml-2 text-xs text-primary-500 border border-primary-200 dark:border-primary-500/30 rounded px-1.5 py-0.5">
              Partner
            </span>
          )}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  )
}

export const metadata = {
  title: 'Resources - Kat Pool',
  description: 'Where Kaspa Miners Thrive',
}

export default function Resources() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Miner Resources</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Essential tools, guides, and resources for Kaspa mining
          </p>
        </div>
      </div>

      {/* Mining Tools Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Mining Tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard
            title="Profit Calculator"
            description="Calculate your potential mining rewards and profitability with this community mining calculator"
            link="https://kaspacalc.net/"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Documentation Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Documentation & Guides
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard
            title="Kaspa Mining Wiki"
            description="Comprehensive guide to mining Kaspa, including setup instructions and best practices"
            link="https://kaspawiki.net/index.php/Mining"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.424 10.223a7.5 7.5 0 00-10.61-10.61m11.89 9.337a7.493 7.493 0 01-10.61 10.61m9.337-11.89a7.5 7.5 0 01-10.61 10.61m11.89-9.337a7.493 7.493 0 00-10.61-10.61" />
              </svg>
            }
          />
          <ResourceCard
            title="Hashrate Tables"
            description="Detailed performance data for various mining hardware, including ASICs and GPUs"
            link="https://wiki.kaspa.org/en/hashrate-tables"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <ResourceCard
            title="Emission Schedule"
            description="Official Kaspa emission schedule detailing the coin distribution and mining rewards"
            link="https://kaspa.org/wp-content/uploads/2022/09/KASPA-EMISSION-SCHEDULE.pdf"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Mining Hardware Section (Placeholder for future affiliate links) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Mining Hardware
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(Coming Soon)</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Mining hardware recommendations and partner links coming soon
            </p>
          </div>
        </div>
      </div>

      {/* ASIC Hosting Section (Placeholder for future affiliate links) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          ASIC Hosting
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(Coming Soon)</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              ASIC hosting partner links coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
