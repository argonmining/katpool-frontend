import React, { useState, useEffect } from 'react';

interface WorkersCardProps {
  wallet: string;
}

interface Worker {
  metric: {
    __name__: string;
    wallet_address: string;
    wokername: string;
  };
  values: [number, string][];
  averages: {
    fifteenMin: number;
    oneHour: number;
    twelveHour: number;
    twentyFourHour: number;
  };
}

const WorkersCard: React.FC<WorkersCardProps> = ({ wallet }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/miner/workerHashrate?wallet=${wallet}`);
        if (!response.ok) {
          throw new Error('Failed to fetch worker data');
        }

        const data = await response.json();
        if (data.status !== 'success' || !data.data?.result) {
          throw new Error('Invalid response format');
        }

        setWorkers(data.data.result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch worker data');
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      fetchWorkers();
      const interval = setInterval(fetchWorkers, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [wallet]);

  const formatHashrate = (hashrate: number) => {
    if (hashrate === 0) return '0 GH/s';
    return `${hashrate.toFixed(2)} GH/s`;
  };

  const getWorkerStatus = (worker: Worker) => {
    const fifteenMinHashrate = worker.averages.fifteenMin;
    if (fifteenMinHashrate === 0) return 'offline';
    return 'online';
  };

  const sortedWorkers = [...workers].sort((a, b) => {
    return b.averages.twentyFourHour - a.averages.twentyFourHour;
  });

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Workers</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Worker</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Status</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">15m Hashrate</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">1h Hashrate</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">12h Hashrate</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">24h Hashrate</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-2 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : sortedWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-2 text-center">
                    No workers found
                  </td>
                </tr>
              ) : (
                sortedWorkers.map((worker, index) => {
                  const status = getWorkerStatus(worker);
                  return (
                    <tr key={index}>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="text-slate-800 dark:text-slate-100">
                            {worker.metric.wokername}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <div
                            className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${
                              status === 'online'
                                ? 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {status}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-emerald-500">
                          {formatHashrate(worker.averages.fifteenMin)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-emerald-500">
                          {formatHashrate(worker.averages.oneHour)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-emerald-500">
                          {formatHashrate(worker.averages.twelveHour)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-emerald-500">
                          {formatHashrate(worker.averages.twentyFourHour)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkersCard; 