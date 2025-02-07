// src/components/InputField.jsx
import React from 'react';

const InputField = ({ type, name, placeholder, required, value, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
};

export default InputField;
