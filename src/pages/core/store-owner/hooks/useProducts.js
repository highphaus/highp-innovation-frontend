import { useState, useEffect } from 'react';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return { products, loading };
}
