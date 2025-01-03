import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const response = await fetch('http://kas.katpool.xyz:8080/api/v1/query?query=sum(miner_wallet_association)');

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result?.[0]?.value?.[1]) {
      throw new Error('Invalid response format');
    }

    // Extract the second value from the value array which represents the active miners count
    const activeMiners = parseInt(data.data.result[0].value[1]);

    return NextResponse.json({
      status: 'success',
      data: {
        activeMiners
      }
    });

  } catch (error) {
    console.error('Error fetching active miners:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch active miners' },
      { status: 500 }
    );
  }
} 