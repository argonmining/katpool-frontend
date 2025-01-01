import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://kas.katpool.xyz:8080/api/v1/query?query=pool_hash_rate_GHps', {
      next: {
        revalidate: 10 // Cache for 10 seconds
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying pool hashrate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pool hashrate' },
      { status: 500 }
    );
  }
} 