import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 60; // Refresh price every minute

interface KaspaPrice {
  price: number;
}

export async function GET() {
  try {
    const response = await fetch('https://api.kaspa.org/info/price?stringOnly=false');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.price) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: {
        price: data.price
      }
    });
  } catch (error) {
    console.error('Error fetching Kaspa price:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Kaspa price' },
      { status: 500 }
    );
  }
} 