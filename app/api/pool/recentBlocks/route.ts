import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface BlockMetric {
  metric: {
    block_hash: string;
    daa_score: string;
    timestamp: string;
  };
  value: [number, string];
}

interface Block {
  blockHash: string;
  daaScore: string;
  timestamp: string;
}

export async function GET() {
  try {
    const response = await fetch('http://kas.katpool.xyz:8080/api/v1/query?query=miner_rewards');

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Create a Map to store unique blocks by hash
    const blocksMap = new Map<string, Block>();

    // Process each result and store only unique blocks
    data.data.result.forEach((item: BlockMetric) => {
      const blockHash = item.metric.block_hash;
      if (!blocksMap.has(blockHash)) {
        blocksMap.set(blockHash, {
          blockHash,
          daaScore: item.metric.daa_score,
          timestamp: item.metric.timestamp
        });
      }
    });

    // Convert Map to array and sort by timestamp (newest first)
    const blocks = Array.from(blocksMap.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6); // Get only the 6 most recent blocks

    return NextResponse.json({
      status: 'success',
      data: {
        blocks
      }
    });

  } catch (error) {
    console.error('Error fetching recent blocks:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch recent blocks' },
      { status: 500 }
    );
  }
} 