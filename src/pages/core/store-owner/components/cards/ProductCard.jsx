import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm">
      <h3 className="font-bold">{product?.name || 'Product'}</h3>
      <p className="text-neutral-500">₹{product?.price || 0}</p>
    </div>
  );
}
