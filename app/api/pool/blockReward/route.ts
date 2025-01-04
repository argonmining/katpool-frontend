import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface BlockOutput {
  amount: string;
  verboseData: {
    scriptPublicKeyAddress: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blockHash = searchParams.get('blockHash');

    if (!blockHash) {
      throw new Error('Block hash is required');
    }

    const poolRewardAddress = process.env.POOL_REWARD_ADDRESS;
    if (!poolRewardAddress) {
      throw new Error('Pool reward address not configured');
    }

    const response = await fetch(`https://api.kaspa.org/blocks/${blockHash}?includeColor=false`);

    if (!response.ok) {
      throw new Error('Failed to fetch block data');
    }

    const data = await response.json();

    // Find the output that matches our pool address
    const rewardOutput = data.transactions[0].outputs.find(
      (output: BlockOutput) => output.verboseData.scriptPublicKeyAddress === poolRewardAddress
    );

    if (!rewardOutput) {
      throw new Error('No matching reward output found');
    }

    // Convert the amount (moving decimal 8 places left)
    const rawAmount = rewardOutput.amount;
    const amount = Number(BigInt(rawAmount)) / (10 ** 8);

    return NextResponse.json({
      status: 'success',
      data: {
        amount: amount.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error fetching block reward:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch block reward' },
      { status: 500 }
    );
  }
} 