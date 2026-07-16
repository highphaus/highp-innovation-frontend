import axios from 'axios';

export const getStaff = async (slug) => {
  const res = await axios.get(`/api/stores/${slug}/staff`);
  return res.data;
};

export const addStaff = async (slug, payload) => {
  const res = await axios.post(`/api/stores/${slug}/staff`, payload);
  return res.data;
};

export const deleteStaff = async (slug, id) => {
  const res = await axios.delete(`/api/stores/${slug}/staff/${id}`);
  return res.data;
};
