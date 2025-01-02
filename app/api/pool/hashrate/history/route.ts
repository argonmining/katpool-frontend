import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10; // Revalidate every 10 seconds

interface TimeRange {
  days: number;
  stepHours: number;
}

const TIME_RANGES: Record<string, TimeRange> = {
  '7d': { days: 7, stepHours: 4 },
  '30d': { days: 30, stepHours: 18 },
  '90d': { days: 90, stepHours: 24 * 4 },
  '180d': { days: 180, stepHours: 24 * 2 }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    
    if (!TIME_RANGES[range]) {
      throw new Error('Invalid time range');
    }

    const { days, stepHours } = TIME_RANGES[range];
    const end = Math.floor(Date.now() / 1000);
    const start = end - (days * 24 * 60 * 60);
    const step = stepHours * 60 * 60;

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', 'pool_hash_rate_GHps');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      next: { revalidate: 10 } // Cache for 10 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying pool hashrate history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pool hashrate history' },
      { status: 500 }
    );
  }
} 