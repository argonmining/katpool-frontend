'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'

interface Payment {
  id: number;
  walletAddress: string;
  amount: number;
  timestamp: number;
  transactionHash: string;
}

export default function AnalyticsCard04() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dailyKas, setDailyKas] = useState<bigint | null>(null)
  const [kasPrice, setKasPrice] = useState<number | null>(null)
  const [nachoPrice, setNachoPrice] = useState<number | null>(null)
  const [hasPayments, setHasPayments] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const [paymentsRes, kasPriceRes, nachoPriceRes] = await Promise.all([
          $fetch(`/api/miner/payments?wallet=${walletAddress}`),
          $fetch('/api/pool/price'),
          $fetch('/api/pool/nachoPrice')
        ]);

        if (paymentsRes.status === 'success') {
          setHasPayments(paymentsRes.data.length > 0);
          if (paymentsRes.data.length > 0) {
            const latestPayment = paymentsRes.data[0];
            const dailyEstimate = BigInt(latestPayment.amount) * BigInt(2);
            setDailyKas(dailyEstimate);
          } else {
            setDailyKas(null);
          }
        }

        if (kasPriceRes.status === 'success') {
          setKasPrice(kasPriceRes.data.price);
        }

        if (nachoPriceRes.status === 'success') {
          setNachoPrice(nachoPriceRes.data.price);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setDailyKas(null);
        setKasPrice(null);
        setNachoPrice(null);
        setHasPayments(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  const formatKas = (amount: bigint | null) => {
    if (amount === null) return '--';
    // Convert from sompi to KAS with proper decimal places
    const kasString = amount.toString().padStart(9, '0');
    const integerPart = kasString.slice(0, -8) || '0';
    const decimalPart = kasString.slice(-8);
    const formattedInteger = parseInt(integerPart).toLocaleString('en-US');
    return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
  };

  const calculateAmount = (baseAmount: bigint | null, multiplier: number) => {
    if (baseAmount === null) return null;
    // For division (like hourly), we multiply first to maintain precision
    if (multiplier < 1) {
      const divisor = Math.round(1 / multiplier);
      return baseAmount / BigInt(divisor);
    }
    // For multiplication (like weekly, monthly, yearly)
    return baseAmount * BigInt(Math.round(multiplier));
  };

  const calculateNachoRebate = (kasAmount: bigint | null) => {
    if (kasAmount === null || kasPrice === null || nachoPrice === null) return null;

    // First convert the sompi amount to KAS
    const kasValue = Number(kasAmount) / 100000000;

    // Calculate USD value of the KAS
    const kasUSDValue = kasValue * kasPrice;

    // Calculate the total fee amount in USD
    const feeAmount = kasUSDValue / 0.9925;

    // Calculate NACHO rebate (1/3 of fee amount)
    const nachoRebate = (feeAmount / 3) / nachoPrice;

    return nachoRebate;
  };

  const calculateUSDValue = (kasAmount: bigint | null, nachoRebate: number | null) => {
    if (kasAmount === null || kasPrice === null || nachoRebate === null || nachoPrice === null) return null;

    // First convert the sompi amount to KAS
    const kasValue = Number(kasAmount) / 100000000;

    // Calculate USD value of the KAS
    const kasUSDValue = kasValue * kasPrice;

    // Calculate USD value of the NACHO rebate
    const nachoUSDValue = nachoRebate * nachoPrice;

    // Return total USD value
    return kasUSDValue + nachoUSDValue;
  };

  const formatNacho = (amount: number | null) => {
    if (amount === null) return '--';
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatUSD = (amount: number | null) => {
    if (amount === null) return '--';
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const renderRow = (period: string, kasAmount: bigint | null) => {
    const nachoRebate = calculateNachoRebate(kasAmount);
    const usdValue = calculateUSDValue(kasAmount, nachoRebate);

    return (
      <tr>
        <td className="p-2">
          <div className="text-gray-800 dark:text-gray-100">{period}</div>
        </td>
        <td className="p-2">
          <div className="text-center">{formatKas(kasAmount)}</div>
        </td>
        <td className="p-2">
          <div className="text-center">{formatNacho(nachoRebate)}</div>
        </td>
        <td className="p-2">
          <div className="text-center text-green-500">{formatUSD(usdValue)}</div>
        </td>
      </tr>
    );
  };

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay for no wallet */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      {/* Blur overlay for no payments */}
      {walletAddress && !isLoading && !error && !hasPayments && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            We'll calculate your estimated earnings after your first payout
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Estimated Earnings</h2>
          <div className="relative flex items-center">
            <div className="group">
              <button className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-500">
                <span className="sr-only">View information</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 right-4 -top-[6px]"></div>
                  <div className="font-medium mb-1"><strong>How we calculate estimates:</strong></div>
                  <p className="mb-2">Daily estimates are based on your most recent payout amount, doubled to account for two 12-hour intervals. Daily estimates are then extrapolated to calculate remaining periods.</p>
                  <p className="mb-2">The <strong>NACHO rebate</strong> is a 0.25% pool fee refund paid in $NACHO tokens, distributed proportionally to miners after each payout.</p>
                  <p className="mb-2">The <strong>USD value</strong> is calculated using the latest Kaspa price from the $KAS Price and CoinGecko APIs.</p>
                  <p className="text-gray-400">Note: These estimates are provided as a reference and are not guaranteed. Actual earnings will vary depending on conditions.</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Time Period</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">KAS Reward</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">NACHO Rebate</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">USD Value</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {renderRow('Hourly', calculateAmount(dailyKas, 1 / 24))}
              {renderRow('Daily', dailyKas)}
              {renderRow('Weekly', calculateAmount(dailyKas, 7))}
              {renderRow('Monthly', calculateAmount(dailyKas, 30))}
              {renderRow('Yearly', calculateAmount(dailyKas, 365))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
