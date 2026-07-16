import React from 'react';

export default function StatusBadge({ status }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
      {status}
    </span>
  );
}
