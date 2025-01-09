import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes since that's our step size

interface WorkerHashrate {
  metric: {
    __name__: string;
    wallet_address: string;
    wokername: string;
    [key: string]: string;
  };
  values: [number, string][];
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

    // Calculate time range
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours ago
    const step = 300; // 5 minutes in seconds

    // Construct the URL with encoded wallet address
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', `worker_hash_rate_GHps{wallet_address="${wallet}"}`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Process the data to calculate better averages
    const processedResult = data.data.result.map((worker: WorkerHashrate) => {
      const values = worker.values;
      if (!values || values.length === 0) return worker;

      // Calculate averages for different time windows
      const now = Math.floor(Date.now() / 1000);
      const timeWindows = {
        fiveMin: now - (5 * 60),
        oneHour: now - (60 * 60),
        twelveHour: now - (12 * 60 * 60),
        twentyFourHour: now - (24 * 60 * 60)
      };

      // Function to calculate sophisticated average for a time window
      const calculateWindowAverage = (startTime: number) => {
        // Get all values within the time range and convert to numbers
        const windowValues = values
          .filter(([timestamp]) => timestamp >= startTime)
          .map(([_, value]) => Number(value))
          .filter(value => !isNaN(value) && value >= 0); // Filter out NaN and negative values

        if (windowValues.length === 0) return 0;

        // Calculate mean and standard deviation
        const mean = windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length;
        const stdDev = Math.sqrt(
          windowValues.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / windowValues.length
        );

        // Filter out values more than 3 standard deviations from the mean
        const validValues = windowValues.filter(value => 
          Math.abs(value - mean) <= 3 * stdDev
        );

        // Calculate final average from remaining values
        return validValues.length > 0
          ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length
          : 0;
      };

      // Calculate averages for each time window
      const averages = {
        fiveMin: calculateWindowAverage(timeWindows.fiveMin),
        oneHour: calculateWindowAverage(timeWindows.oneHour),
        twelveHour: calculateWindowAverage(timeWindows.twelveHour),
        twentyFourHour: calculateWindowAverage(timeWindows.twentyFourHour)
      };

      // Add the averages to the response
      return {
        ...worker,
        averages
      };
    });

    return NextResponse.json({
      status: 'success',
      data: {
        ...data.data,
        result: processedResult
      }
    });
  } catch (error) {
    console.error('Error fetching worker hashrate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch worker hashrate' },
      { status: 500 }
    );
  }
} 