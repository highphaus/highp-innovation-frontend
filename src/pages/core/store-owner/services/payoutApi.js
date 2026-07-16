import axios from 'axios';

export const getPayouts = async (slug) => {
  const res = await axios.get(`/api/stores/${slug}/payouts`);
  return res.data;
};
