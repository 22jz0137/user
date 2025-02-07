import React from 'react';

const VoidButton = () => {
  return (
    <button
      type="button"
      className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-yellow-600 transition duration-200"
    >
      非表示
    </button>
  );
};

export default VoidButton;
