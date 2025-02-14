import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface MetricResult {
  metric: {
    block_hash: string;
  };
  values: [number, string][];
}

export async function GET() {
  try {
    // Calculate timestamps
    const end = Math.floor(Date.now() / 1000);
    const start = 1735689600; // Jan 1 2025 at 12am midnight UTC

    const response = await fetch(
      `http://kas.katpool.xyz:8080/api/v1/query?query=last_over_time(miner_rewards[12w])`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Create a Set to store unique block hashes
    const uniqueBlockHashes = new Set<string>();

    // Process each result and store unique block hashes
    data.data.result.forEach((item: MetricResult) => {
      uniqueBlockHashes.add(item.metric.block_hash);
    });

    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks: uniqueBlockHashes.size
      }
    });

  } catch (error) {
    console.error('Error fetching total blocks:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch total blocks' },
      { status: 500 }
    );
  }
} 