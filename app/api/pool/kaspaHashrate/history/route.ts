import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 21600;

async function fetchKaspaHashrate() {
  const baseUrl = 'https://kaspa-hashrate-api.tng-inc.workers.dev/historical';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(baseUrl, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    const response = await fetchKaspaHashrate();
    const data = response.data.sort((a: any, b: any) => parseInt(a.key) - parseInt(b.key));

    return NextResponse.json({
      status: 'success',
      data: data
    });

  } catch (error) {
    console.error('Error in Kaspa hashrate route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch Kaspa hashrate data' },
      { status: 500 }
    );
  }
} 