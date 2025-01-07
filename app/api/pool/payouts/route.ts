import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

interface Payout {
  wallet_address: string[];
  amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface ProcessedPayout {
  walletAddress: string;
  amount: number;
  timestamp: number;
  transactionHash: string;
}

export async function GET(request: Request) {
  try {
    const response = await fetch('http://kas.katpool.xyz:8080/api/pool/payouts');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process the payouts to format amounts and timestamps
    const processedPayouts = data.map((payout: Payout) => ({
      walletAddress: payout.wallet_address[0],
      amount: Number(payout.amount) / 1e8, // Convert from satoshis to KAS
      timestamp: new Date(payout.timestamp).getTime(),
      transactionHash: payout.transaction_hash
    }));

    // Sort by timestamp descending (newest first)
    processedPayouts.sort((a: ProcessedPayout, b: ProcessedPayout) => b.timestamp - a.timestamp);

    return NextResponse.json({
      status: 'success',
      data: processedPayouts
    });
  } catch (error) {
    console.error('Error fetching pool payouts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pool payouts' },
      { status: 500 }
    );
  }
} 