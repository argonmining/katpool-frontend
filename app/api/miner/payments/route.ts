import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes since payments are infrequent

interface Payment {
  id: number;
  wallet_address: string[];
  amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface ProcessedPayment {
  id: number;
  walletAddress: string;
  amount: string; // Keep as string to maintain precision
  timestamp: number;
  transactionHash: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`http://kas.katpool.xyz:8080/api/payments/${wallet}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process the payments but keep amounts in sompi
    const processedPayments = data.map((payment: Payment) => ({
      id: payment.id,
      walletAddress: payment.wallet_address[0],
      amount: payment.amount, // Keep original sompi amount as string
      timestamp: new Date(payment.timestamp).getTime(),
      transactionHash: payment.transaction_hash
    }));

    // Sort by timestamp descending (newest first)
    processedPayments.sort((a: ProcessedPayment, b: ProcessedPayment) => b.timestamp - a.timestamp);

    return NextResponse.json({
      status: 'success',
      data: processedPayments
    });
  } catch (error) {
    console.error('Error fetching miner payments:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner payments' },
      { status: 500 }
    );
  }
} 