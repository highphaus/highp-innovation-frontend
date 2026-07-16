import { useState } from 'react';

export default function useStore() {
  const [store, setStore] = useState(null);
  return { store };
}
