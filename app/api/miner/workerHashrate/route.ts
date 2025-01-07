import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes since that's our step size

interface WorkerHashrate {
  metric: {
    __name__: string;
    wallet_address: string;
    wokername: string;
    [key: string]: string;
  };
  values: [number, string][];
}

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

    // Calculate time range
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours ago
    const step = 300; // 5 minutes in seconds

    // Construct the URL with encoded wallet address
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', `worker_hash_rate_GHps{wallet_address="${wallet}"}`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: data.data
    });
  } catch (error) {
    console.error('Error fetching worker hashrate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch worker hashrate' },
      { status: 500 }
    );
  }
} 