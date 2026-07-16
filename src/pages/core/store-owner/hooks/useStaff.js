import { useState, useEffect } from 'react';

export default function useStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  return { staff, loading };
}
