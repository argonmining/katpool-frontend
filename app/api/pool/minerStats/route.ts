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

interface ProcessedStats {
  [wallet: string]: {
    totalShares: number;
    firstSeen: number;
    activeWorkers: number;
    minerIds: Set<string>;
  };
}

export async function GET() {
  try {
    const end = Math.floor(Date.now() / 1000);
    const start = 1735689600; // Jan 1 2025 at 12am midnight UTC
    const step = 24 * 60 * 60; // 24 hours in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    
    // Query for any metrics for our missing miners
    const missingMiners = [
      'kaspa:qq2vgv5saazwlh4vvu3uyu63nt5e92n364vy4rkmr9k77cdp60wlugxhuajc4',
      'kaspa:qypdvs3ra2ck5wlexr7w750g2m4ahm8vkgx7825c52h02qk5ycrweggrjp0qqv6',
      'kaspa:qzswpkg48s0yuzjwrrf0nlkxad2lyatau0cap0kn27ghde3pjr2cskdhf2032',
      'kaspa:qyp6zh2psruxn7370ey0r79cjtcsv9dz8ksascze3zp7eeqgr86zcacufm4jp75'
    ];
    const walletFilter = missingMiners.map(w => `wallet_address="${w}"`).join('|');
    
    // First query: Get all metrics for missing miners
    url.searchParams.append('query', `{wallet_address=~"${walletFilter}"}`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const missingMinersResponse = await fetch(url, {
      next: { revalidate: 10 }
    });

    if (!missingMinersResponse.ok) {
      throw new Error(`HTTP error! status: ${missingMinersResponse.status}`);
    }

    const missingMinersData = await missingMinersResponse.json();

    // Second query: Get shares data for all miners
    url.searchParams.set('query', 'added_miner_shares_1min_count');
    const sharesResponse = await fetch(url, {
      next: { revalidate: 10 }
    });

    if (!sharesResponse.ok) {
      throw new Error(`HTTP error! status: ${sharesResponse.status}`);
    }

    const data = await sharesResponse.json();

    if (data.status === 'success' && data.data?.result) {
      const stats: ProcessedStats = {};

      // Process shares data
      data.data.result.forEach((result: MinerData) => {
        const wallet = result.metric.wallet_address;
        const minerId = result.metric.miner_id;

        if (!stats[wallet]) {
          stats[wallet] = {
            totalShares: 0,
            firstSeen: Infinity,
            activeWorkers: 0,
            minerIds: new Set<string>()
          };
        }

        if (result.values.length > 0) {
          const lastValue = Number(result.values[result.values.length - 1][1]);
          stats[wallet].totalShares += lastValue;

          if (lastValue > 0) {
            stats[wallet].minerIds.add(minerId);
          }
        }

        if (result.values.length > 0) {
          const firstTimestamp = result.values[0][0];
          stats[wallet].firstSeen = Math.min(stats[wallet].firstSeen, firstTimestamp);
        }
      });

      const processedStats = Object.entries(stats).reduce((acc, [wallet, stat]) => {
        acc[wallet] = {
          totalShares: stat.totalShares,
          firstSeen: stat.firstSeen,
          activeWorkers: stat.minerIds.size
        };
        return acc;
      }, {} as { [wallet: string]: Omit<ProcessedStats[string], 'minerIds'> });

      return NextResponse.json({
        status: 'success',
        data: processedStats,
        debug: {
          missingMinersQuery: missingMinersData
        }
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in miner stats API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner stats' },
      { status: 500 }
    );
  }
} 