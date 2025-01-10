import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 21600;

async function fetchKaspaHashrate(cursor?: string) {
  const baseUrl = 'https://kaspa-hashrate-api.tng-inc.workers.dev/historical';
  const url = cursor ? `${baseUrl}?cursor=${cursor}` : baseUrl;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Kaspa hashrate:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate the start timestamp based on the range (in milliseconds)
    const now = Date.now();
    const rangeInMs: { [key: string]: number } = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '180d': 180 * 24 * 60 * 60 * 1000,
      '365d': 365 * 24 * 60 * 60 * 1000,
    };

    const startTime = now - (rangeInMs[range] || rangeInMs['7d']);
    let allData: any[] = [];
    let hasMore = true;
    let cursor: string | undefined;

    // Fetch all data and combine it
    while (hasMore) {
      const response = await fetchKaspaHashrate(cursor);
      const filteredData = response.data.filter((item: any) => 
        parseInt(item.key) >= startTime
      );
      allData = [...allData, ...filteredData];
      cursor = response.cursor;
      hasMore = response.hasMore && response.data.some((item: any) => 
        parseInt(item.key) >= startTime
      );
    }

    // Sort data by timestamp
    allData.sort((a, b) => parseInt(a.key) - parseInt(b.key));

    // Return data in the exact format from the API
    return NextResponse.json({
      data: allData.map(item => ({
        key: item.key,
        value: item.value  // Values are already doubled in the API
      })),
      cursor: null,
      hasMore: false
    });

  } catch (error) {
    console.error('Error in Kaspa hashrate route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch Kaspa hashrate data' },
      { status: 500 }
    );
  }
} 