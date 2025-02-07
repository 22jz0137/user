// DeleteButton.jsx
import React, { useState } from 'react';

const DeleteButton = ({ onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onDelete) {
        onDelete(); // 削除完了を通知
      }
    }, 2000);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`${
        loading ? 'bg-red-300' : 'bg-red-500'
      } text-white px-4 py-2 rounded-lg text-lg mr-4 hover:bg-red-600 transition duration-200`}
      disabled={loading}
    >
      {loading ? '削除中...' : '削除'}
    </button>
  );
};

export default DeleteButton;
