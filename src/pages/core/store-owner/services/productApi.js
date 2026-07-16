import axios from 'axios';

export const getProducts = async (slug) => {
  const res = await axios.get(`/api/products/${slug}`);
  return res.data;
};

export const createProduct = async (payload) => {
  const res = await axios.post('/api/products', payload);
  return res.data;
};

export const updateProduct = async (productId, payload) => {
  const res = await axios.put(`/api/products/${productId}`, payload);
  return res.data;
};
