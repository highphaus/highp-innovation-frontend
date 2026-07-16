import { useState } from 'react';

export default function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  return { analytics };
}
