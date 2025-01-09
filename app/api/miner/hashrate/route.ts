import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

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

    // Calculate timestamps for a 7-day window
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime;
    const startTime = endTime - (7 * 24 * 60 * 60); // 7 days
    
    // Use 5-minute intervals for recent data (last 2 hours)
    // and 30-minute intervals for older data to balance accuracy and data size
    const recentStartTime = endTime - (2 * 60 * 60); // 2 hours ago
    
    // Fetch recent data (5-minute intervals)
    const recentUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    const recentQuery = `miner_hash_rate_GHps{wallet_address="${wallet}"}`;
    recentUrl.searchParams.append('query', recentQuery);
    recentUrl.searchParams.append('start', recentStartTime.toString());
    recentUrl.searchParams.append('end', endTime.toString());
    recentUrl.searchParams.append('step', '300'); // 5 minutes

    // Fetch historical data (30-minute intervals)
    const historicalUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    historicalUrl.searchParams.append('query', recentQuery);
    historicalUrl.searchParams.append('start', startTime.toString());
    historicalUrl.searchParams.append('end', recentStartTime.toString());
    historicalUrl.searchParams.append('step', '1800'); // 30 minutes

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

    // If either request failed, return the error
    return NextResponse.json({
      status: 'error',
      error: 'Failed to fetch complete hashrate data'
    });
  } catch (error: unknown) {
    console.error('Error in miner hashrate API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner hashrate' },
      { status: 500 }
    );
  }
} 