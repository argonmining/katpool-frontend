import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface MetricResult {
  values: [number, string][];
}

export async function GET() {
  try {
    // Calculate timestamps
    const end = Math.floor(Date.now() / 1000);
    const start = end - 24 * 60 * 60; // 24 hours ago

    const response = await fetch(
      `http://kas.katpool.xyz:8080/api/v1/query_range?query=paid_blocks_1min_count&start=${start}&end=${end}&step=86400`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Count total blocks in last 24h by summing the values from each miner
    const totalBlocks24h = data.data.result.reduce((total: number, item: MetricResult) => {
      const blockCount = parseInt(item.values?.[0]?.[1] || '0');
      return total + blockCount;
    }, 0);

    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h
      }
    });

  } catch (error) {
    console.error('Error fetching 24h blocks:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch 24h blocks' },
      { status: 500 }
    );
  }
} 