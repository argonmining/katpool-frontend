import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 21600;

export async function GET() {
  try {
    const response = await fetch('https://kaspa-hashrate-api.tng-inc.workers.dev/historical');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug log
    console.log('API Response:', data);
    
    // Ensure we have the expected data structure
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received');
    }

    return NextResponse.json({
      status: 'success',
      data: data.data
    });

  } catch (error) {
    console.error('Error in Kaspa hashrate route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch Kaspa hashrate data' },
      { status: 500 }
    );
  }
} 