import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    const end = Math.floor(Date.now() / 1000);
    const start = end - (parseInt(range) * 24 * 60 * 60);
    const step = 300; // 5-minute intervals

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', 'miner_hash_rate_GHps');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching miners history:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch miners history' },
      { status: 500 }
    );
  }
} 