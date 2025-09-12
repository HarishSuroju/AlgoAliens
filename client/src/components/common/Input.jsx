import React from 'react';

const Input = ({ type = 'text', name, placeholder, value, onChange, required = true }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
    />
  );
};

export default Input;
