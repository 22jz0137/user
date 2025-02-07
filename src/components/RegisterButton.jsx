// RegisterButton.jsx
import React, { useState } from 'react';

const RegisterButton = ({ onRegister }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onRegister) {
        onRegister(); // 登録完了を通知
      }
    }, 2000);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`${
        loading ? 'bg-blue-300' : 'bg-blue-500'
      } text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-200`}
      disabled={loading}
    >
      {loading ? '登録中...' : '登録'}
    </button>
  );
};

export default RegisterButton;
