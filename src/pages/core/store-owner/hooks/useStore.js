import { useState, useEffect } from 'react';

export default function useStore() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  return { store, loading };
}
