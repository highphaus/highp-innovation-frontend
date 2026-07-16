export const calculateRevenueSum = (orders) => {
  return orders.reduce((sum, order) => {
    if (order.status === 'completed' || order.status === 'delivered') {
      return sum + (order.totalAmount || 0);
    }
    return sum;
  }, 0);
};
