import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange}
      className="px-4 py-2 border rounded-xl w-full"
    />
  );
}
