import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/img/back.jpg'; // 画像のパスをインポート

const BackIcon = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 一つ前のページに戻る
  };

  return (
    <button onClick={handleBackClick} type="button" className="flex items-center">
      <img src={backIcon} alt="Back" className="w-8 h-8 mr-2" /> {/* 画像サイズ調整 */}
    </button>
  );
};

export default BackIcon;
