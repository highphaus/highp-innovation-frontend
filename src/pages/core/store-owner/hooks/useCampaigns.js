import { useState, useEffect } from 'react';

export default function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  return { campaigns, loading };
}
