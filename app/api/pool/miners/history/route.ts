import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface TimeRange {
  days: number;
  recentStepMinutes: number;
  historicalStepHours: number;
}

const TIME_RANGES: Record<string, TimeRange> = {
  '7d': { days: 7, recentStepMinutes: 5, historicalStepHours: 1 },
  '30d': { days: 30, recentStepMinutes: 5, historicalStepHours: 2 },
  '90d': { days: 90, recentStepMinutes: 5, historicalStepHours: 6 },
  '180d': { days: 180, recentStepMinutes: 5, historicalStepHours: 12 }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    if (!TIME_RANGES[range]) {
      throw new Error('Invalid time range');
    }

    const { days, recentStepMinutes, historicalStepHours } = TIME_RANGES[range];
    const end = Math.floor(Date.now() / 1000);
    const recentStart = end - (2 * 60 * 60); // Last 2 hours
    const historicalStart = end - (days * 24 * 60 * 60);

    // Fetch recent data with fine granularity
    const recentUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    recentUrl.searchParams.append('query', 'miner_hash_rate_GHps');
    recentUrl.searchParams.append('start', recentStart.toString());
    recentUrl.searchParams.append('end', end.toString());
    recentUrl.searchParams.append('step', (recentStepMinutes * 60).toString());

    // Fetch historical data with coarser granularity
    const historicalUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    historicalUrl.searchParams.append('query', 'miner_hash_rate_GHps');
    historicalUrl.searchParams.append('start', historicalStart.toString());
    historicalUrl.searchParams.append('end', recentStart.toString());
    historicalUrl.searchParams.append('step', (historicalStepHours * 3600).toString());

    const [recentResponse, historicalResponse] = await Promise.all([
      fetch(recentUrl, { next: { revalidate: 10 } }),
      fetch(historicalUrl, { next: { revalidate: 10 } })
    ]);

    if (!recentResponse.ok || !historicalResponse.ok) {
      console.error('Pool API error:', {
        recentStatus: recentResponse.status,
        historicalStatus: historicalResponse.status,
        recentUrl: recentUrl.toString(),
        historicalUrl: historicalUrl.toString()
      });
      throw new Error(`HTTP error! status: ${recentResponse.status} / ${historicalResponse.status}`);
    }

    const [recentData, historicalData] = await Promise.all([
      recentResponse.json(),
      historicalResponse.json()
    ]);

    // Merge the datasets
    if (recentData.status === 'success' && historicalData.status === 'success') {
      const mergedResult = recentData.data.result.map((series: any) => {
        const historicalSeries = historicalData.data.result.find(
          (h: any) => h.metric.wallet_address === series.metric.wallet_address
        );
        
        if (historicalSeries) {
          return {
            ...series,
            values: [...historicalSeries.values, ...series.values]
          };
        }
        return series;
      });

      return NextResponse.json({
        status: 'success',
        data: {
          resultType: recentData.data.resultType,
          result: mergedResult
        }
      });
    }

    return NextResponse.json({
      status: 'error',
      error: 'Failed to fetch complete miners history'
    });
  } catch (error) {
    console.error('Error fetching miners history:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch miners history' },
      { status: 500 }
    );
  }
} 