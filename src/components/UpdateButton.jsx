// RegisterButton.jsx
import React, { useState } from 'react';

const UpdateButton = ({ onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onUpdate) {
        onUpdate(); // 登録完了を通知
      }
    }, 2000);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`${
        loading ? 'bg-green-300' : 'bg-green-500'
      } text-white px-4 py-2 rounded-lg text-lg hover:bg-green-600 transition duration-200`}
      disabled={loading}
    >
      {loading ? '変更中...' : '変更'}
    </button>
  );
};

export default UpdateButton;
