import { useState, useEffect } from 'react';

export function useSimulatedNetworkDelay(delayMs = 1500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
}
