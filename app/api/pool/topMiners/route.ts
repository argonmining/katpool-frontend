import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes

interface MinerData {
  wallet: string;
  hashrate: number;
  poolShare: number;
  rank: number;
  rewards24h: number;
  shares24h: number;
}

interface Payout {
  wallet_address: string[];
  amount: string;
  timestamp: string;
  transaction_hash: string;
}

export async function GET() {
  try {
    // Calculate time range for the last 24 hours
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours ago
    const step = 300; // 5-minute intervals

    // Fetch hashrate data for all miners
    const hashrateUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    hashrateUrl.searchParams.append('query', 'sum(miner_hash_rate_GHps) by (wallet_address)');
    hashrateUrl.searchParams.append('start', start.toString());
    hashrateUrl.searchParams.append('end', end.toString());
    hashrateUrl.searchParams.append('step', step.toString());

    // Fetch shares data for all miners
    const sharesUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    sharesUrl.searchParams.append('query', 'sum(added_miner_shares_1min_count) by (wallet_address)');
    sharesUrl.searchParams.append('start', start.toString());
    sharesUrl.searchParams.append('end', end.toString());
    sharesUrl.searchParams.append('step', step.toString());

    // Fetch payout data
    const payoutsUrl = 'http://kas.katpool.xyz:8080/api/pool/payouts';

    const [hashrateResponse, sharesResponse, payoutsResponse] = await Promise.all([
      fetch(hashrateUrl),
      fetch(sharesUrl),
      fetch(payoutsUrl)
    ]);

    if (!hashrateResponse.ok || !sharesResponse.ok || !payoutsResponse.ok) {
      throw new Error(`HTTP error! status: ${hashrateResponse.status}/${sharesResponse.status}/${payoutsResponse.status}`);
    }

    const [hashrateData, sharesData, payoutsData] = await Promise.all([
      hashrateResponse.json(),
      sharesResponse.json(),
      payoutsResponse.json()
    ]);

    if (hashrateData.status !== 'success' || !hashrateData.data?.result) {
      throw new Error('Invalid hashrate response format');
    }

    if (sharesData.status !== 'success' || !sharesData.data?.result) {
      throw new Error('Invalid shares response format');
    }

    // Process shares data to get 24h shares per wallet
    const sharesMap = new Map<string, number>();
    sharesData.data.result.forEach((miner: any) => {
      const values = miner.values;
      if (!values || values.length < 2) {
        console.log(`Skipping miner ${miner.metric.wallet_address} - insufficient data points:`, values?.length || 0);
        return;
      }

      let totalShares = 0;
      // Calculate differences between consecutive points to handle counter resets
      for (let i = 1; i < values.length; i++) {
        const currentValue = Number(values[i][1]);
        const previousValue = Number(values[i - 1][1]);
        
        // If current value is less than previous, assume counter reset
        // In this case, just add the current value as those are new shares
        if (currentValue < previousValue) {
          console.log(`Counter reset detected for ${miner.metric.wallet_address}: ${previousValue} -> ${currentValue}`);
          totalShares += currentValue;
        } else {
          // Otherwise, add the difference
          const diff = Math.max(0, currentValue - previousValue);
          if (diff > 0) {
            totalShares += diff;
          }
        }
      }

      console.log(`24h shares for ${miner.metric.wallet_address}: ${totalShares} (from ${values.length} data points)`);
      sharesMap.set(miner.metric.wallet_address, totalShares);
    });

    // Process payouts to get 24h rewards per wallet
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const rewardsMap = new Map<string, number>();

    payoutsData.forEach((payout: Payout) => {
      const timestamp = new Date(payout.timestamp).getTime();
      if (timestamp >= twentyFourHoursAgo) {
        const wallet = payout.wallet_address[0];
        const amount = Number(payout.amount) / 1e8; // Convert from satoshis to KAS
        rewardsMap.set(wallet, (rewardsMap.get(wallet) || 0) + amount);
      }
    });

    // Calculate pool total hashrate and process miner data
    let poolTotalHashrate = 0;
    const minerData: MinerData[] = [];

    // Process each miner's data
    hashrateData.data.result.forEach((miner: any) => {
      const values = miner.values;
      if (!values || values.length === 0) return;

      // Calculate 24h average hashrate using the sophisticated averaging method
      const validValues = values
        .map(([timestamp, value]: [number, string]) => Number(value))
        .filter((value: number) => !isNaN(value) && value > 0);

      if (validValues.length === 0) return;

      // Sort values and remove outliers (top and bottom 10%)
      const sortedValues = [...validValues].sort((a, b) => a - b);
      const trimAmount = Math.floor(sortedValues.length * 0.1);
      const trimmedValues = sortedValues.slice(trimAmount, -trimAmount);

      // Calculate average of remaining values
      const averageHashrate = trimmedValues.reduce((sum, value) => sum + value, 0) / trimmedValues.length;

      if (averageHashrate > 0) {
        minerData.push({
          wallet: miner.metric.wallet_address,
          hashrate: averageHashrate,
          poolShare: 0, // Will be calculated after total is known
          rank: 0, // Will be assigned after sorting
          rewards24h: rewardsMap.get(miner.metric.wallet_address) || 0,
          shares24h: sharesMap.get(miner.metric.wallet_address) || 0
        });
        poolTotalHashrate += averageHashrate;
      }
    });

    // Calculate pool shares and sort by hashrate
    minerData.forEach(miner => {
      miner.poolShare = (miner.hashrate / poolTotalHashrate) * 100;
    });

    // Sort by hashrate descending and assign ranks
    minerData.sort((a, b) => b.hashrate - a.hashrate);
    minerData.forEach((miner, index) => {
      miner.rank = index + 1;
    });

    return NextResponse.json({
      status: 'success',
      data: minerData
    });
  } catch (error) {
    console.error('Error fetching top miners:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch top miners' },
      { status: 500 }
    );
  }
} 