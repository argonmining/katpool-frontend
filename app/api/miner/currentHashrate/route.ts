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

    // Simple instant query to get current hashrate sum
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query');
    url.searchParams.append('query', `sum(miner_hash_rate_GHps{wallet_address="${wallet}"})`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    console.log('Current hashrate response:', {
      query: `sum(miner_hash_rate_GHps{wallet_address="${wallet}"})`,
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