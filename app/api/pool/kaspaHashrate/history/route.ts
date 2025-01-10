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

export async function GET() {
  try {
    let allData: any[] = [];
    let hasMore = true;
    let cursor: string | undefined;

    // Fetch all data using pagination
    while (hasMore) {
      const response = await fetchKaspaHashrate(cursor);
      allData = [...allData, ...response.data];
      cursor = response.cursor;
      hasMore = response.hasMore;
    }

    // Sort data by timestamp
    allData.sort((a, b) => parseInt(a.key) - parseInt(b.key));

    return NextResponse.json({
      status: 'success',
      data: allData
    });

  } catch (error) {
    console.error('Error in Kaspa hashrate route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch Kaspa hashrate data' },
      { status: 500 }
    );
  }
} 