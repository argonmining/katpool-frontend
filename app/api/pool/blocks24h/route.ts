import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface MetricResult {
  metric: {
    __name__: string;
    block_hash: string;
    daa_score: string;
    exported_job: string;
    instance: string;
    job: string;
    miner_id: string;
    timestamp: string;
    wallet_address: string;
  };
  values: [number, string][];
}

export async function GET() {
  try {
    // Calculate timestamps
    const end = Math.floor(Date.now() / 1000);
    const start = end - 24 * 60 * 60; // 24 hours ago

    const response = await fetch(
      `http://kas.katpool.xyz:8080/api/v1/query_range?query=miner_rewards&start=${start}&end=${end}&step=10000`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Create a Set to store unique block hashes
    const uniqueBlockHashes = new Set<string>();

    // Process the response which matches the exact format
    if (data?.status === 'success' && data?.data?.result) {
      data.data.result.forEach((item: MetricResult) => {
        if (item.metric?.block_hash) {
          uniqueBlockHashes.add(item.metric.block_hash);
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: uniqueBlockHashes.size
      }
    });

  } catch (error) {
    console.error('Error fetching 24h blocks:', error);
    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: 0
      }
    });
  }
} 