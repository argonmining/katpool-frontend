import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

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
      // Group hashrates by wallet address
      const walletHashrates = new Map<string, { hashrate: number; count: number }>();
      
      data.data.result.forEach((result: any) => {
        const wallet = result.metric.wallet_address;
        const hashrate = Number(result.value[1]); // Get the hashrate value
        
        if (walletHashrates.has(wallet)) {
          const current = walletHashrates.get(wallet)!;
          walletHashrates.set(wallet, {
            hashrate: current.hashrate + hashrate,
            count: current.count + 1
          });
        } else {
          walletHashrates.set(wallet, { hashrate, count: 1 });
        }
      });

      // Calculate total pool hashrate
      const totalPoolHashrate = Array.from(walletHashrates.values()).reduce(
        (sum, { hashrate }) => sum + hashrate,
        0
      );

      // Convert to array and calculate averages and pool share
      const miners = Array.from(walletHashrates.entries()).map(([wallet, data]) => ({
        wallet,
        hashrate: data.hashrate / data.count, // Calculate average hashrate
        poolShare: ((data.hashrate / data.count) / totalPoolHashrate) * 100
      }));

      // Sort by hashrate descending and add rank
      const rankedMiners = miners
        .sort((a, b) => b.hashrate - a.hashrate)
        .map((miner, index) => ({
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