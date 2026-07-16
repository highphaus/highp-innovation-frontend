import { useState, useEffect } from 'react';

export default function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  return { analytics, loading };
}
