import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 0; // Disable caching

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

    // Calculate timestamps that align with the pool's data
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime - (currentTime % 3600); // Round down to nearest hour
    const startTime = endTime - (7 * 24 * 60 * 60); // 7 days before end time
    const stepInterval = 3600; // 1 hour in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    
    // Construct and encode the full query parameter
    const queryString = `miner_hash_rate_GHps{wallet_address="${wallet}"}`;
    url.searchParams.append('query', queryString);
    url.searchParams.append('start', startTime.toString());
    url.searchParams.append('end', endTime.toString());
    url.searchParams.append('step', stepInterval.toString());

    console.log('Fetching from URL:', url.toString());
    console.log('Query string before encoding:', queryString);
    console.log('Full URL after encoding:', url.toString());

    const response = await fetch(url, {
      cache: 'no-store'
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
    console.log('Pool API response:', JSON.stringify(data));

    // Pass through the raw response
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in miner hashrate API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner hashrate' },
      { status: 500 }
    );
  }
} 