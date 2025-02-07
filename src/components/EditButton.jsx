import React from 'react';
import image2 from '../assets/img/edit.png';
// アイコンボタンコンポーネン1ト
const EditButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="ml-2 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
      aria-label="編集"
    >
      <img 
        src={image2}
        alt="編集" 
        className="w-4 h-4 inline" // アイコンのサイズ調整
      />
    </button>
  );
};

export default EditButton;
