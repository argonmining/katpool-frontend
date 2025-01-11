import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query');
    url.searchParams.append('query', 'active_workers_10m_count');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Count active miners by ASIC type
    const minerTypeCount: { [key: string]: number } = {};
    
    data.data.result.forEach((item: any) => {
      const asicType = item.metric.asic_type;
      const isActive = Number(item.value[1]) === 1;
      
      if (isActive) {
        minerTypeCount[asicType] = (minerTypeCount[asicType] || 0) + 1;
      }
    });

    // Convert to array format for the chart
    const minerTypes = Object.keys(minerTypeCount);
    const minerCounts = minerTypes.map(type => minerTypeCount[type]);

    return NextResponse.json({
      status: 'success',
      data: {
        labels: minerTypes,
        values: minerCounts
      }
    });

  } catch (error) {
    console.error('Error fetching miner types:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch miner types' },
      { status: 500 }
    );
  }
} 