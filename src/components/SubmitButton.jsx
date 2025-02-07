// src/components/SubmitButton.jsx
import React from 'react';

const SubmitButton = ({ label }) => {
  return (
    <button
      type="submit"
      className="w-full py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0e7b75] transition duration-200"
    >
      {label}
    </button>
  );
};

export default SubmitButton;
