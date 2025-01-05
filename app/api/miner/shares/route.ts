import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10; // Revalidate every 10 seconds

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

    // Calculate timestamps for last hour with 1-minute precision
    const end = Math.floor(Date.now() / 1000);
    const start = end - (60 * 60); // 1 hour ago
    const step = 60; // 1 minute in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    
    // Construct and encode the full query parameter
    const queryString = `added_miner_shares_1min_count{wallet_address="${wallet}"}`;
    url.searchParams.append('query', queryString);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      next: { revalidate: 10 } // Cache for 10 seconds
    });

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process the data to get the last share time for each miner
    if (data.status === 'success' && data.data?.result) {
      const results = data.data.result;
      const processedResults = results.map((result: any) => {
        // Filter out zero values and get the last non-zero share time
        const nonZeroValues = result.values.filter(([_, value]: [number, string]) => value !== '0');
        const lastShareValue = nonZeroValues.length > 0 ? nonZeroValues[nonZeroValues.length - 1] : result.values[result.values.length - 1];
        
        return {
          ...result,
          values: [lastShareValue] // Only keep the last share value
        };
      });

      return NextResponse.json({
        status: 'success',
        data: {
          result: processedResults
        }
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in miner shares API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner shares' },
      { status: 500 }
    );
  }
} 