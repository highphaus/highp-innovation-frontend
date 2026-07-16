import React from 'react';

export default function NoData({ message = 'No entries found' }) {
  return <div className="text-center py-10 text-neutral-450">{message}</div>;
}
