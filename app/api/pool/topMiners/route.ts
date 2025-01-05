import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

interface MinerData {
  metric: {
    wallet_address: string;
    miner_id: string;
    [key: string]: string;
  };
  values: [number, string][];
}

interface ProcessedMiner {
  wallet: string;
  hashrate: number;
  poolShare?: number;
  rank?: number;
}

interface HashrateMap {
  [timestamp: number]: number;
}

export async function GET() {
  try {
    // Calculate timestamps for 24-hour window
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours ago
    const step = 1800; // 30 minutes in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    
    // Construct and encode the full query parameter
    url.searchParams.append('query', 'miner_hash_rate_GHps');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      next: { revalidate: 10 } // Cache for 10 seconds
    });

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.data?.result) {
      // Create a map of wallet addresses to their hashrate values
      const walletHashrates: Map<string, HashrateMap> = new Map();
      
      // Generate all expected timestamps (48 points)
      const expectedTimestamps: number[] = [];
      for (let t = start; t <= end; t += step) {
        expectedTimestamps.push(t);
      }
      
      // Process each miner's data
      data.data.result.forEach((result: MinerData) => {
        const wallet = result.metric.wallet_address;
        const hashrates: HashrateMap = walletHashrates.get(wallet) || {};
        
        // Add each data point to the hashrate map
        result.values.forEach(([timestamp, hashrate]) => {
          const value = Number(hashrate);
          if (!isNaN(value)) {
            hashrates[timestamp] = value;
          }
        });
        
        walletHashrates.set(wallet, hashrates);
      });

      // Calculate averages using all 48 points
      const miners: ProcessedMiner[] = Array.from(walletHashrates.entries())
        .map(([wallet, hashrates]) => {
          let total = 0;
          
          // Sum up values for all expected timestamps (using 0 for missing points)
          expectedTimestamps.forEach(timestamp => {
            total += hashrates[timestamp] || 0;
          });
          
          return {
            wallet,
            hashrate: total / expectedTimestamps.length
          };
        })
        .filter(miner => miner.hashrate > 0); // Filter out completely inactive miners

      // Calculate total pool hashrate
      const totalPoolHashrate = miners.reduce(
        (sum: number, miner: ProcessedMiner) => sum + miner.hashrate,
        0
      );

      // Add pool share and sort by hashrate
      const rankedMiners = miners
        .map((miner: ProcessedMiner) => ({
          ...miner,
          poolShare: (miner.hashrate / totalPoolHashrate) * 100
        }))
        .sort((a: ProcessedMiner, b: ProcessedMiner) => b.hashrate - a.hashrate)
        .map((miner: ProcessedMiner, index: number) => ({
          ...miner,
          rank: index + 1
        }));

      return NextResponse.json({
        status: 'success',
        data: rankedMiners
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in top miners API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch top miners' },
      { status: 500 }
    );
  }
} 