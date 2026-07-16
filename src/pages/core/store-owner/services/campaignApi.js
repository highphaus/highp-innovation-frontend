import axios from 'axios';

export const getCampaigns = async (slug) => {
  const res = await axios.get(`/api/campaigns/${slug}`);
  return res.data;
};
