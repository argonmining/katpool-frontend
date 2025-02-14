import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 60; // Refresh price every minute

interface NachoPrice {
  'nacho-the-kat': {
    usd: number;
  };
}

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=nacho-the-kat&vs_currencies=usd',
      {
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-f8E4yaD4zQYKtqHawS59TAnY'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NachoPrice = await response.json();

    if (!data['nacho-the-kat']?.usd) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: {
        price: data['nacho-the-kat'].usd
      }
    });
  } catch (error) {
    console.error('Error fetching NACHO price:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch NACHO price' },
      { status: 500 }
    );
  }
} 