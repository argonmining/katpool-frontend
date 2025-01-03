'use client'

import { ReactNode, useEffect, useState } from 'react'
import { KaspaAPI } from '@/lib/kaspa/api'
import Image from 'next/image'
import { $fetch } from 'ofetch'
import { formatHashrate } from '@/components/utils/utils'

interface StatCardProps {
  dataType: 'daaScore' | 'supply' | 'difficulty' | 'blockCount' | 'hashrate' | 
            'minedPercent' | 'nextReduction' | 'nextReward' | 'blockReward' | 'totalSupply' | 
            'poolHashrate' | 'poolBlocks' | 'poolMiners' | 'pool24hBlocks' |
            'price'
  label: string
  icon: ReactNode | 'kaspa'
}

export default function StatCard({ dataType, label, icon }: StatCardProps) {
  const [value, setValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = ''
        
        switch (dataType) {
          case 'daaScore':
            const networkInfo = await KaspaAPI.network.getInfo()
            result = Number(networkInfo.virtualDaaScore).toLocaleString('en-US')
            break
          case 'supply':
            const supplyResponse = await KaspaAPI.network.getCirculatingSupply(false)
            console.log('Supply Response:', supplyResponse)
            try {
              const supplyInBillions = Number(supplyResponse) / 1e9
              result = `${supplyInBillions.toFixed(4)} B`
            } catch (error) {
              console.error('Supply conversion error:', error)
              result = 'Error'
            }
            break
          case 'difficulty':
            const difficultyInfo = await KaspaAPI.network.getInfo()
            result = (difficultyInfo.difficulty / 1e12).toFixed(2) + ' T'
            break
          case 'blockCount':
            const blockInfo = await KaspaAPI.network.getInfo()
            result = blockInfo.blockCount.toLocaleString('en-US')
            break
          case 'hashrate':
            const hashrateResponse = await KaspaAPI.network.getHashrate(false)
            const hashrate = Number(hashrateResponse.hashrate)
            result = `${(hashrate / 1e6).toFixed(2)} EH/s`
            break
          case 'minedPercent':
            const currentSupply = await KaspaAPI.network.getCirculatingSupply(true)
            result = `${((Number(currentSupply) / 28.7) * 100).toFixed(2)}%`
            break
          case 'nextReduction':
            const halvingInfo = await KaspaAPI.network.getHalvingInfo()
            const now = Math.floor(Date.now() / 1000)
            const timeUntilHalving = halvingInfo.nextHalvingTimestamp - now
            const days = Math.floor(timeUntilHalving / 86400)
            const hours = Math.floor((timeUntilHalving % 86400) / 3600)
            result = `${days}d ${hours}h`
            break
          case 'nextReward':
            const nextRewardInfo = await KaspaAPI.network.getHalvingInfo()
            result = `${Math.round(nextRewardInfo.nextHalvingAmount)} KAS`
            break
          case 'blockReward':
            const currentRewardResponse = await KaspaAPI.network.getBlockReward(false)
            result = `${Math.round(Number(currentRewardResponse.blockreward))} KAS`
            break
          case 'totalSupply':
            const totalSupplyResponse = await KaspaAPI.network.getTotalSupply()
            console.log('Total Supply Response:', totalSupplyResponse)
            try {
              const totalInBillions = Number(totalSupplyResponse) / 1e9
              result = `${totalInBillions.toFixed(4)} B`
            } catch (error) {
              console.error('Total Supply conversion error:', error)
              result = 'Error'
            }
            break
          case 'poolHashrate':
            try {
              const data = await $fetch('/api/pool/hashrate', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.result?.[0]?.value?.[1]) {
                throw new Error('Invalid response format');
              }
              
              const rawHashrate = Number(data.data.result[0].value[1]);
              console.log('Raw hashrate from API:', rawHashrate);
              
              if (!Number.isFinite(rawHashrate)) {
                throw new Error('Invalid hashrate value received');
              }
              
              const formattedResult = formatHashrate(rawHashrate);
              console.log('Formatted hashrate:', formattedResult);
              result = formattedResult;
            } catch (error) {
              console.error('Error fetching pool hashrate:', error);
              result = 'Error';
            }
            break
          case 'poolBlocks':
            try {
              const data = await $fetch('/api/pool/blocks', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.totalBlocks) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.totalBlocks.toLocaleString('en-US');
            } catch (error) {
              console.error('Error fetching pool blocks:', error);
              result = 'Error';
            }
            break
          case 'poolMiners':
            try {
              const data = await $fetch('/api/pool/miners', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.activeMiners) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.activeMiners.toLocaleString('en-US');
            } catch (error) {
              console.error('Error fetching active miners:', error);
              result = 'Error';
            }
            break
          case 'pool24hBlocks':
            try {
              const data = await $fetch('/api/pool/blocks24h', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.totalBlocks24h) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.totalBlocks24h.toLocaleString('en-US');
            } catch (error) {
              console.error('Error fetching 24h blocks:', error);
              result = 'Error';
            }
            break
          case 'price':
            const priceResponse = await KaspaAPI.network.getPrice(false)
            result = `$${Number(priceResponse.price).toFixed(4)}`
            break
        }
        
        setValue(result)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setValue('Error')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dataType])

  return (
    <div className="flex flex-col col-span-full sm:col-span-4 xl:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60">
      <div className="px-5 pt-5 pb-4">
        <header className="flex items-center mb-2">
          <div className="text-primary-500">
            {icon === 'kaspa' ? (
              <Image
                src="/images/kaspa-dark.svg"
                alt="Kaspa Logo"
                width={32}
                height={32}
                className="w-7 h-7"
              />
            ) : (
              icon
            )}
          </div>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase ml-2">{label}</div>
        </header>
        <div className="flex items-start">
          {isLoading ? (
            <div className="h-8 w-28 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
          )}
        </div>
      </div>
    </div>
  )
} 