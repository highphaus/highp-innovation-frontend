import React from 'react';

export default function MobileSidebar() {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 md:hidden">
      <div className="w-64 bg-white h-full p-6">
        <h2 className="font-bold text-neutral-900">MOBILE NAV</h2>
      </div>
    </div>
  );
}
