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
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const end = Math.floor(Date.now() / 1000);
    const start = end - (7 * 24 * 60 * 60); // 7 days ago
    const step = 3600; // 1 hour in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', `miner_hash_rate_GHps{wallet_address="${encodeURIComponent(wallet)}"}`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 'success' || !data.data?.result?.[0]?.values) {
      throw new Error('Invalid response from pool API');
    }

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Error proxying miner hashrate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch miner hashrate' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
} 