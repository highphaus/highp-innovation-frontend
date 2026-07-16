import React from 'react';

export default function OrderCard({ order }) {
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm">
      <h3 className="font-bold">Order #{order?._id || 'ID'}</h3>
      <p className="text-neutral-500">₹{order?.totalAmount || 0}</p>
    </div>
  );
}
