import axios from 'axios';

export const getOrders = async (slug) => {
  const res = await axios.get(`/api/orders/${slug}`);
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await axios.patch(`/api/orders/${orderId}/status`, { status });
  return res.data;
};
