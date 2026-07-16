import { useState, useEffect } from 'react';

export default function useGoogleSheet() {
  const [sheetStatus, setSheetStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  return { sheetStatus, loading };
}
