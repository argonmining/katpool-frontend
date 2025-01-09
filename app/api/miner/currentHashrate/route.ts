import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Use a 5-minute average for current value instead of instant query
    const end = Math.floor(Date.now() / 1000);
    const start = end - 300; // Last 5 minutes
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', `avg_over_time(sum(miner_hash_rate_GHps{wallet_address="${wallet}"})[5m:15s])`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', '15');  // 15-second steps

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    console.log('Current hashrate response:', {
      query: `avg_over_time(sum(miner_hash_rate_GHps{wallet_address="${wallet}"})[5m:15s])`,
      result: data.data.result
    });

    return NextResponse.json({
      status: 'success',
      data: data.data
    });
  } catch (error) {
    console.error('Error fetching current hashrate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch current hashrate' },
      { status: 500 }
    );
  }
} 