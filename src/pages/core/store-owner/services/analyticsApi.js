import axios from 'axios';

export const getAnalytics = async (slug) => {
  const res = await axios.get(`/api/analytics/${slug}`);
  return res.data;
};
