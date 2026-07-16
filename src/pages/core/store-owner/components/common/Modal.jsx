import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">✕</button>
        {children}
      </div>
    </div>
  );
}
