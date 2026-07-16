import { useState, useEffect } from 'react';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  return { orders, loading };
}
