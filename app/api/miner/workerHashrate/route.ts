import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface WorkerHashrate {
  metric: {
    __name__: string;
    wallet_address: string;
    miner_id: string;
    [key: string]: string;
  };
  values: [number, string][];
}

interface TimeWindow {
  duration: number;
  step: number;
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

    const now = Math.floor(Date.now() / 1000);

    // Define time windows with appropriate step sizes
    const timeWindows: Record<string, TimeWindow> = {
      fifteenMin: {
        duration: 15 * 60,
        step: 60    // 1-minute intervals for 15 min (15 points)
      },
      oneHour: {
        duration: 60 * 60,
        step: 300   // 5-minute intervals for 1 hour (12 points)
      },
      twelveHour: {
        duration: 12 * 60 * 60,
        step: 900   // 15-minute intervals for 12 hours (48 points)
      },
      twentyFourHour: {
        duration: 24 * 60 * 60,
        step: 1800  // 30-minute intervals for 24 hours (48 points)
      }
    };

    // Create API calls for each time window
    const fetchPromises = Object.entries(timeWindows).map(([key, window]) => {
      const end = now;
      const start = end - window.duration;
      const url = new URL(`http://kas.katpool.xyz:8080/api/v1/query_range?query=worker_hash_rate_GHps{wallet_address="${wallet}"}&start=${start}&end=${end}&step=${window.step}`);
      return fetch(url).then(res => res.json()).then(data => ({ key, data }));
    });

    // Fetch all data in parallel
    const responses = await Promise.all(fetchPromises);

    // Process the results
    const workerData = new Map<string, any>();

    responses.forEach(({ key, data }) => {
      if (data.status !== 'success') return;

      data.data.result.forEach((worker: WorkerHashrate) => {
        const minerId = worker.metric.miner_id;
        if (!workerData.has(minerId)) {
          workerData.set(minerId, {
            metric: worker.metric,
            averages: {}
          });
        }

        const values = worker.values;
        if (!values || values.length === 0) return;

        // Calculate average for this time window
        const sum = values.reduce((acc, [_, val]) => acc + Number(val), 0);
        const avg = sum / values.length;

        workerData.get(minerId).averages[key] = avg;
      });
    });

    // Convert Map to array for response
    const processedResult = Array.from(workerData.values()).map(worker => ({
      metric: worker.metric,
      averages: {
        fifteenMin: worker.averages.fifteenMin ?? 0,
        oneHour: worker.averages.oneHour ?? 0,
        twelveHour: worker.averages.twelveHour ?? 0,
        twentyFourHour: worker.averages.twentyFourHour ?? 0
      }
    }));

    return NextResponse.json({
      status: 'success',
      data: {
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