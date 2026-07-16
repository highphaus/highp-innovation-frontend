import axios from 'axios';

export const getStoreData = async (slug) => {
  const res = await axios.get(`/api/stores/${slug}`);
  return res.data;
};

export const updateStoreProfile = async (slug, data) => {
  const res = await axios.put(`/api/stores/${slug}`, data);
  return res.data;
};
