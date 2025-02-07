import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleCancel = (event) => {
    event.preventDefault(); // フォームのデフォルト動作を防ぐ
    navigate(-1); // 一つ前のページに戻る
  };

  return (
    <button
      onClick={handleCancel}
      type="button" // ボタンのタイプを設定
      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-lg "
    >
      戻る
    </button>
  );
};

export default BackButton;
