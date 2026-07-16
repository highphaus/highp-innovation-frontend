import React from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Are you sure?' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-4">
        <h3 className="font-bold">{title}</h3>
        <div className="flex gap-4 justify-center">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-650 text-white rounded-xl">Confirm</button>
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
}
