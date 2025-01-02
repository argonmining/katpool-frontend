import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Opt out of static optimization
export const revalidate = 0; // Disable caching at the route level

export async function GET() {
  try {
    const response = await fetch('http://kas.katpool.xyz:8080/api/v1/query?query=pool_hash_rate_GHps', {
      cache: 'no-store', // Disable caching at the fetch level
      next: { revalidate: 0 } // Disable caching at the fetch level in Next.js
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error proxying pool hashrate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pool hashrate' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'CDN-Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  }
} 