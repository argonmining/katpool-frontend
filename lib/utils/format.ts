export const formatHashrate = (hashrate: number): string => {
  // Handle invalid inputs
  if (!Number.isFinite(hashrate) || hashrate < 0) {
    console.error('Invalid hashrate value:', hashrate);
    return 'Error';
  }

  try {
    // Input is in GH/s, convert down or up in steps of 1000
    if (hashrate < 0.000001) { // < 0.000001 GH/s (< 1 KH/s)
      return `${(hashrate * 1000000000).toFixed(2)} H/s`;
    } else if (hashrate < 0.001) { // < 0.001 GH/s (< 1 MH/s)
      return `${(hashrate * 1000000).toFixed(2)} KH/s`;
    } else if (hashrate < 1) { // < 1 GH/s
      return `${(hashrate * 1000).toFixed(2)} MH/s`;
    } else if (hashrate < 1000) { // < 1 TH/s
      return `${hashrate.toFixed(2)} GH/s`;
    } else if (hashrate < 1000000) { // < 1 PH/s
      return `${(hashrate / 1000).toFixed(2)} TH/s`;
    } else if (hashrate < 1000000000) { // < 1 EH/s
      return `${(hashrate / 1000000).toFixed(2)} PH/s`;
    } else {
      return `${(hashrate / 1000000000).toFixed(2)} EH/s`;
    }
  } catch (error) {
    console.error('Error formatting hashrate:', error);
    return 'Error';
  }
}; 