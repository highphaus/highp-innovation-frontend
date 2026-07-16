import React from 'react';

export default function EmptyState({ message = 'No data available' }) {
  return <div className="text-center py-10 text-neutral-400">{message}</div>;
}
