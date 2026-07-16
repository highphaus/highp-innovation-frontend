import { useState, useEffect } from 'react';

export default function useBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  return { balance, loading };
}
